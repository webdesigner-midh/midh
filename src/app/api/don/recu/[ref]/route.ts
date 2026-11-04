import { NextRequest, NextResponse } from 'next/server';
import { generateDonationReceiptPdf } from '@/services/receiptPdf';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const { searchParams } = new URL(request.url);

    const amount = searchParams.get('amount') || '10000';
    const name = searchParams.get('name') || 'Donateur MIDH';
    const email = searchParams.get('email') || 'info@midh-ci.org';
    const phone = searchParams.get('phone') || '';
    const donorType = (searchParams.get('type') === 'organisation' ? 'organisation' : 'particulier') as
      | 'particulier'
      | 'organisation';
    const representativeName = searchParams.get('representative') || undefined;

    const pdfBytes = await generateDonationReceiptPdf({
      reference: ref,
      donorType,
      donorName: name,
      representativeName,
      donorEmail: email,
      donorPhone: phone,
      amount,
      currency: 'FCFA',
      paymentMethod: 'WiniPayer (Mobile Money & Carte Bancaire)',
    });

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set(
      'Content-Disposition',
      `attachment; filename="recu-don-midh-${ref}.pdf"`
    );

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
