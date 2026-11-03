import { MIDHPartner, MIDHTeamMember } from '@/types/wordpress';
import Link from 'next/link';
import PartnersCarousel from './PartnersCarousel';

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

        {/* SECTION CARROUSEL DES PARTENAIRES (DÉFILEMENT AUTOMATIQUE & ARTICLES COMPLETS) */}
        <div className="py-2">
          <PartnersCarousel partners={partners} />
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
