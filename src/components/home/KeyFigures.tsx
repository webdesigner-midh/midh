export default function KeyFigures() {
  return (
    <section className="w-full bg-surface-container-low py-space-xl border-y border-outline-variant/30">
      <div className="site-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-8 lg:gap-x-12 relative">
          {/* Chiffre 1 : Année de création */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#0B3827] leading-none tracking-tight">
              2000
            </span>
            <span className="font-title-lg text-title-lg text-primary font-bold mt-1">
              Année de création
            </span>
            <p className="font-body-sm text-body-sm text-tertiary max-w-xs">
              Fondé le 8 octobre 2000 suite aux contextes de violation des droits humains en Côte d&apos;Ivoire.
            </p>
          </div>

          {/* Chiffre 2 : Membres engagés */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1 md:pl-8 md:border-l border-outline-variant/40">
            <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#0B3827] leading-none tracking-tight">
              300+
            </span>
            <span className="font-title-lg text-title-lg text-primary font-bold mt-1">
              Membres engagés
            </span>
            <p className="font-body-sm text-body-sm text-tertiary max-w-xs">
              Militants, juristes, observateurs et bénévoles répartis sur l&apos;ensemble du territoire national.
            </p>
          </div>

          {/* Chiffre 3 : Sections territoriales */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1 md:pl-8 md:border-l border-outline-variant/40">
            <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#0B3827] leading-none tracking-tight">
              Environ 20
            </span>
            <span className="font-title-lg text-title-lg text-primary font-bold mt-1">
              Sections &amp; sous-sections
            </span>
            <p className="font-body-sm text-body-sm text-tertiary max-w-xs">
              Sections et sous-sections réparties sur le territoire national pour un ancrage local de proximité.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
