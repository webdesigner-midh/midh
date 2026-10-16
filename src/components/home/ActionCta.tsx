import Link from 'next/link';

export default function ActionCta() {
  return (
    <section className="w-full bg-[#0B3827] text-white py-space-xl sm:py-space-2xl lg:py-space-3xl relative overflow-hidden" id="don">
      {/* Halos lumineux en arrière-plan */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#138A2E]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#138A2E]/10 blur-3xl pointer-events-none" />

      <div className="site-container relative z-10 flex flex-col gap-space-xl sm:gap-space-2xl">
        {/* Titre & Chapeau */}
        <div className="max-w-2xl flex flex-col gap-3">
          <span className="font-label-md text-label-md text-[#8dfa8f] uppercase tracking-widest font-semibold">
            Agir à nos côtés
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-extrabold leading-tight tracking-tight">
            Les droits humains ont besoin de toutes les voix.
          </h2>
          <p className="font-body-lg text-sm sm:text-base md:text-body-lg text-surface-variant/90 leading-relaxed">
            Chaque engagement compte pour faire progresser la protection des droits et renforcer la mobilisation citoyenne en Côte d&apos;Ivoire.
          </p>
        </div>

        {/* 3 Piliers d'action conformes au cahier des charges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-space-lg">
          {/* Pilier 1: Faire un don */}
          <div className="bg-white/10 backdrop-blur-md p-5 sm:p-8 rounded-2xl flex flex-col justify-between gap-6 hover:bg-white/15 transition-all border border-white/10">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#138A2E] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">volunteer_activism</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-white">1. Faire un don</h3>
                <p className="font-body-sm text-body-sm text-surface-variant mt-2 leading-relaxed">
                  Soutenir les actions de l&apos;ONG (Interface d&apos;information et de préparation pour le paiement Mobile Money sécurisé)
                </p>
              </div>
            </div>
            <div>
              <Link
                className="inline-flex items-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] text-white font-label-lg text-label-lg px-6 py-3 rounded-lg w-full justify-center transition-colors shadow-sm active:scale-95"
                href="/don"
              >
                <span>Faire un don Mobile Money</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Pilier 2: Devenir bénévole */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl flex flex-col justify-between gap-6 hover:bg-white/15 transition-all border border-white/10">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 text-[#8dfa8f] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">group_add</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-white">2. Devenir bénévole</h3>
                <p className="font-body-sm text-body-sm text-surface-variant mt-2 leading-relaxed">
                  Formulaire de candidature bénévole pour rejoindre les sections locales et participer concrètement aux activités de proximité.
                </p>
              </div>
            </div>
            <div>
              <Link
                className="inline-flex items-center gap-2 bg-white text-[#0B3827] hover:bg-surface-bright font-label-lg text-label-lg px-6 py-3 rounded-lg w-full justify-center transition-colors shadow-sm active:scale-95"
                href="/benevolat"
              >
                <span>Rejoindre nos sections locales</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Pilier 3: Nous contacter */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl flex flex-col justify-between gap-6 hover:bg-white/15 transition-all border border-white/10">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 text-[#8dfa8f] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[26px]">chat</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-white">3. Nous contacter</h3>
                <p className="font-body-sm text-body-sm text-surface-variant mt-2 leading-relaxed">
                  Échanger avec la coordination nationale à Abidjan pour toute demande d&apos;assistance, signalement ou partenariat.
                </p>
              </div>
            </div>
            <div>
              <Link
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-label-lg text-label-lg px-6 py-3 rounded-lg w-full justify-center transition-colors active:scale-95"
                href="/contact"
              >
                <span>Échanger avec la coordination</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
