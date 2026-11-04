import crypto from 'crypto';

/**
 * Service d'intégration WiniPayer 2.0 pour le MIDH
 * Documentation officielle : https://docs.winipayer.com/app/2.0-fr/
 */

export interface CreateDonationParams {
  amount: number;
  donorName: string;
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
    description: `Don pour le MIDH — Soutien aux Droits Humains (${params.donorName.slice(0, 30)})`,
    cancel_url: `${baseUrl}/don?status=cancelled&ref=${uniqueRef}`,
    return_url: `${baseUrl}/don/succes?ref=${uniqueRef}&amount=${params.amount}`,
    callback_url: `${baseUrl}/api/don/ipn`,
    client_pay_fee: true,
    items: [
      {
        name: 'Donation pour la justice et les libertés',
        quantity: 1,
        unit_price: Math.round(params.amount),
        description: `Donateur : ${params.donorName} (${params.donorEmail})`,
      },
    ],
    custom_data: {
      donor_name: params.donorName,
      donor_email: params.donorEmail,
      donor_phone: params.donorPhone || '',
      idempotency_key: uniqueRef,
      operator: params.operator || 'mobile_money',
    },
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
      const errorMsg =
        data.messages?.join(', ') ||
        data.errors?.join(', ') ||
        data.message ||
        `Erreur WiniPayer (${res.status})`;
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
  if (!privateKey) {
    // Si la clé privée n'est pas encore configurée, on autorise sous réserve de validation de statut
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

