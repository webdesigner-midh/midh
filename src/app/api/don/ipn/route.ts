import { NextResponse } from 'next/server';
import {
  isTransactionAlreadyProcessed,
  markTransactionProcessed,
  verifyIpnSignature,
  WiniPayerIpnPayload,
} from '@/services/winipayer';
import { resend, DEFAULT_FROM, getRecipients } from '@/services/resend';
import { generateDonationReceiptPdf } from '@/services/receiptPdf';

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

    // 4. GÉNÉRATION DU REÇU OFFICIEL PDF ET ENVOI DE L'EMAIL
    if (donorEmail && process.env.RESEND_API_KEY) {
      try {
        const donorType = (customData.donor_type as string) === 'organisation' ? 'organisation' : 'particulier';
        const representative = (customData.representative_name as string) || undefined;
        const phone = (customData.donor_phone as string) || '';

        const pdfBytes = await generateDonationReceiptPdf({
          reference: transactionUuid,
          donorType,
          donorName,
          representativeName: representative,
          donorEmail,
          donorPhone: phone,
          amount,
          currency: 'FCFA',
          paymentMethod: 'WiniPayer (Mobile Money & Carte Bancaire)',
        });

        await resend.emails.send({
          from: DEFAULT_FROM,
          to: donorEmail,
          subject: `Attestation de don & Reçu officiel MIDH — Réf: ${transactionUuid}`,
          attachments: [
            {
              filename: `attestation-don-midh-${transactionUuid}.pdf`,
              content: Buffer.from(pdfBytes),
            },
          ],
          html: `
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 620px; margin: 0 auto; padding: 28px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; line-height: 1.6;">
              <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #0B3827;">
                <h1 style="color: #0B3827; margin: 0 0 4px 0; font-size: 22px; font-weight: bold; letter-spacing: -0.5px;">MOUVEMENT IVOIRIEN DES DROITS HUMAINS (MIDH)</h1>
                <p style="color: #138A2E; font-size: 13px; font-weight: bold; margin: 0;">Organisation Non Gouvernementale Indépendante — Reconnue d'utilité civique</p>
                <p style="color: #64748b; font-size: 11px; margin: 4px 0 0 0;">Siège : Abidjan, Cocody Angré, Carrefour Duncan | +225 01 01 49 87 39</p>
              </div>

              <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <h2 style="color: #0B3827; font-size: 17px; margin-top: 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">Confirmation de versement de don</h2>
                <p style="margin: 16px 0 12px 0; font-size: 14px;">Madame, Monsieur, <strong>${donorName}</strong>,</p>
                <p style="font-size: 14px; margin-bottom: 16px;">
                  Le Bureau Exécutif National et la Trésorerie Générale du MIDH accusent bonne réception de votre contribution civique d'un montant de <strong style="color: #0B3827;">${Number(amount).toLocaleString('fr-FR')} FCFA</strong>.
                </p>
                <p style="font-size: 14px; margin-bottom: 18px;">
                  Votre soutien financier concourt directement au fonctionnement de nos cliniques juridiques gratuites, à l'assistance judiciaire des justiciables vulnérables et à la protection des droits humains en Côte d'Ivoire.
                </p>

                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin: 18px 0;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr>
                      <td style="padding: 4px 0; color: #475569;">Référence transaction :</td>
                      <td style="padding: 4px 0; font-weight: bold; text-align: right; font-family: monospace; color: #0B3827;">${transactionUuid}</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #475569;">Montant crédité :</td>
                      <td style="padding: 4px 0; font-weight: bold; text-align: right; color: #138A2E; font-size: 14px;">${Number(amount).toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                    <tr>
                      <td style="padding: 4px 0; color: #475569;">Date d'encaissement :</td>
                      <td style="padding: 4px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                    </tr>
                  </table>
                </div>

                <div style="padding: 12px 14px; background-color: #f8fafc; border-left: 3px solid #0B3827; border-radius: 4px; font-size: 12px; color: #334155;">
                  <strong>Attestation fiscale PDF jointe :</strong> Vous trouverez ci-joint en pièce jointe de ce courriel votre reçu fiscal officiel téléchargeable au format PDF, certifié par la Trésorerie Générale du MIDH.
                </div>
              </div>

              <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748b;">
                <p style="margin: 0;">Pour toute question administrative ou fiscale : <a href="mailto:tresorier@midh-ci.org" style="color: #138A2E; text-decoration: none; font-weight: bold;">tresorier@midh-ci.org</a></p>
                <p style="margin: 6px 0 0 0;">© ${new Date().getFullYear()} Mouvement Ivoirien des Droits Humains (MIDH). Tous droits réservés.</p>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[API IPN WiniPayer] Erreur envoi email donateur :', emailErr);
      }

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

