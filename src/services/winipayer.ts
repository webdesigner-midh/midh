import crypto from 'crypto';
import { signReceiptPayload, timingSafeEqualString } from '@/lib/server-crypto';

/**
 * Service d'intégration WiniPayer 2.0 pour le MIDH
 * Documentation officielle : https://docs.winipayer.com/app/2.0-fr/
 */

export interface CreateDonationParams {
  amount: number;
  donorType?: 'particulier' | 'organisation';
  donorName: string;
  representativeName?: string;
  donorEmail: string;
  donorPhone?: string;
  operator?: string;
  donationType?: 'once' | 'monthly';
  comment?: string;
}

export interface WiniPayerInvoiceResult {
  success: boolean;
  checkoutUrl?: string;
  uuid?: string;
  crypto?: string;
  reference?: string;
  expiredAt?: string;
  isSimulated?: boolean;
  error?: string;
}

export interface WiniPayerIpnPayload {
  uuid?: string;
  crypto?: string;
  env?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  state?: string;
  hash?: string;
  created_at?: string;
  custom_data?: {
    donor_name?: string;
    donor_email?: string;
    donor_phone?: string;
    idempotency_key?: string;
    operator?: string;
  } | string;
  [key: string]: unknown;
}

// Cache d'idempotence en mémoire (garde en mémoire les transactions traitées)
const processedTransactions = new Set<string>();

/**
 * Récupère l'URL de base du site
 * Impérativement le domaine officiel public https://www.midh-ci.org
 * On n'utilise JAMAIS les domaines internes *.vercel.app qui sont protégés par le SSO Vercel
 */
export function getSiteBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl && !envUrl.includes('vercel.app') && !envUrl.includes('localhost')) {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      return envUrl.replace(/\/$/, '');
    }
    return `https://${envUrl.replace(/\/$/, '')}`;
  }
  return 'https://www.midh-ci.org';
}

/**
 * Crée une facture de don via l'API Standard WiniPayer
 */
export async function createDonationInvoice(
  params: CreateDonationParams
): Promise<WiniPayerInvoiceResult> {
  const applyKey = process.env.WINIPAYER_APPLY_KEY?.trim() || '';
  const tokenKey = process.env.WINIPAYER_TOKEN_KEY?.trim() || '';
  const env = (process.env.WINIPAYER_ENV?.toLowerCase() === 'prod' ? 'prod' : 'test') as 'prod' | 'test';
  const baseUrl = getSiteBaseUrl();

  // Clé d'idempotence unique pour ce don
  const uniqueRef = `MIDH-DON-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  const returnQuery = new URLSearchParams({
    ref: uniqueRef,
    amount: String(params.amount),
    name: params.donorName,
    email: params.donorEmail,
    phone: params.donorPhone || '',
    type: params.donorType || 'particulier',
    representative: params.representativeName || '',
  });
  const receiptSig = signReceiptPayload({
    ref: uniqueRef,
    amount: params.amount,
    name: params.donorName,
    email: params.donorEmail,
    phone: params.donorPhone || '',
    donorType: params.donorType || 'particulier',
    representativeName: params.representativeName || '',
  });
  returnQuery.set('sig', receiptSig);

  // Vérification de sécurité des identifiants
  if (!tokenKey) {
    console.warn(
      '[WiniPayer] WINIPAYER_TOKEN_KEY non défini dans les variables d\'environnement. Mode simulation actif.'
    );
    const simQuery = new URLSearchParams(returnQuery);
    simQuery.set('simulated', 'true');
    return {
      success: true,
      checkoutUrl: `${baseUrl}/don/succes?${simQuery.toString()}`,
      uuid: `simulated-${uniqueRef}`,
      reference: uniqueRef,
      isSimulated: true,
    };
  }

  // Nettoyage et formatage du téléphone pour l'API WiniPayer (10 chiffres sans indicatif)
  const rawDigits = (params.donorPhone || '').replace(/[^0-9]/g, '');
  const cleanPhone = rawDigits.startsWith('225') && rawDigits.length === 13 ? rawDigits.slice(3) : rawDigits;

  const referencePayload: Record<string, string> = {
    identifier: uniqueRef,
    name: params.donorName.slice(0, 80),
    email: params.donorEmail.slice(0, 80),
  };
  if (cleanPhone) {
    referencePayload.phone = cleanPhone;
  }

  const payload = {
    env,
    amount: Math.round(params.amount),
    description: `Don MIDH - ${params.donorName.slice(0, 40)}`,
    cancel_url: `${baseUrl}/don?status=cancelled&ref=${encodeURIComponent(uniqueRef)}`,
    return_url: `${baseUrl}/don/succes?${returnQuery.toString()}`,
    callback_url: `${baseUrl}/api/don/ipn`,
    reference: JSON.stringify(referencePayload),
    items: JSON.stringify([
      {
        name: `Don MIDH (${params.donorType === 'organisation' ? 'Organisation' : 'Particulier'})`,
        quantity: 1,
        unit_price: Math.round(params.amount),
      },
    ]),
    custom_data: JSON.stringify({
      ref: uniqueRef,
      donor_type: params.donorType || 'particulier',
      donor_name: params.donorName,
      representative_name: params.representativeName || '',
      donor_email: params.donorEmail,
      donor_phone: params.donorPhone || '',
      operator: params.operator || 'mobile_money',
    }),
  };

  try {
    const res = await fetch('https://api-v2.winipayer.com/checkout/standard/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Merchant-Apply': applyKey,
        'X-Merchant-Token': tokenKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      let errorMsg = `Erreur WiniPayer (${res.status})`;

      if (Array.isArray(data.messages) && data.messages.length > 0) {
        errorMsg = data.messages.map((m: unknown) => (typeof m === 'object' ? JSON.stringify(m) : String(m))).join(', ');
      } else if (data.errors) {
        if (typeof data.errors === 'string') {
          errorMsg = data.errors;
        } else if (Array.isArray(data.errors) && data.errors.length > 0) {
          errorMsg = data.errors
            .map((e: unknown) => (typeof e === 'object' && e !== null && 'msg' in e ? String((e as { msg: unknown }).msg) : String(e)))
            .join(', ');
        } else if (typeof data.errors === 'object' && data.errors !== null) {
          const errObj = data.errors as Record<string, unknown>;
          if (errObj.msg) {
            errorMsg = String(errObj.msg);
          } else if (errObj.message) {
            errorMsg = String(errObj.message);
          } else {
            const vals = Object.values(errObj).flatMap((v) => (Array.isArray(v) ? v : [v]));
            const strVals = vals.map((v) => (typeof v === 'object' && v !== null && 'msg' in v ? String((v as { msg: unknown }).msg) : String(v)));
            if (strVals.length > 0) errorMsg = strVals.join(', ');
          }
        }
      } else if (typeof data.message === 'string' && data.message.trim().length > 0) {
        errorMsg = data.message;
      }

      console.error('[WiniPayer] Erreur de création de facture :', errorMsg, data);
      return {
        success: false,
        error: errorMsg,
      };
    }

    const results = (typeof data.results === 'object' && data.results !== null ? data.results : {}) as Record<string, unknown>;
    const root = (typeof data === 'object' && data !== null ? data : {}) as Record<string, unknown>;

    const cryptoToken =
      (typeof results.crypto === 'string' && results.crypto ? results.crypto : null) ||
      (typeof root.crypto === 'string' && root.crypto ? root.crypto : null);

    const uuid =
      (typeof results.uuid === 'string' && results.uuid ? results.uuid : null) ||
      (typeof root.uuid === 'string' && root.uuid ? root.uuid : null);

    const expiredAt =
      (typeof results.expired_at === 'string' && results.expired_at ? results.expired_at : null) ||
      (typeof root.expired_at === 'string' && root.expired_at ? root.expired_at : null);

    // Résolution robuste de l'URL de paiement officielle WiniPayer v2
    // Évite l'URL erronée se terminant par /null lorsque checkout_process est mal renseigné
    const candidateUrls = [
      typeof root.checkout_link === 'string' ? root.checkout_link : null,
      typeof results.checkout_link === 'string' ? results.checkout_link : null,
      typeof results.checkout_process === 'string' ? results.checkout_process : null,
      typeof root.checkout_process === 'string' ? root.checkout_process : null,
      cryptoToken ? `https://checkout.winipayer.com/process/tng/${cryptoToken}` : null,
    ];

    const validCheckoutUrl = candidateUrls.find(
      (url): url is string => Boolean(url && url.startsWith('http') && !url.endsWith('/null') && !url.includes('/null?'))
    );

    if (!validCheckoutUrl) {
      console.error('[WiniPayer] Impossible de résoudre le lien de paiement valide :', data);
      return {
        success: false,
        error: 'Lien de paiement WiniPayer invalide ou indisponible.',
      };
    }

    return {
      success: true,
      checkoutUrl: validCheckoutUrl,
      uuid: uuid || undefined,
      crypto: cryptoToken || undefined,
      expiredAt: expiredAt || undefined,
      reference: uniqueRef,
    };
  } catch (error) {
    console.error('[WiniPayer] Exception réseau :', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de communication avec WiniPayer',
    };
  }
}

/**
 * Vérification d'idempotence pour éviter les doublons lors des rappels IPN
 */
export function isTransactionAlreadyProcessed(transactionId: string): boolean {
  return processedTransactions.has(transactionId);
}

/**
 * Marque une transaction comme traitée dans le registre d'idempotence
 */
export function markTransactionProcessed(transactionId: string): void {
  processedTransactions.add(transactionId);
  // Nettoyage automatique après 24 heures pour éviter les fuites mémoire
  setTimeout(() => {
    processedTransactions.delete(transactionId);
  }, 24 * 60 * 60 * 1000);
}

/**
 * Vérifie la signature cryptographique (Hash SHA-256) d'un IPN WiniPayer
 */
export function verifyIpnSignature(payload: WiniPayerIpnPayload): boolean {
  const privateKey = process.env.WINIPAYER_PRIVATE_KEY?.trim();
  const env = (process.env.WINIPAYER_ENV?.toLowerCase() === 'prod' ? 'prod' : 'test') as 'prod' | 'test';

  if (env === 'prod') {
    if (!privateKey) {
      console.error('[WiniPayer IPN] WINIPAYER_PRIVATE_KEY manquante en production : requête rejetée.');
      return false;
    }
    if (!payload.hash || !payload.uuid) {
      return false;
    }
    const rawString = `${privateKey}${payload.uuid}${payload.crypto || ''}${payload.amount || ''}${payload.created_at || ''}`;
    const calculatedHash = crypto.createHash('sha256').update(rawString).digest('hex');
    return timingSafeEqualString(calculatedHash.toLowerCase(), payload.hash.toLowerCase());
  }

  // En mode TEST : si une clé privée et un hash sont présents, vérifier cryptographiquement
  if (privateKey && payload.hash && payload.uuid) {
    const rawString = `${privateKey}${payload.uuid}${payload.crypto || ''}${payload.amount || ''}${payload.created_at || ''}`;
    const calculatedHash = crypto.createHash('sha256').update(rawString).digest('hex');
    return timingSafeEqualString(calculatedHash.toLowerCase(), payload.hash.toLowerCase());
  }

  console.warn('[WiniPayer IPN] Notification acceptée en mode TEST sans signature complète.');
  return true;
}

