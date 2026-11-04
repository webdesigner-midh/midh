import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { resend, DEFAULT_FROM } from './resend';

export interface DonationReceiptData {
  reference: string;
  donorType: 'particulier' | 'organisation';
  donorName: string; // Nom & Prénom ou Nom de l'organisation
  representativeName?: string; // Si organisation
  donorEmail: string;
  donorPhone?: string;
  amount: number | string;
  currency?: string;
  paymentMethod?: string;
  date?: string;
}

/**
 * Nettoie une chaîne pour garantir sa conformité avec l'encodage WinAnsi (StandardFonts Helvetica)
 * Remplace les espaces insécables, apostrophes typographiques, tirets et autres caractères non-WinAnsi
 */
export function cleanWinAnsi(text: string | number | undefined | null): string {
  if (text === undefined || text === null) return '';
  return String(text)
    .replace(/[\u202F\u00A0\u2007\u2009\u200A]/g, ' ')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[^\x00-\xFF]/g, ' ');
}

/**
 * Formate un montant en FCFA avec séparateur de milliers standard (espace standard)
 */
export function formatFcfa(amount: number | string): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 0;
  return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Génère le PDF officiel de l'attestation de don et reçu fiscal du MIDH
 */
export async function generateDonationReceiptPdf(
  data: DonationReceiptData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // Format A4 standard (points)
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Palette de couleurs institutionnelles du MIDH
  const primaryColor = rgb(0.043, 0.22, 0.153); // #0B3827
  const emeraldColor = rgb(0.075, 0.541, 0.18); // #138A2E
  const darkTextColor = rgb(0.12, 0.14, 0.17); // #1e293b
  const lightBgColor = rgb(0.96, 0.98, 0.96); // Fond très doux
  const borderColor = rgb(0.8, 0.86, 0.82); // Lignes subtiles

  const margin = 45;
  let currentY = height - 40;

  // Fonction helper sécurisée pour dessiner du texte sans jamais lever d'erreur WinAnsi
  const drawSafeText = (
    text: string | number | undefined | null,
    options: {
      x: number;
      y: number;
      size: number;
      font: typeof fontRegular;
      color: ReturnType<typeof rgb>;
    }
  ) => {
    page.drawText(cleanWinAnsi(text), options);
  };

  // 1. BANDEAU SUPÉRIEUR DÉCORATIF
  page.drawRectangle({
    x: 0,
    y: height - 8,
    width: width,
    height: 8,
    color: primaryColor,
  });

  // 2. EN-TÊTE OFFICIEL DU MIDH
  drawSafeText('MOUVEMENT IVOIRIEN DES DROITS HUMAINS', {
    x: margin,
    y: currentY,
    size: 15,
    font: fontBold,
    color: primaryColor,
  });

  currentY -= 15;
  drawSafeText('(MIDH) - Organisation Non Gouvernementale Indépendante', {
    x: margin,
    y: currentY,
    size: 10,
    font: fontBold,
    color: emeraldColor,
  });

  currentY -= 13;
  drawSafeText(
    'Reconnue d utilité civique | Récépissé de déclaration n 800/INT/AT/DGAT/DAG/SDVA',
    {
      x: margin,
      y: currentY,
      size: 8,
      font: fontRegular,
      color: darkTextColor,
    }
  );

  currentY -= 11;
  drawSafeText(
    'Siège : Abidjan, Cocody Angré, Carrefour Duncan | Tél : +225 01 01 49 87 39 | E-mail : info@midh-ci.org',
    {
      x: margin,
      y: currentY,
      size: 8,
      font: fontRegular,
      color: darkTextColor,
    }
  );

  // Ligne de séparation
  currentY -= 18;
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1.5,
    color: primaryColor,
  });

  // 3. BLOC TITRE DU DOCUMENT
  currentY -= 35;
  page.drawRectangle({
    x: margin,
    y: currentY - 8,
    width: width - margin * 2,
    height: 38,
    color: lightBgColor,
    borderColor: borderColor,
    borderWidth: 1,
  });

  drawSafeText('ATTESTATION DE DON & REÇU FISCAL OFFICIEL', {
    x: margin + 20,
    y: currentY + 12,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });

  drawSafeText(`N° Réf : ${data.reference}`, {
    x: width - margin - 200,
    y: currentY + 13,
    size: 9,
    font: fontBold,
    color: emeraldColor,
  });

  drawSafeText(
    `Date d'émission : ${
      data.date ||
      new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    }`,
    {
      x: margin + 20,
      y: currentY - 1,
      size: 8,
      font: fontRegular,
      color: darkTextColor,
    }
  );

  // 4. IDENTIFICATION DU DONATEUR
  currentY -= 40;
  drawSafeText('1. IDENTIFICATION DU SOUSCRIPTEUR', {
    x: margin,
    y: currentY,
    size: 10,
    font: fontBold,
    color: primaryColor,
  });

  currentY -= 15;
  const donorBoxHeight = data.donorType === 'organisation' ? 75 : 60;
  page.drawRectangle({
    x: margin,
    y: currentY - donorBoxHeight,
    width: width - margin * 2,
    height: donorBoxHeight,
    color: rgb(1, 1, 1),
    borderColor: borderColor,
    borderWidth: 1,
  });

  const isOrg = data.donorType === 'organisation';
  let boxY = currentY - 18;

  drawSafeText('Qualité du donateur :', {
    x: margin + 14,
    y: boxY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  drawSafeText(isOrg ? 'Organisation / Entreprise / Institution' : 'Particulier', {
    x: margin + 140,
    y: boxY,
    size: 9,
    font: fontBold,
    color: primaryColor,
  });

  boxY -= 16;
  drawSafeText(isOrg ? 'Raison sociale :' : 'Nom & Prénom :', {
    x: margin + 14,
    y: boxY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  drawSafeText(data.donorName, {
    x: margin + 140,
    y: boxY,
    size: 9,
    font: fontBold,
    color: darkTextColor,
  });

  if (isOrg && data.representativeName) {
    boxY -= 16;
    drawSafeText('Représenté(e) par :', {
      x: margin + 14,
      y: boxY,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.45, 0.5),
    });
    drawSafeText(data.representativeName, {
      x: margin + 140,
      y: boxY,
      size: 9,
      font: fontRegular,
      color: darkTextColor,
    });
  }

  boxY -= 16;
  drawSafeText('Contact officiel :', {
    x: margin + 14,
    y: boxY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  const contactText = `${data.donorEmail}${data.donorPhone ? ` | ${data.donorPhone}` : ''}`;
  drawSafeText(contactText, {
    x: margin + 140,
    y: boxY,
    size: 9,
    font: fontRegular,
    color: darkTextColor,
  });

  // 5. DÉTAILS FINANCIERS DU DON
  currentY -= donorBoxHeight + 35;
  drawSafeText('2. DÉTAILS DE LA CONTRIBUTION CIVIQUE', {
    x: margin,
    y: currentY,
    size: 10,
    font: fontBold,
    color: primaryColor,
  });

  currentY -= 15;
  page.drawRectangle({
    x: margin,
    y: currentY - 80,
    width: width - margin * 2,
    height: 80,
    color: lightBgColor,
    borderColor: borderColor,
    borderWidth: 1,
  });

  let financeY = currentY - 20;
  drawSafeText('Nature du versement :', {
    x: margin + 14,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  drawSafeText('Don bénévole pour la protection des droits humains et l aide juridique', {
    x: margin + 140,
    y: financeY,
    size: 9,
    font: fontBold,
    color: primaryColor,
  });

  financeY -= 18;
  drawSafeText('Montant perçu :', {
    x: margin + 14,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  const formattedAmount = `${formatFcfa(data.amount)} ${data.currency || 'FCFA'}`;
  drawSafeText(formattedAmount, {
    x: margin + 140,
    y: financeY,
    size: 12,
    font: fontBold,
    color: emeraldColor,
  });

  financeY -= 18;
  drawSafeText('Passerelle / Canal :', {
    x: margin + 14,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  drawSafeText(data.paymentMethod || 'WiniPayer (Mobile Money & Carte Bancaire)', {
    x: margin + 140,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: darkTextColor,
  });

  financeY -= 16;
  drawSafeText('Statut transaction :', {
    x: margin + 14,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  drawSafeText('VALIDE & ENCAISSE PAR LA TRESORERIE DU MIDH', {
    x: margin + 140,
    y: financeY,
    size: 8,
    font: fontBold,
    color: emeraldColor,
  });

  // 6. CADRE RÉGLEMENTAIRE & DÉDUCTION FISCALE
  currentY -= 115;
  page.drawRectangle({
    x: margin,
    y: currentY - 50,
    width: width - margin * 2,
    height: 50,
    color: rgb(0.98, 0.98, 0.98),
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 1,
  });

  drawSafeText(
    'Ce reçu est établi conformément aux dispositions fiscales relatives aux libéralités et dons',
    {
      x: margin + 14,
      y: currentY - 18,
      size: 8,
      font: fontOblique,
      color: rgb(0.3, 0.35, 0.4),
    }
  );
  drawSafeText(
    'consenties aux associations déclarées d intérêt civique et d assistance aux personnes vulnérables.',
    {
      x: margin + 14,
      y: currentY - 30,
      size: 8,
      font: fontOblique,
      color: rgb(0.3, 0.35, 0.4),
    }
  );
  drawSafeText(
    'Il certifie que les fonds sont exclusivement affectés aux missions statutaires et cliniques juridiques du MIDH.',
    {
      x: margin + 14,
      y: currentY - 42,
      size: 8,
      font: fontOblique,
      color: rgb(0.3, 0.35, 0.4),
    }
  );

  // 7. SIGNATURE ET CACHET OFFICIEL
  currentY -= 80;
  drawSafeText('Fait à Abidjan, le ' + (data.date || new Date().toLocaleDateString('fr-FR')), {
    x: width - margin - 220,
    y: currentY,
    size: 9,
    font: fontRegular,
    color: darkTextColor,
  });

  currentY -= 14;
  drawSafeText('Pour le Bureau Exécutif National du MIDH', {
    x: width - margin - 220,
    y: currentY,
    size: 9,
    font: fontBold,
    color: primaryColor,
  });

  currentY -= 12;
  drawSafeText('La Trésorerie Générale & le Secrétariat Exécutif', {
    x: width - margin - 220,
    y: currentY,
    size: 8,
    font: fontOblique,
    color: emeraldColor,
  });

  // Empreinte de signature
  currentY -= 35;
  page.drawRectangle({
    x: width - margin - 220,
    y: currentY - 10,
    width: 190,
    height: 38,
    color: lightBgColor,
    borderColor: borderColor,
    borderWidth: 1,
  });
  drawSafeText('[ Cachet Certifié Trésorerie MIDH ]', {
    x: width - margin - 200,
    y: currentY + 12,
    size: 8,
    font: fontBold,
    color: primaryColor,
  });
  drawSafeText('Réf. Électronique : ' + data.reference, {
    x: width - margin - 200,
    y: currentY,
    size: 7,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });

  // 8. PIED DE PAGE SÉCURISÉ
  drawSafeText(
    'Document certifié généré automatiquement par la plateforme numérique du Mouvement Ivoirien des Droits Humains (MIDH).',
    {
      x: margin,
      y: 28,
      size: 7,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.6),
    }
  );
  drawSafeText(
    'Vérification d authenticité : info@midh-ci.org | https://www.midh-ci.org',
    {
      x: margin,
      y: 18,
      size: 7,
      font: fontBold,
      color: primaryColor,
    }
  );

  return await pdfDoc.save();
}

// Registre mémoire d'idempotence des e-mails envoyés pour ne jamais envoyer de doublon
const sentReceiptEmails = new Set<string>();

/**
 * Envoie l'e-mail officiel de confirmation avec l'attestation PDF attachée
 */
export async function sendDonationConfirmationEmail(data: DonationReceiptData): Promise<{
  success: boolean;
  alreadySent?: boolean;
  messageId?: string;
  error?: string;
}> {
  if (!data.donorEmail || !data.donorEmail.includes('@')) {
    return { success: false, error: 'Adresse e-mail donateur invalide ou manquante.' };
  }

  // Idempotence : si l'e-mail a déjà été envoyé pour cette transaction, on évite le doublon
  if (sentReceiptEmails.has(data.reference)) {
    console.log(`[Donation Receipt Email] E-mail déjà envoyé pour la référence ${data.reference} (Idempotence).`);
    return { success: true, alreadySent: true };
  }

  try {
    const pdfBytes = await generateDonationReceiptPdf(data);
    const amountStr = `${formatFcfa(data.amount)} ${data.currency || 'FCFA'}`;

    const resendResult = await resend.emails.send({
      from: DEFAULT_FROM,
      to: data.donorEmail,
      subject: `Attestation de don & Reçu officiel MIDH — Réf: ${data.reference}`,
      attachments: [
        {
          filename: `attestation-don-midh-${data.reference}.pdf`,
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
            
            <p style="font-size: 14px; margin-top: 14px;">Chère / Cher <strong>${data.donorName}</strong>,</p>
            
            <p style="font-size: 14px;">Le Bureau Exécutif National du <strong>Mouvement Ivoirien des Droits Humains (MIDH)</strong> vous remercie chaleureusement pour votre généreuse contribution citoyenne.</p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #475569; width: 45%;"><strong>Référence transaction :</strong></td>
                  <td style="padding: 6px 0; color: #0B3827; font-family: monospace; font-weight: bold;">${data.reference}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #475569;"><strong>Montant versé :</strong></td>
                  <td style="padding: 6px 0; color: #138A2E; font-size: 16px; font-weight: bold;">${amountStr}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #475569;"><strong>Date de règlement :</strong></td>
                  <td style="padding: 6px 0; color: #1e293b;">${new Date().toLocaleDateString('fr-FR')}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #475569;"><strong>Moyen de règlement :</strong></td>
                  <td style="padding: 6px 0; color: #1e293b;">${data.paymentMethod || 'WiniPayer (Mobile Money & CB)'}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 13px; color: #334155;">
              📄 <strong>Attestation officielle & Reçu fiscal joints :</strong><br/>
              Votre reçu fiscal officiel au format PDF est joint à ce courriel. Il atteste de la régularité de votre libéralité et fait foi auprès des instances fiscales et comptables.
            </p>

            <p style="font-size: 13px; color: #475569; margin-top: 18px;">
              Grâce à votre don, nous continuons d'offrir une assistance juridique bénévole aux personnes vulnérables et de veiller au respect des droits inaliénables en Côte d'Ivoire.
            </p>
          </div>

          <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <p style="margin: 0 0 4px 0;"><strong>Trésorerie Générale — Mouvement Ivoirien des Droits Humains</strong></p>
            <p style="margin: 0;">Contact direct : <a href="mailto:tresorier@midh-ci.org" style="color: #138A2E; text-decoration: none;">tresorier@midh-ci.org</a> | Standard : +225 01 01 49 87 39</p>
          </div>
        </div>
      `,
    });

    if (resendResult.error) {
      console.error('[Donation Receipt Email] Erreur Resend :', resendResult.error);
      return { success: false, error: resendResult.error.message };
    }

    sentReceiptEmails.add(data.reference);
    console.log(`[Donation Receipt Email] Attestation envoyée avec succès à ${data.donorEmail} (ID: ${resendResult.data?.id})`);
    return { success: true, messageId: resendResult.data?.id };
  } catch (err) {
    console.error('[Donation Receipt Email] Exception :', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur inconnue lors de l\'envoi de l\'e-mail',
    };
  }
}
