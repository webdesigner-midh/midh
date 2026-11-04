import crypto from 'crypto';

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
 */
export function getSiteBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (envUrl) {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      return envUrl.replace(/\/$/, '');
    }
    return `https://${envUrl.replace(/\/$/, '')}`;
  }
  return 'https://midh-ci.org';
}

/**
 * Crée une facture de don via l'API Standard WiniPayer
 */
export async function createDonationInvoice(
  params: CreateDonationParams
): Promise<WiniPayerInvoiceResult> {
  const applyKey = process.env.WINIPAYER_APPLY_KEY?.trim() || '';
  const tokenKey = process.env.WINIPAYER_TOKEN_KEY?.trim();
  const env = (process.env.WINIPAYER_ENV?.toLowerCase() === 'prod' ? 'prod' : 'test') as 'prod' | 'test';
  const baseUrl = getSiteBaseUrl();

  // Clé d'idempotence unique pour ce don
  const uniqueRef = `MIDH-DON-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  // Vérification de sécurité des identifiants
  if (!tokenKey) {
    console.warn(
      '[WiniPayer] WINIPAYER_TOKEN_KEY non défini dans les variables d\'environnement. Mode simulation actif.'
    );
    // Mode simulation / fallback gracieux pour tester l'UI sans bloquer
    return {
      success: true,
      checkoutUrl: `${baseUrl}/don/succes?ref=${uniqueRef}&amount=${params.amount}&simulated=true&name=${encodeURIComponent(
        params.donorName
      )}`,
      uuid: `simulated-${uniqueRef}`,
      reference: uniqueRef,
      isSimulated: true,
    };
  }

  const payload = {
    env,
    amount: Math.round(params.amount),
    description: `Don MIDH - ${params.donorName.slice(0, 40)}`,
    cancel_url: `${baseUrl}/don?status=cancelled&ref=${encodeURIComponent(uniqueRef)}`,
    return_url: `${baseUrl}/don/succes?ref=${encodeURIComponent(uniqueRef)}&amount=${params.amount}&name=${encodeURIComponent(params.donorName)}&email=${encodeURIComponent(params.donorEmail)}&phone=${encodeURIComponent(params.donorPhone || '')}&type=${encodeURIComponent(params.donorType || 'particulier')}`,
    callback_url: `${baseUrl}/api/don/ipn`,
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

    const results = data.results || {};
    return {
      success: true,
      checkoutUrl: results.checkout_process,
      uuid: results.uuid,
      crypto: results.crypto,
      expiredAt: results.expired_at,
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

  // En environnement de test ou sans clé privée, autoriser le traitement
  if (env === 'test' || !privateKey) {
    return true;
  }

  if (!payload.hash || !payload.uuid) {
    return false;
  }

  // WiniPayer concatène la clé privée avec uuid, crypto, amount, created_at
  const rawString = `${privateKey}${payload.uuid}${payload.crypto || ''}${payload.amount || ''}${payload.created_at || ''}`;
  const calculatedHash = crypto.createHash('sha256').update(rawString).digest('hex');

  return calculatedHash.toLowerCase() === payload.hash.toLowerCase();
}

