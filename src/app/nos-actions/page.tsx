import type { Metadata } from 'next';
import { getInterventionDomains, getProjects } from '@/services/wordpress';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nos actions & Domaines d’intervention | MIDH',
  description: 'Découvrez les domaines d’action prioritaires du MIDH et ses projets opérationnels sur l’ensemble du territoire ivoirien.',
};

export default async function NosActionsPage() {
  const [domains, projects] = await Promise.all([
    getInterventionDomains(),
    getProjects(),
  ]);

  return (
    <div className="w-full bg-[#f8faf8] min-h-screen pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-28">
      <div className="site-container flex flex-col gap-10 sm:gap-14">
        {/* En-tête */}
        <div className="max-w-3xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200/60 text-emerald-900 text-xs sm:text-sm font-semibold tracking-wide w-fit">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">hub</span>
            <span>Champs d&apos;intervention &amp; Projets de terrain</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-[#0B3827] font-black leading-tight tracking-tight">
            Agir concrètement au plus près des citoyens.
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            À travers ses domaines d&apos;action prioritaires et ses projets de terrain, le MIDH déploie des cliniques juridiques mobiles, des ateliers d&apos;éducation civique, des actions de protection et des plaidoyers institutionnels.
          </p>
        </div>

        {/* Domaines d'action */}
        <section className="flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl sm:text-2xl text-[#0B3827] font-extrabold tracking-tight">
              Nos domaines d&apos;intervention prioritaires
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Cadre d&apos;action stratégique et axes thématiques de l&apos;ONG MIDH en Côte d&apos;Ivoire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {domains.map((dom) => (
              <div
                key={dom.id}
                id={dom.id}
                className="bg-white p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-emerald-300 flex flex-col gap-4 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <span className="material-symbols-outlined text-[26px]">{dom.icon}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Axe {String(dom.number).padStart(2, '0')}
                    </span>
                    <h3 className="text-base sm:text-lg text-[#0B3827] font-bold group-hover:text-emerald-900 transition-colors">
                      {dom.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {dom.fullDescription || dom.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Projets et Programmes opérationnels */}
        <section className="flex flex-col gap-space-lg pt-space-md">
          <div className="flex flex-col gap-2">
            <h2 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold">
              Projets et actions sur le terrain
            </h2>
            <p className="font-body-sm text-body-sm text-tertiary">
              Programmes en cours d&apos;exécution ou archivés, synchronisés via l&apos;API WordPress Headless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                id={proj.slug}
                className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  {/* Image mise en avant WordPress */}
                  {proj.coverImage ? (
                    <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-surface-container">
                      <img
                        src={proj.coverImage}
                        alt={proj.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-[#0B3827] font-label-md text-xs sm:text-label-md font-bold shadow-xs">
                          {proj.statusLabel}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-44 sm:h-48 w-full bg-gradient-to-br from-[#f0f5f0] to-[#e2ebe2] flex flex-col items-center justify-center p-6 text-center text-tertiary">
                      <span className="material-symbols-outlined text-[40px] text-primary/60 mb-2">assignment</span>
                      <span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 text-[#0B3827] font-label-md text-xs font-bold">
                        {proj.statusLabel}
                      </span>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 flex flex-col gap-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-secondary-container/60 text-secondary font-label-md text-label-md font-semibold">
                        {proj.statusLabel}
                      </span>
                      {proj.period && (
                        <span className="font-caption text-caption text-tertiary">
                          Période : {proj.period}
                        </span>
                      )}
                    </div>

                    <Link href={`/nos-actions/${proj.slug}`} className="group/title">
                      <h3 className="font-headline-sm text-lg sm:text-xl text-[#0B3827] font-bold leading-snug group-hover/title:text-primary transition-colors">
                        {proj.title}
                      </h3>
                    </Link>

                    <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed line-clamp-3">
                      {proj.excerpt || 'Programme d\'action sur le terrain mené par les équipes du MIDH.'}
                    </p>

                    {proj.location && (
                      <div className="flex items-center gap-2 text-caption text-secondary font-medium pt-2">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span>Localités d&apos;intervention : {proj.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 sm:p-6 bg-surface-container-low border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/nos-actions/${proj.slug}`}
                    className="inline-flex items-center gap-1 font-label-md text-xs sm:text-sm text-primary hover:text-[#0F7326] font-bold"
                  >
                    <span>Consulter le projet</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>

                  <Link
                    href="/don"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-[#0F7326] text-white font-label-md text-xs font-semibold transition-colors shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
                    <span>Soutenir ce projet</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
