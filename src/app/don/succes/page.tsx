import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, HeartHandshake, Download, AlertTriangle } from 'lucide-react';
import { formatFcfa, sendDonationConfirmationEmail } from '@/services/receiptPdf';
import { verifyReceiptSignature } from '@/lib/server-crypto';

export const metadata: Metadata = {
  title: 'Merci pour votre Don | MIDH',
  description: 'Confirmation de réception de votre don au Mouvement Ivoirien des Droits Humains.',
};

interface DonSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DonSuccessPage({ searchParams }: DonSuccessPageProps) {
  const params = await searchParams;
  const ref = (params.ref as string) || (params.uuid as string) || '';
  const amount = (params.amount as string) || '';
  const name = (params.name as string) || '';
  const email = (params.email as string) || '';
  const phone = (params.phone as string) || '';
  const donorType = (params.type === 'organisation' ? 'organisation' : 'particulier') as
    | 'particulier'
    | 'organisation';
  const representative = (params.representative as string) || '';
  const sig = (params.sig as string) || '';
  const isSimulated = params.simulated === 'true';

  const isSignatureValid =
    Boolean(ref) &&
    verifyReceiptSignature(
      {
        ref,
        amount,
        name,
        email,
        phone,
        donorType,
        representativeName: representative,
      },
      sig
    );

  if (!isSignatureValid) {
    return (
      <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 to-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-200 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-[#0B3827] font-display">
              Lien de confirmation non vérifié
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ce lien de confirmation de don est incomplet, expiré ou a été modifié. Si vous venez d&apos;effectuer un don, votre attestation officielle vous est transmise directement par e-mail après validation de la passerelle WiniPayer.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
            <Link
              href="/don"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
            >
              Effectuer un don
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-[#0B3827] hover:bg-[#0A2F21] text-white font-bold text-sm transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayAmount = amount || 'Libre';

  // Déclenchement automatique et sécurisé de l'e-mail officiel avec reçu PDF attaché
  // Idempotent : ne sera envoyé qu'une seule et unique fois par référence de transaction signée
  if (email && email.includes('@')) {
    try {
      await sendDonationConfirmationEmail({
        reference: ref,
        donorType,
        donorName: name || 'Généreux Donateur',
        representativeName: representative || undefined,
        donorEmail: email,
        donorPhone: phone || undefined,
        amount: displayAmount,
        currency: 'FCFA',
        paymentMethod: 'WiniPayer (Mobile Money & Carte Bancaire)',
      });
    } catch (emailErr) {
      console.error('[Donation Success Page] Erreur envoi automatique e-mail :', emailErr);
    }
  }

  const downloadUrl = `/api/don/recu/${encodeURIComponent(ref)}?amount=${encodeURIComponent(
    amount
  )}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(
    phone
  )}&type=${encodeURIComponent(donorType)}&representative=${encodeURIComponent(
    representative
  )}&sig=${encodeURIComponent(sig)}`;

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#f0fdf4] via-[#f8fafc] to-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 flex flex-col items-center text-center gap-6 relative overflow-hidden">
        {/* Liseré supérieur aux couleurs du MIDH */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0B3827] via-[#138A2E] to-[#0B3827]" />

        {/* Badge Icône Succès */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-[#138A2E] shadow-sm animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4 text-[#138A2E]" />
            Transaction Confirmée
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B3827] font-display">
            Merci pour votre générosité {name ? `, ${name}` : ''} !
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Votre soutien est essentiel pour pérenniser l’assistance juridique gratuite et protéger les libertés fondamentales en Côte d’Ivoire.
          </p>
        </div>

        {isSimulated && (
          <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
            💡 Mode Test WiniPayer actif. Renseignez votre clé de token dans <code>.env.local</code> pour passer aux vrais tests Mobile Money.
          </div>
        )}

        {/* Détails de la transaction */}
        <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-3.5 text-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-medium">Bénéficiaire :</span>
            <span className="font-bold text-[#0B3827]">Mouvement Ivoirien des Droits Humains (MIDH)</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-medium">Référence du versement :</span>
            <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm bg-white px-2 py-0.5 rounded border border-slate-200">
              {ref}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-medium">Montant du don :</span>
            <span className="font-bold text-lg text-[#138A2E]">
              {displayAmount !== 'Libre' ? `${formatFcfa(displayAmount)} FCFA` : 'Don enregistré'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Passerelle de paiement :</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#138A2E]" />
              WiniPayer Sécurisé
            </span>
          </div>
        </div>

        {/* Message d'attestation fiscale */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-900 text-left flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#138A2E] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Un e-mail de confirmation accompagné de votre attestation officielle a été émis{email ? ` à l'adresse ${email}` : ''}. Pour toute question administrative ou fiscale, contactez la Trésorerie du MIDH au <strong className="text-[#0B3827]">+225 01 01 49 87 39</strong> ou à <strong className="text-[#0B3827]">tresorier@midh-ci.org</strong>.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={`recu-don-midh-${ref}.pdf`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le reçu fiscal PDF</span>
          </a>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B3827] hover:bg-[#0A2F21] text-white font-bold text-sm transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Retour à l&apos;accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
