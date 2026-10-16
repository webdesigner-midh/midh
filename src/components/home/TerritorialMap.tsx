import { MIDHSection } from '@/types/wordpress';

interface TerritorialMapProps {
  sections: MIDHSection[];
}

export default function TerritorialMap({ sections }: TerritorialMapProps) {
  return (
    <section className="w-full bg-background py-space-xl sm:py-space-2xl lg:py-space-3xl border-t border-outline-variant/30">
      <div className="site-container flex flex-col gap-space-xl sm:gap-space-2xl">
        {/* En-tête de section */}
        <div className="max-w-3xl flex flex-col gap-space-xs">
          <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-semibold">
            Maillage géographique
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-headline-lg text-[#0B3827] font-bold leading-tight">
            Un engagement ancré sur le territoire ivoirien.
          </h2>
          <p className="font-body-lg text-sm sm:text-base md:text-body-lg text-on-surface-variant">
            Le MIDH compte une vingtaine de sections et sous-sections réparties à travers le pays pour agir au plus près des réalités citoyennes.
          </p>
        </div>

        {/* Panneau d'Information et Carte Stylisée */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center bg-surface-container-lowest p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-outline-variant/30">
          {/* Panneau latéral descriptif (5 colonnes) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            <div className="flex flex-col gap-2">
              <span className="px-3 py-1 rounded bg-secondary-container/50 text-primary font-label-md text-label-md w-fit font-bold">
                Implantation nationale
              </span>
              <h3 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold">
                Sections et sous-sections
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Le MIDH compte environ vingt sections et sous-sections réparties à travers le pays pour un maillage de veille et de défense de proximité.
              </p>
            </div>

            {/* Badges des localités vérifiées */}
            <div className="flex flex-wrap gap-2 text-body-sm" aria-label="Liste des sections du MIDH">
              {sections.map((sec) => (
                <span
                  key={sec.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    sec.isHeadquarters
                      ? 'bg-[#0B3827] text-white'
                      : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      sec.isHeadquarters ? 'bg-[#8dfa8f]' : 'bg-primary'
                    }`}
                  />
                  {sec.city}
                </span>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-secondary-container/30 flex items-start gap-3 border border-secondary-container/60">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                info
              </span>
              <p className="font-caption text-caption text-secondary leading-relaxed">
                Coordonnées des points focaux locaux disponibles sur demande auprès du siège national.
              </p>
            </div>
          </div>

          {/* Carte Vectorielle Stylisée de la Côte d'Ivoire (7 colonnes) */}
          <div className="lg:col-span-7 flex items-center justify-center relative p-4">
            <div className="w-full max-w-lg aspect-[5/4] relative bg-surface-container-low/60 rounded-2xl p-6 flex items-center justify-center border border-outline-variant/30 shadow-inner">
              <img
                alt="Carte de la Côte d'Ivoire - Sections du MIDH"
                className="w-full h-full object-contain rounded-xl shadow-sm hover:scale-[1.02] transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZGPXnPt0R3yOrrVVc8tKqi1IPwtV4_ija2E_HjBTEfL1y5mU1svzsheNz5nd31ItvxIbr3IeX1YV8_mssdlz6DLiAvJ5cv01ZjxZHWwVpUwCfZcuCUm9TBBgwt5Ay7p_a4y4_TM6q_QLudSZUbTAg_2e6EWCXFe43gFyAx_RX8tIWXuIWvbRzMSpzpXYQPR-ZDB4Z4WU8zDlKdfCnx2TkBcQz6_n8rNuOO5AH-ogkoOck6TpkwtdaFs8tq3cMSkUalg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
