import { MIDHPartner, MIDHTeamMember } from '@/types/wordpress';
import Link from 'next/link';

interface PartnersAndTeamProps {
  partners: MIDHPartner[];
  team: MIDHTeamMember[];
}

export default function PartnersAndTeam({ partners }: PartnersAndTeamProps) {
  return (
    <section className="w-full bg-surface-container-low py-space-xl sm:py-space-2xl border-t border-outline-variant/30">
      <div className="site-container flex flex-col gap-space-lg sm:gap-space-xl">
        {/* En-tête sobre */}
        <div className="text-center max-w-xl mx-auto flex flex-col gap-2">
          <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-semibold">
            Synergies &amp; Gouvernance
          </span>
          <h2 className="font-display text-xl sm:text-2xl md:text-headline-sm text-[#0B3827] font-bold">
            Partenaires institutionnels &amp; Équipe
          </h2>
          <p className="font-body-sm text-sm text-tertiary">
            Le MIDH coopère dans une stricte indépendance avec ses partenaires techniques, institutionnels et de la société civile.
          </p>
        </div>

        {/* Grille de cadres réservés pour les logos officiels avec animations et micro-interactions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {partners.map((partner, idx) => (
            <div
              key={partner.id}
              className="bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center justify-center text-center gap-2 border border-dashed border-outline-variant/60 min-h-[130px] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 hover:bg-white group cursor-pointer relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-primary group-hover:after:w-full after:transition-all after:duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <span
                className="material-symbols-outlined text-[32px] text-tertiary transition-transform duration-300 group-hover:scale-125 group-hover:text-primary animate-pulse"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                {idx === 0 ? 'handshake' : idx === 1 ? 'groups' : 'account_balance'}
              </span>
              <span className="font-label-md text-label-md text-tertiary group-hover:text-[#0B3827] transition-colors relative z-10">
                [{partner.name}]
              </span>
              <span className="font-caption text-caption text-outline group-hover:text-secondary transition-colors relative z-10">
                {partner.description || partner.typeLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Cadre réservé pour l'équipe & l'organigramme */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-dashed border-outline-variant/70 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[28px]">badge</span>
          </div>
          <span className="font-title-lg text-title-lg text-[#0B3827] font-bold">
            [Emplacement Organigramme &amp; Responsables du MIDH — Noms, photos et fonctions des membres à intégrer après validation]
          </span>
          <p className="font-body-sm text-body-sm text-tertiary max-w-2xl">
            Cet espace accueillera la composition du Bureau Exécutif National, de la Coordination Générale et des responsables de pôles opérationnels.
          </p>
          <div className="pt-2">
            <Link
              href="/a-propos#equipe"
              className="inline-flex items-center gap-1.5 text-primary hover:text-[#0F7326] font-label-md text-label-md font-semibold"
            >
              <span>Découvrir la structure de gouvernance</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
