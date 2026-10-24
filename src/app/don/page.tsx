import type { Metadata } from 'next';
import DonationModule from '@/components/don/DonationModule';
import {
  Gavel,
  ShieldAlert,
  GraduationCap,
  Scale,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Faire un don au MIDH | Soutenir la défense des droits humains en Côte d’Ivoire',
  description:
    'Faites un don par Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money, Djamo) ou carte bancaire pour financer les cliniques juridiques gratuites et l’assistance aux victimes.',
  openGraph: {
    title: 'Faire un don au MIDH — Agir pour la Dignité Humaine et la Justice',
    description:
      'Soutenez l’action indépendante du Mouvement Ivoirien des Droits Humains en Côte d’Ivoire via Mobile Money ou Carte Bancaire.',
    url: 'https://midh-ci.org/don',
  },
};

export default function DonPage() {
  return (
    <div className="w-full bg-[#f6faf5] pb-24">
      {/* 1. Hero Institutionnel avec Dégradé Haut de Gamme */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#07261a] via-[#0B3827] to-[#0d4732] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Motif d'arrière-plan discret */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-emerald-200 tracking-wide uppercase">
            <Scale className="w-4 h-4 text-emerald-300" />
            <span>Solidarité Civique &amp; Engagement Citoyen</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl font-display">
            Chaque don protège une vie,{' '}
            <span className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-8">
              défend une liberté.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-3xl leading-relaxed font-normal">
            Le MIDH est une organisation non gouvernementale indépendante, reconnue d&apos;utilité civique depuis l&apos;an 2000. Vos contributions soutiennent directement nos cliniques juridiques gratuites, l&apos;assistance judiciaire des personnes vulnérables et la veille démocratique en Côte d&apos;Ivoire.
          </p>

          {/* 4 Chiffres Clés d'Impact */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col items-center text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                +3 200
              </span>
              <span className="text-xs text-emerald-200 mt-1">
                Justiciables assistés gratuitement
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col items-center text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                24 ans
              </span>
              <span className="text-xs text-emerald-200 mt-1">
                De veille continue en Côte d&apos;Ivoire
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col items-center text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                14 pôles
              </span>
              <span className="text-xs text-emerald-200 mt-1">
                Domaines d&apos;intervention couverts
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col items-center text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                100%
              </span>
              <span className="text-xs text-emerald-200 mt-1">
                Transparence &amp; Reçu fiscal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Module Interactif de Don & Choix d'Opérateur Mobile Money */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <DonationModule />
      </section>

      {/* 3. À Quoi Sert Votre Don ? (3 Piliers d'Action Clairs) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#138A2E]">
            Affectation Rigoureuse des Fonds
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B3827]">
            Comment votre don transforme des vies sur le terrain
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Chaque franc collecté est scrupuleusement orienté vers nos missions opérationnelles de défense des droits fondamentaux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pilier 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0B3827] flex items-center justify-center">
              <Gavel className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0B3827]">
              Assistance juridique &amp; Judiciaire
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Prise en charge intégrale des consultations, rédaction d&apos;actes, honoraires d&apos;avocats et déplacements pour les personnes démunies victimes d&apos;injustices, d&apos;abus de pouvoir ou de détentions arbitraires.
            </p>
            <ul className="mt-2 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
                <span>Consultations juridiques gratuites au siège</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
                <span>Accompagnement des femmes et mineurs vulnérables</span>
              </li>
            </ul>
          </div>

          {/* Pilier 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0B3827] flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0B3827]">
              Veille citoyenne &amp; Enquêtes d&apos;urgence
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Déploiement d&apos;observateurs indépendants assermentés sur l&apos;ensemble du territoire ivoirien lors des scrutins électoraux, des tensions communautaires et des crises humanitaires.
            </p>
            <ul className="mt-2 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
                <span>Rapports d&apos;investigation indépendants</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
                <span>Alertes précoces et médiation communautaire</span>
              </li>
            </ul>
          </div>

          {/* Pilier 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0B3827] flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#0B3827]">
              Éducation civique &amp; Droits humains
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Organisation d&apos;ateliers de formation et de sensibilisation aux libertés fondamentales, à l&apos;état de droit et à la paix dans les lycées, collèges, universités et communautés de base.
            </p>
            <ul className="mt-2 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
                <span>Formations des jeunes et leaders communautaires</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
                <span>Diffusion de guides juridiques pratiques</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Foire Aux Questions (FAQ Spéciale Donateurs) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#138A2E]">
            Questions Fréquentes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3827]">
            Tout savoir sur votre don au MIDH
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-[#0B3827] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
              <span>Comment obtenir mon reçu fiscal ou attestation de don ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Dès votre transfert effectué (Wave, Orange, MTN, Moov, Djamo ou virement), transmettez votre confirmation de paiement par WhatsApp au{' '}
              <a href="https://wa.me/2250101498739" className="text-[#138A2E] font-bold hover:underline">
                +225 01 01 49 87 39
              </a>{' '}
              ou par e-mail à{' '}
              <a href="mailto:tresorier@midh-ci.org" className="text-[#138A2E] font-bold hover:underline">
                tresorier@midh-ci.org
              </a>
              . Votre attestation signée avec le cachet officiel vous est envoyée sous 24 à 48 heures.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-[#0B3827] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
              <span>Puis-je faire un don depuis l&apos;étranger (Diaspora, Europe, Canada, USA) ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Absolument. Les donateurs de la diaspora peuvent contribuer soit directement par Wave (depuis la France et les pays compatibles), soit par virement bancaire international (RIB/IBAN officiel transmis sur simple demande par la trésorerie), soit par lien de paiement sécurisé pour carte bancaire Visa / Mastercard.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-[#0B3827] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#138A2E] flex-shrink-0" />
              <span>Une entreprise ou fondation peut-elle devenir mécène du MIDH ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Oui. Le MIDH établit des conventions de mécénat et de partenariat institutionnel pour soutenir des projets ciblés (cliniques juridiques décentralisées, bourses d&apos;assistance judiciaire, observation électorale). Contactez directement la Direction Exécutive à{' '}
              <a href="mailto:direx@midh-ci.org" className="text-[#138A2E] font-bold hover:underline">
                direx@midh-ci.org
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
