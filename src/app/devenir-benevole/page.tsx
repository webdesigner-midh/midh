import type { Metadata } from 'next';
import Link from 'next/link';
import VolunteerForm from '@/components/volunteer/VolunteerForm';

export const metadata: Metadata = {
  title: 'Devenir Bénévole | Mouvement Ivoirien des Droits Humains (MIDH)',
  description:
    'Rejoignez le Mouvement Ivoirien des Droits Humains en tant que bénévole. Participez activement à la protection des libertés fondamentales, à l’assistance des victimes et à l’éducation civique en Côte d’Ivoire.',
  openGraph: {
    title: 'Devenir Bénévole | MIDH — Agir pour la Dignité et la Justice',
    description:
      'Formulaire officiel d’adhésion bénévole au Mouvement Ivoirien des Droits Humains. Engagez-vous aux côtés de nos défenseur·es de droits humains.',
  },
};

export default function DevenirBenevolePage() {
  return (
    <div className="w-full bg-background pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-28">
      <div className="site-container flex flex-col gap-10 sm:gap-14">
        {/* En-tête de la page */}
        <div className="flex flex-col gap-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Engagement Citoyen &amp; Solidarité</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] text-[#0B3827] font-bold tracking-tight leading-snug">
            Devenir Bénévole au MIDH
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
            Depuis le 8 octobre 2000, l&apos;action du Mouvement Ivoirien des Droits Humains repose sur le courage,
            l&apos;expertise et la générosité de citoyennes et de citoyens engagés. Rejoignez notre communauté de défenseur·es
            pour bâtir ensemble une société ivoirienne équitable et pacifiée.
          </p>
        </div>

        {/* Grille principale : Formulaire + Volet Institutionnel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          {/* Formulaire (8 colonnes sur Desktop) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-900 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[24px]">assignment_ind</span>
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0B3827]">
                  Formulaire d&apos;adhésion bénévole
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Remplissez ce formulaire confidentiel. Notre secrétariat vous recontactera rapidement.
                </p>
              </div>
            </div>

            <VolunteerForm />
          </div>

          {/* Volet Institutionnel / Carte latérale (4 colonnes sur Desktop) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Carte 1 : Pourquoi nous rejoindre */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-5">
              <div className="flex items-center gap-3 text-[#0B3827]">
                <span className="material-symbols-outlined text-[28px] text-emerald-700">stars</span>
                <h3 className="font-bold text-base sm:text-lg">Pourquoi s&apos;engager ?</h3>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Formation continue :</strong> Accédez à des sessions de formation aux droits humains et aux procédures judiciaires.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Impact direct :</strong> Participez à l&apos;assistance aux victimes, aux caravanes de sensibilisation et aux plaidoyers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Réseau national :</strong> Intégrez plus de 300 membres et 20 sections déployées en Côte d&apos;Ivoire.</span>
                </li>
              </ul>
            </div>

            {/* Carte 2 : Charte et Éthique */}
            <div className="bg-[#0B3827] text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm flex flex-col gap-4">
              <span className="material-symbols-outlined text-[32px] text-emerald-300">verified_user</span>
              <h3 className="font-bold text-base sm:text-lg">Nos Principes Éthiques</h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                Être bénévole au MIDH implique l&apos;adhésion stricte à nos valeurs fondamentales : <strong>indépendance politique</strong>, <strong>confidentialité</strong>, respect de la dignité humaine et impartialité absolue.
              </p>
            </div>

            {/* Carte 3 : Besoin d'aide / Contact direct */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Une question préalable ?</span>
              <p className="text-xs sm:text-sm text-slate-600">
                Contactez directement la cellule de coordination du MIDH :
              </p>
              <div className="flex flex-col gap-2 pt-1 text-xs sm:text-sm">
                <a
                  href="https://wa.me/2250101498739"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-800 font-semibold hover:underline"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>+225 01 01 49 87 39 (WhatsApp)</span>
                </a>
                <a
                  href="mailto:contact@midh-ci.org"
                  className="inline-flex items-center gap-2 text-emerald-800 font-semibold hover:underline"
                >
                  <span className="material-symbols-outlined text-base">mail</span>
                  <span>contact@midh-ci.org</span>
                </a>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-500 hover:text-emerald-700 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Retour à l&apos;accueil</span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
