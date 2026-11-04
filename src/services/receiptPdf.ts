import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

  // 1. BANDEAU SUPÉRIEUR DÉCORATIF
  page.drawRectangle({
    x: 0,
    y: height - 8,
    width: width,
    height: 8,
    color: primaryColor,
  });

  // 2. EN-TÊTE OFFICIEL DU MIDH
  page.drawText('MOUVEMENT IVOIRIEN DES DROITS HUMAINS', {
    x: margin,
    y: currentY,
    size: 15,
    font: fontBold,
    color: primaryColor,
  });

  currentY -= 15;
  page.drawText('(MIDH) — Organisation Non Gouvernementale Indépendante', {
    x: margin,
    y: currentY,
    size: 10,
    font: fontBold,
    color: emeraldColor,
  });

  currentY -= 13;
  page.drawText(
    'Reconnue d\'utilité civique | Récépissé de déclaration n° 800/INT/AT/DGAT/DAG/SDVA',
    {
      x: margin,
      y: currentY,
      size: 8,
      font: fontRegular,
      color: darkTextColor,
    }
  );

  currentY -= 11;
  page.drawText(
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

  page.drawText('ATTESTATION DE DON & REÇU FISCAL OFFICIEL', {
    x: margin + 20,
    y: currentY + 12,
    size: 13,
    font: fontBold,
    color: primaryColor,
  });

  page.drawText(`N° Réf : ${data.reference}`, {
    x: width - margin - 180,
    y: currentY + 13,
    size: 9,
    font: fontBold,
    color: emeraldColor,
  });

  page.drawText(
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
  page.drawText('1. IDENTIFICATION DU SOUSCRIPTEUR', {
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

  page.drawText('Qualité du donateur :', {
    x: margin + 14,
    y: boxY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText(isOrg ? 'Organisation / Entreprise / Institution' : 'Particulier', {
    x: margin + 140,
    y: boxY,
    size: 9,
    font: fontBold,
    color: primaryColor,
  });

  boxY -= 16;
  page.drawText(isOrg ? 'Raison sociale :' : 'Nom & Prénom :', {
    x: margin + 14,
    y: boxY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText(data.donorName, {
    x: margin + 140,
    y: boxY,
    size: 9,
    font: fontBold,
    color: darkTextColor,
  });

  if (isOrg && data.representativeName) {
    boxY -= 16;
    page.drawText('Représenté(e) par :', {
      x: margin + 14,
      y: boxY,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.45, 0.5),
    });
    page.drawText(data.representativeName, {
      x: margin + 140,
      y: boxY,
      size: 9,
      font: fontRegular,
      color: darkTextColor,
    });
  }

  boxY -= 16;
  page.drawText('Contact officiel :', {
    x: margin + 14,
    y: boxY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  const contactText = `${data.donorEmail}${data.donorPhone ? ` | ${data.donorPhone}` : ''}`;
  page.drawText(contactText, {
    x: margin + 140,
    y: boxY,
    size: 9,
    font: fontRegular,
    color: darkTextColor,
  });

  // 5. DÉTAILS FINANCIERS DU DON
  currentY -= donorBoxHeight + 35;
  page.drawText('2. DÉTAILS DE LA CONTRIBUTION CIVIQUE', {
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
  page.drawText('Nature du versement :', {
    x: margin + 14,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText('Don bénévole pour la protection des droits humains et l\'aide juridique', {
    x: margin + 140,
    y: financeY,
    size: 9,
    font: fontBold,
    color: primaryColor,
  });

  financeY -= 18;
  page.drawText('Montant perçu :', {
    x: margin + 14,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  const formattedAmount = `${Number(data.amount).toLocaleString('fr-FR')} ${data.currency || 'FCFA'}`;
  page.drawText(formattedAmount, {
    x: margin + 140,
    y: financeY,
    size: 12,
    font: fontBold,
    color: emeraldColor,
  });

  financeY -= 18;
  page.drawText('Passerelle / Canal :', {
    x: margin + 14,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText(data.paymentMethod || 'WiniPayer (Mobile Money & Carte Bancaire)', {
    x: margin + 140,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: darkTextColor,
  });

  financeY -= 16;
  page.drawText('Statut transaction :', {
    x: margin + 14,
    y: financeY,
    size: 9,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });
  page.drawText('VALIDE & ENCAISSE PAR LA TRESORERIE DU MIDH', {
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

  page.drawText(
    'Ce reçu est établi conformément aux dispositions fiscales relatives aux libéralités et dons',
    {
      x: margin + 14,
      y: currentY - 18,
      size: 8,
      font: fontOblique,
      color: rgb(0.3, 0.35, 0.4),
    }
  );
  page.drawText(
    'consenties aux associations déclarées d\'intérêt civique et d\'assistance aux personnes vulnérables.',
    {
      x: margin + 14,
      y: currentY - 30,
      size: 8,
      font: fontOblique,
      color: rgb(0.3, 0.35, 0.4),
    }
  );
  page.drawText(
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
  page.drawText('Fait à Abidjan, le ' + (data.date || new Date().toLocaleDateString('fr-FR')), {
    x: width - margin - 220,
    y: currentY,
    size: 9,
    font: fontRegular,
    color: darkTextColor,
  });

  currentY -= 14;
  page.drawText('Pour le Bureau Exécutif National du MIDH', {
    x: width - margin - 220,
    y: currentY,
    size: 9,
    font: fontBold,
    color: primaryColor,
  });

  currentY -= 12;
  page.drawText('La Trésorerie Générale & le Secrétariat Exécutif', {
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
  page.drawText('[ Cachet Certifié Trésorerie MIDH ]', {
    x: width - margin - 200,
    y: currentY + 12,
    size: 8,
    font: fontBold,
    color: primaryColor,
  });
  page.drawText('Réf. Électronique : ' + data.reference, {
    x: width - margin - 200,
    y: currentY,
    size: 7,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5),
  });

  // 8. PIED DE PAGE SÉCURISÉ
  page.drawText(
    'Document certifié généré automatiquement par la plateforme numérique du Mouvement Ivoirien des Droits Humains (MIDH).',
    {
      x: margin,
      y: 28,
      size: 7,
      font: fontRegular,
      color: rgb(0.5, 0.55, 0.6),
    }
  );
  page.drawText(
    'Vérification d\'authenticité : info@midh-ci.org | https://www.midh-ci.org',
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
