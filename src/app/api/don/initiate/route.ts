import { NextResponse } from 'next/server';
import { createDonationInvoice } from '@/services/winipayer';
import { z } from 'zod';

const donationSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Le montant doit être un nombre valide.' })
    .min(100, 'Le montant minimum d’un don est de 100 FCFA.')
    .max(50000000, 'Montant supérieur à la limite autorisée.'),
  donorName: z
    .string()
    .trim()
    .min(2, 'Veuillez saisir votre nom et prénom (au moins 2 caractères).'),
  donorEmail: z
    .string()
    .trim()
    .email('Veuillez renseigner une adresse e-mail valide pour recevoir votre reçu fiscal.'),
  donorPhone: z.string().optional().default(''),
  operator: z.string().optional().default('wave'),
  donationType: z.enum(['once', 'monthly']).optional().default('once'),
});

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    const parseResult = donationSchema.safeParse(rawData);

    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || 'Données du formulaire invalides.';
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { amount, donorName, donorEmail, donorPhone, operator, donationType } = parseResult.data;

    // Appel au service WiniPayer avec idempotence
    const invoiceResult = await createDonationInvoice({
      amount,
      donorName,
      donorEmail,
      donorPhone,
      operator,
      donationType,
    });

    if (!invoiceResult.success || !invoiceResult.checkoutUrl) {
      return NextResponse.json(
        {
          success: false,
          error:
            invoiceResult.error ||
            'Impossible d’initialiser la transaction avec la passerelle WiniPayer. Veuillez réessayer.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: invoiceResult.checkoutUrl,
      uuid: invoiceResult.uuid,
      reference: invoiceResult.reference,
      isSimulated: invoiceResult.isSimulated || false,
    });
  } catch (error) {
    console.error('[API Initiate Don] Erreur interne :', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Une erreur imprévue est survenue lors de l’initialisation de votre don.',
      },
      { status: 500 }
    );
  }
}

