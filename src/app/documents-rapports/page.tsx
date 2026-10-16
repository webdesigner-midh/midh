import type { Metadata } from 'next';
import { getDocuments } from '@/services/wordpress';
import DocumentsList from '@/components/documents/DocumentsList';

export const metadata: Metadata = {
  title: 'Documents & Rapports institutionnels | MIDH',
  description: 'Consultez et téléchargez les rapports annuels, guides juridiques et études thématiques publiés par le Mouvement Ivoirien des Droits Humains.',
};

export default async function DocumentsRapportsPage() {
  const documents = await getDocuments();

  return (
    <div className="w-full bg-[#f8faf8] min-h-screen pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-28">
      <div className="site-container flex flex-col gap-10 sm:gap-12">
        {/* En-tête Institutionnel avec espacement soigné */}
        <div className="max-w-3xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-900 text-xs sm:text-sm font-semibold tracking-wide w-fit">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">folder_open</span>
            <span>Centre de documentation &amp; Archives officielles</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] text-[#0B3827] font-black leading-tight tracking-tight">
            Rapports, Guides &amp; Publications à télécharger
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Accédez en toute transparence aux bilans d&apos;activités, analyses de jurisprudence, rapports d&apos;enquêtes de terrain et manuels de veille citoyenne du MIDH au format PDF.
          </p>
        </div>

        {/* Liste interactive des documents avec filtres, recherche et téléchargement direct */}
        <DocumentsList documents={documents} />
      </div>
    </div>
  );
}
