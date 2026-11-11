import { NextRequest, NextResponse } from 'next/server';
import { generateDonationReceiptPdf } from '@/services/receiptPdf';
import { verifyReceiptSignature } from '@/lib/server-crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const { searchParams } = new URL(request.url);

    const amount = searchParams.get('amount') || '';
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const phone = searchParams.get('phone') || '';
    const donorType = (searchParams.get('type') === 'organisation' ? 'organisation' : 'particulier') as
      | 'particulier'
      | 'organisation';
    const representativeName = searchParams.get('representative') || '';
    const sig = searchParams.get('sig');

    const isValidSignature = verifyReceiptSignature(
      {
        ref,
        amount,
        name,
        email,
        phone,
        donorType,
        representativeName,
      },
      sig
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Signature de reçu invalide ou manquante.' },
        { status: 403 }
      );
    }

    const pdfBytes = await generateDonationReceiptPdf({
      reference: ref,
      donorType,
      donorName: name || 'Donateur MIDH',
      representativeName: representativeName || undefined,
      donorEmail: email || 'info@midh-ci.org',
      donorPhone: phone,
      amount: amount || '10000',
      currency: 'FCFA',
      paymentMethod: 'WiniPayer (Mobile Money & Carte Bancaire)',
    });

    const cleanRef = ref.replace(/[^a-zA-Z0-9_-]/g, '_');
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Length', String(pdfBytes.length));
    headers.set(
      'Content-Disposition',
      `attachment; filename="attestation-don-midh-${cleanRef}.pdf"`
    );
    headers.set('Cache-Control', 'no-store, max-age=0');

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('[API Téléchargement Reçu] Erreur :', error);
    return NextResponse.json(
      { error: 'Impossible de générer le reçu de don.' },
      { status: 500 }
    );
  }
}

