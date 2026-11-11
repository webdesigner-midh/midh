import crypto from 'crypto';

export interface ReceiptSignaturePayload {
  ref: string;
  amount: string | number;
  name: string;
  email: string;
  phone?: string;
  donorType?: string;
  representativeName?: string;
}

/**
 * Comparaison à temps constant insensible aux attaques par canal auxiliaire temporel.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Effectue une comparaison factice de longueur égale pour éviter de divulguer la longueur par timing
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function getReceiptSigningKey(): string | null {
  const key =
    process.env.RECEIPT_SIGNING_SECRET?.trim() ||
    process.env.WINIPAYER_PRIVATE_KEY?.trim() ||
    process.env.REVALIDATE_SECRET_TOKEN?.trim();

  if (key) {
    return key;
  }

  // Fallback local uniquement hors production pour ne pas bloquer le développement
  if (process.env.NODE_ENV !== 'production') {
    return 'midh_local_dev_receipt_key_only';
  }

  return null;
}

function canonicalReceiptString(payload: ReceiptSignaturePayload): string {
  return [
    String(payload.ref ?? '').trim(),
    String(payload.amount ?? '').trim(),
    String(payload.name ?? '').trim(),
    String(payload.email ?? '').trim().toLowerCase(),
    String(payload.phone ?? '').trim(),
    String(payload.donorType ?? 'particulier').trim(),
    String(payload.representativeName ?? '').trim(),
  ].join('|');
}

/**
 * Génère une signature HMAC-SHA256 pour authentifier un reçu de don et ses paramètres.
 */
export function signReceiptPayload(payload: ReceiptSignaturePayload): string {
  const key = getReceiptSigningKey();
  if (!key) {
    throw new Error(
      'Aucune clé serveur configurée (RECEIPT_SIGNING_SECRET / WINIPAYER_PRIVATE_KEY / REVALIDATE_SECRET_TOKEN) pour signer le reçu.'
    );
  }
  return crypto
    .createHmac('sha256', key)
    .update(canonicalReceiptString(payload))
    .digest('hex');
}

/**
 * Vérifie en temps constant la signature HMAC-SHA256 d'un reçu de don.
 */
export function verifyReceiptSignature(
  payload: ReceiptSignaturePayload,
  signature?: string | null
): boolean {
  if (!signature || typeof signature !== 'string') {
    return false;
  }
  const key = getReceiptSigningKey();
  if (!key) {
    return false;
  }
  const expected = crypto
    .createHmac('sha256', key)
    .update(canonicalReceiptString(payload))
    .digest('hex');

  return timingSafeEqualString(signature.trim().toLowerCase(), expected.toLowerCase());
}

