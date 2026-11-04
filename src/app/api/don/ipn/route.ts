import { NextResponse } from 'next/server';
import {
  isTransactionAlreadyProcessed,
  markTransactionProcessed,
  verifyIpnSignature,
  WiniPayerIpnPayload,
} from '@/services/winipayer';
import { resend, DEFAULT_FROM, getRecipients } from '@/services/resend';

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
  const amount = payload.amount || customData.amount || '—';
  const currency = (payload.currency as string) || 'FCFA';

  if (isPaid) {
    // Marquer immédiatement la transaction comme traitée dans le registre d'idempotence
    markTransactionProcessed(transactionUuid);

    // 4. ENVOI DE L'EMAIL DE CONFIRMATION ET REÇU FISCAL
    if (donorEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: DEFAULT_FROM,
          to: donorEmail,
          subject: `Attestation de don & Reçu officiel MIDH — Réf: ${transactionUuid}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #0B3827; margin: 0; font-size: 24px;">Mouvement Ivoirien des Droits Humains (MIDH)</h1>
                <p style="color: #138A2E; font-size: 14px; font-weight: bold; margin-top: 4px;">Organisation non gouvernementale indépendante — Fondée le 08 octobre 2000</p>
              </div>

              <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <h2 style="color: #0B3827; font-size: 18px; margin-top: 0;">Reçu officiel de don civique</h2>
                <p>Cher(e) <strong>${donorName}</strong>,</p>
                <p>Nous vous remercions chaleureusement pour votre don de <strong>${amount} ${currency}</strong> en faveur de la défense des droits humains et de l'assistance juridique gratuite aux victimes en Côte d'Ivoire.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 0; color: #64748b;">Référence transaction :</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right; font-family: monospace;">${transactionUuid}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 0; color: #64748b;">Montant validé :</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #0B3827;">${amount} ${currency}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 0; color: #64748b;">Date & Heure :</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b;">Passerelle sécurisée :</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">WiniPayer (Mobile Money & Carte)</td>
                  </tr>
                </table>

                <div style="background-color: #f0fdf4; border-left: 4px solid #138A2E; padding: 12px; margin-top: 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 12px; color: #166534;">
                    Ce reçu atteste de la régularité de votre versement au compte officiel de la Trésorerie du MIDH. Conformément à la législation, votre contribution ouvre droit aux déductions fiscales pour dons aux œuvres civiques d'utilité publique.
                  </p>
                </div>
              </div>

              <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748b;">
                <p>Siège : Abidjan, Cocody Angré, Carrefour Duncan | Tél : +225 01 01 49 87 39 | E-mail : info@midh-ci.org</p>
                <p>© ${new Date().getFullYear()} Mouvement Ivoirien des Droits Humains. Tous droits réservés.</p>
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

