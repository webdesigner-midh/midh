import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, HeartHandshake, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Merci pour votre Don | MIDH',
  description: 'Confirmation de réception de votre don au Mouvement Ivoirien des Droits Humains.',
};

interface DonSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DonSuccessPage({ searchParams }: DonSuccessPageProps) {
  const params = await searchParams;
  const ref = (params.ref as string) || (params.uuid as string) || `MIDH-DON-${Date.now().toString().slice(-6)}`;
  const amount = (params.amount as string) || 'Libre';
  const name = (params.name as string) || '';
  const isSimulated = params.simulated === 'true';

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
              {amount !== 'Libre' ? `${Number(amount).toLocaleString('fr-FR')} FCFA` : 'Don enregistré'}
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
            Un e-mail de confirmation accompagné de votre attestation officielle a été émis. Pour toute question administrative ou fiscale, contactez la Trésorerie du MIDH au <strong className="text-[#0B3827]">+225 01 01 49 87 39</strong> ou à <strong className="text-[#0B3827]">tresorier@midh-ci.org</strong>.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B3827] hover:bg-[#0A2F21] text-white font-bold text-sm transition-colors shadow-sm inline-flex items-center justify-center gap-2"
          >
            <span>Retour à l&apos;accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/nos-actions"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors inline-flex items-center justify-center"
          >
            Découvrir nos actions de terrain
          </Link>
        </div>
      </div>
    </div>
  );
}

