import Link from 'next/link';

export default function EngagementPillars() {
  return (
    <section className="w-full bg-background py-space-xl sm:py-space-2xl lg:py-space-3xl" id="engagement">
      <div className="site-container flex flex-col gap-space-xl sm:gap-space-2xl">
        {/* En-tête de section */}
        <div className="max-w-3xl flex flex-col gap-space-xs">
          <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-semibold">
            Le triptyque fondateur
          </span>
          <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl lg:text-headline-lg text-[#0B3827] font-bold leading-tight">
            Faire vivre les droits humains, chaque jour.
          </h2>
          <p className="font-body-lg text-sm sm:text-base md:text-body-lg text-on-surface-variant">
            Le MIDH se donne comme moyens d&apos;actions : interpellations, déclarations, plaidoyers, dénonciations, assistances juridiques, accompagnements judiciaires, ainsi que des aides psychologiques et médicales ponctuelles aux victimes.
          </p>
        </div>

        {/* 3 Blocs piliers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-space-lg items-stretch">
          {/* Bloc 1: PROMOUVOIR */}
          <div className="bg-surface-container-lowest p-5 sm:p-space-xl rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
            <div className="flex flex-col gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/60 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">campaign</span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-tertiary font-bold tracking-widest uppercase">
                  Pilier 01
                </span>
                <h3 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold mt-1">
                  PROMOUVOIR
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Faire connaître les droits reconnus et encourager une culture de respect et d&apos;éveil civique à travers des sessions d&apos;information, des causeries et des tribunes citoyennes.
              </p>
            </div>
            <div className="pt-space-lg">
              <Link
                className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-[#138A2E] group-hover:gap-2.5 transition-all"
                href="/a-propos#missions"
              >
                <span>En savoir plus</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Bloc 2: PROTÉGER */}
          <div className="bg-secondary-container/30 p-space-xl rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
            <div className="flex flex-col gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">shield</span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-secondary font-bold tracking-widest uppercase">
                  Pilier 02
                </span>
                <h3 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold mt-1">
                  PROTÉGER
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Prévenir les violations, veille citoyenne et accompagnement des personnes vulnérables face aux abus et discriminations constatés dans leurs communautés.
              </p>
            </div>
            <div className="pt-space-lg">
              <Link
                className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-[#138A2E] group-hover:gap-2.5 transition-all"
                href="/a-propos#missions"
              >
                <span>En savoir plus</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Bloc 3: DÉFENDRE */}
          <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/30">
            <div className="flex flex-col gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/60 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">gavel</span>
              </div>
              <div>
                <span className="font-label-md text-label-md text-tertiary font-bold tracking-widest uppercase">
                  Pilier 03
                </span>
                <h3 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold mt-1">
                  DÉFENDRE
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Interpellations, déclarations, plaidoyers, assistances juridiques, accompagnements judiciaires et aides ponctuelles aux victimes.
              </p>
            </div>
            <div className="pt-space-lg">
              <Link
                className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-[#138A2E] group-hover:gap-2.5 transition-all"
                href="/a-propos#missions"
              >
                <span>En savoir plus</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
