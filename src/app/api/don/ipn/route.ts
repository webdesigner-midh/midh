import { NextResponse } from 'next/server';
import {
  isTransactionAlreadyProcessed,
  markTransactionProcessed,
  verifyIpnSignature,
  WiniPayerIpnPayload,
} from '@/services/winipayer';
import { resend, DEFAULT_FROM, getRecipients } from '@/services/resend';
import { sendDonationConfirmationEmail } from '@/services/receiptPdf';

export async function POST(request: Request) {
  try {
    let payload: WiniPayerIpnPayload = {};

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      const formObj: Record<string, unknown> = {};
      formData.forEach((value, key) => {
        formObj[key] = value;
      });
      payload = formObj as WiniPayerIpnPayload;
    }

    return await handleIpnNotification(payload);
  } catch (error) {
    console.error('[API IPN WiniPayer] Erreur de lecture de la requête :', error);
    return NextResponse.json(
      { success: false, message: 'Erreur de traitement du payload IPN' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const payload: WiniPayerIpnPayload = {};
    searchParams.forEach((value, key) => {
      payload[key] = value;
    });

    return await handleIpnNotification(payload);
  } catch (error) {
    console.error('[API IPN WiniPayer] Erreur GET :', error);
    return NextResponse.json(
      { success: false, message: 'Erreur GET IPN' },
      { status: 400 }
    );
  }
}

async function handleIpnNotification(payload: WiniPayerIpnPayload) {
  const transactionUuid =
    (payload.uuid as string) ||
    (payload.reference as string) ||
    (payload.id as string) ||
    '';

  console.log('[API IPN WiniPayer] Notification reçue pour la transaction :', transactionUuid, payload);

  if (!transactionUuid) {
    return NextResponse.json(
      { success: false, message: 'Identifiant de transaction manquant' },
      { status: 400 }
    );
  }

  // 1. CONTRÔLE D'IDEMPOTENCE : vérifier si ce paiement a déjà été validé
  if (isTransactionAlreadyProcessed(transactionUuid)) {
    console.log(
      `[API IPN WiniPayer] Transaction ${transactionUuid} déjà traitée (Idempotence active). Aucune action dupliquée.`
    );
    return NextResponse.json({
      success: true,
      message: 'Notification déjà traitée avec succès (Idempotent)',
    });
  }

  // 2. VÉRIFICATION DE SÉCURITÉ DU HASH
  const isValidSignature = verifyIpnSignature(payload);
  if (!isValidSignature) {
    console.warn(`[API IPN WiniPayer] Signature cryptographique invalide pour ${transactionUuid}`);
    return NextResponse.json(
      { success: false, message: 'Signature invalide' },
      { status: 403 }
    );
  }

  // 3. STATUT DU PAIEMENT
  const rawStatus = (payload.status || payload.state || '').toString().toLowerCase();
  const isPaid =
    rawStatus === 'success' ||
    rawStatus === 'paid' ||
    rawStatus === 'completed' ||
    rawStatus === 'approved' ||
    rawStatus === '1';

  // Parser les données personnalisées du donateur
  let customData: Record<string, unknown> = {};
  if (typeof payload.custom_data === 'string') {
    try {
      customData = JSON.parse(payload.custom_data);
    } catch {
      customData = {};
    }
  } else if (payload.custom_data && typeof payload.custom_data === 'object') {
    customData = payload.custom_data as Record<string, unknown>;
  }

  const donorEmail = (customData.donor_email as string) || (payload.email as string) || '';
  const donorName = (customData.donor_name as string) || (payload.name as string) || 'Généreux Donateur';
  const amount: string | number = (payload.amount as string | number) || (customData.amount as string | number) || '10000';
  const currency = (payload.currency as string) || 'FCFA';

  if (isPaid) {
    // Marquer immédiatement la transaction comme traitée dans le registre d'idempotence
    markTransactionProcessed(transactionUuid);

    // 4. GÉNÉRATION DU REÇU OFFICIEL PDF ET ENVOI DE L'EMAIL AU DONATEUR
    if (donorEmail && process.env.RESEND_API_KEY) {
      const donorType = (customData.donor_type as string) === 'organisation' ? 'organisation' : 'particulier';
      const representative = (customData.representative_name as string) || undefined;
      const phone = (customData.donor_phone as string) || '';

      await sendDonationConfirmationEmail({
        reference: transactionUuid,
        donorType,
        donorName,
        representativeName: representative,
        donorEmail,
        donorPhone: phone,
        amount,
        currency,
        paymentMethod: 'WiniPayer (Mobile Money & Carte Bancaire)',
      });

      // Notification interne pour la Trésorerie du MIDH
      try {
        const adminRecipients = getRecipients();
        await resend.emails.send({
          from: DEFAULT_FROM,
          to: adminRecipients,
          subject: `[Nouveau Don Reçu] ${amount} ${currency} de ${donorName} (WiniPayer)`,
          html: `
            <p>Bonjour à l'équipe du MIDH,</p>
            <p>Un nouveau don vient d'être validé avec succès via la passerelle <strong>WiniPayer</strong> :</p>
            <ul>
              <li><strong>Donateur :</strong> ${donorName}</li>
              <li><strong>E-mail :</strong> ${donorEmail}</li>
              <li><strong>Téléphone :</strong> ${(customData.donor_phone as string) || 'Non renseigné'}</li>
              <li><strong>Montant :</strong> ${amount} ${currency}</li>
              <li><strong>Référence WiniPayer :</strong> ${transactionUuid}</li>
            </ul>
          `,
        });
      } catch (adminEmailErr) {
        console.error('[API IPN WiniPayer] Erreur notification admin :', adminEmailErr);
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: isPaid ? 'Don confirmé et enregistré avec succès' : 'Statut IPN enregistré',
    uuid: transactionUuid,
  });
}

