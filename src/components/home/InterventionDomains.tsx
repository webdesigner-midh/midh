import { MIDHDomainInfo } from '@/types/wordpress';
import Link from 'next/link';

interface InterventionDomainsProps {
  domains: MIDHDomainInfo[];
}

export default function InterventionDomains({ domains }: InterventionDomainsProps) {
  return (
    <section className="w-full bg-surface-container-low py-space-xl sm:py-space-2xl lg:py-space-3xl border-t border-outline-variant/30">
      <div className="site-container flex flex-col gap-space-xl sm:gap-space-2xl">
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="max-w-2xl flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-semibold">
              Champs d&apos;intervention &amp; Axes stratégiques
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-headline-lg text-[#0B3827] font-bold leading-tight">
              Nos domaines d&apos;action prioritaires.
            </h2>
          </div>
          <p className="font-body-md text-sm sm:text-base text-tertiary max-w-sm">
            Cadre d&apos;action stratégique et mandats de veille citoyenne de l&apos;ONG MIDH
          </p>
        </div>

        {/* Grille 8 cartes thématiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-space-md">
          {domains.map((domain) => (
            <Link
              key={domain.id}
              href={`/nos-actions?domaine=${domain.id}`}
              className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer border border-outline-variant/20 hover:border-primary/40"
            >
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-[#138A2E] group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-[24px]">{domain.icon}</span>
                </div>
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                    {domain.number}. {domain.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    {domain.shortDescription}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between text-tertiary group-hover:text-primary transition-colors">
                <span className="font-label-md text-label-md">Domaine d&apos;intervention</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
