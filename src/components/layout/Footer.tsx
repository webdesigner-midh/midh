import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface pt-space-xl sm:pt-space-2xl lg:pt-space-3xl pb-0 border-t border-outline-variant/30">
      <div className="site-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-lg lg:gap-space-xl mb-space-xl sm:mb-space-2xl">
        {/* Colonne 1 : Identité institutionnelle (4 colonnes) */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="flex items-center gap-space-sm">
            <div className="bg-surface-container-lowest p-2 rounded-lg inline-block shadow-xs">
              <img
                alt="MIDH Logo"
                className="h-9 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqleL8xzGZSLZrm2GJ1CkOLa3XtfT-YB-qju_J3cgaA7uVqvANt-B6jBuOtXUvm3yFvyb03jR7ahcjyvlLOZEpRfv0bNvT7SNgtz-lguwRFFE9hFySm4XIkh67F3xF4EZodlXLuBhLjXS00O1IcyEXBpdDKkQNx8da-SITyDTmbfgXfQD7uv3cGb3IEew3hoQXcaXCdv7J5wUJWBfeVCsRzWifeF4jh7ldsz4l74QWSxnSTY_Iz9vjMSu9ojWTkBmGmA"
              />
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-tertiary leading-relaxed">
            Le Mouvement Ivoirien des Droits Humains (MIDH) est une organisation non gouvernementale de droit ivoirien. Il œuvre pour la promotion, la protection et la défense des libertés fondamentales et de la dignité humaine.
          </p>
          <div className="flex items-center gap-2.5 pt-space-xs">
            <a
              aria-label="Page Facebook officielle du MIDH"
              className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center p-2 group"
              href="https://facebook.com/midh.ci"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons/facebook.png"
                alt="Facebook"
                className="w-full h-full object-contain transition-transform group-hover:scale-110"
                loading="lazy"
              />
            </a>
            <a
              aria-label="Compte Instagram officiel du MIDH"
              className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center p-2 group"
              href="https://instagram.com/midh.ci"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons/instagram.png"
                alt="Instagram"
                className="w-full h-full object-contain transition-transform group-hover:scale-110"
                loading="lazy"
              />
            </a>
            <a
              aria-label="Compte TikTok officiel du MIDH"
              className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center p-2 group"
              href="https://tiktok.com/@midh.ci"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons/tiktok.png"
                alt="TikTok"
                className="w-full h-full object-contain transition-transform group-hover:scale-110"
                loading="lazy"
              />
            </a>
            <a
              aria-label="Chaîne YouTube officielle du MIDH"
              className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center p-2 group"
              href="https://youtube.com/@midh-ci"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons/youtube.png"
                alt="YouTube"
                className="w-full h-full object-contain transition-transform group-hover:scale-110"
                loading="lazy"
              />
            </a>
          </div>
        </div>

        {/* Colonne 2 : Navigation (2 colonnes) */}
        <div className="lg:col-span-2 flex flex-col gap-space-md">
          <span className="font-title-lg text-title-lg text-on-surface font-bold">Navigation</span>
          <ul className="flex flex-col gap-space-sm font-body-sm text-body-sm text-tertiary">
            <li className="hover:text-primary transition-colors">
              <Link href="/">Accueil</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/a-propos">À propos</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/nos-actions">Nos actions</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/actualites">Actualités</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/documents-rapports">Documents &amp; Rapports</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/galerie" className="font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1">
                <span>📸 Médiathèque Photo &amp; Vidéo</span>
              </Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 : Domaines d'action (3 colonnes) */}
        <div className="lg:col-span-3 flex flex-col gap-space-md">
          <span className="font-title-lg text-title-lg text-on-surface font-bold">Domaines d&apos;action</span>
          <ul className="flex flex-col gap-space-sm font-body-sm text-body-sm text-tertiary">
            <li className="hover:text-primary transition-colors">
              <Link href="/nos-actions?domaine=elections">Élections &amp; Gouvernance</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/nos-actions?domaine=education">Éducation &amp; Santé</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/nos-actions?domaine=lutte-contre-la-corruption">Lutte contre la corruption</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/nos-actions?domaine=violences-basees-sur-le-genre">Violences basées sur le genre</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/nos-actions?domaine=environnement">Environnement</Link>
            </li>
            <li className="hover:text-primary transition-colors">
              <Link href="/nos-actions?domaine=securite-des-defenseures">Sécurité des défenseur·es</Link>
            </li>
            <li className="hover:text-emerald-800 transition-colors font-semibold text-emerald-700 pt-1">
              <Link href="/nos-actions">Voir tous les 14 domaines &rarr;</Link>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Coordonnées officielles (3 colonnes) */}
        <div className="lg:col-span-3 flex flex-col gap-space-md">
          <span className="font-title-lg text-title-lg text-on-surface font-bold">Coordonnées officielles</span>
          <div className="flex flex-col gap-space-sm font-body-sm text-body-sm text-tertiary">
            <div className="flex items-start gap-space-xs">
              <span className="material-symbols-outlined text-secondary shrink-0 text-[18px] mt-0.5">location_on</span>
              <span>Siège : Abidjan, Cocody Angré, Carrefour Duncan</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary shrink-0 text-[18px]">call</span>
              <a className="hover:text-primary transition-colors" href="https://wa.me/2250101498739" target="_blank" rel="noopener noreferrer">
                +225 01 01 49 87 39
              </a>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary shrink-0 text-[18px]">mail</span>
              <a className="hover:text-primary transition-colors break-all" href="mailto:info@midh-ci.org">
                info@midh-ci.org
              </a>
            </div>
            <div className="pt-2">
              <a
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#138A2E] text-white font-label-md text-label-md hover:bg-[#0F7326] transition-colors shadow-xs"
                href="https://wa.me/2250101498739"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Contact direct WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de bas de page */}
      <div className="w-full py-4 bg-surface-container/50 border-t border-outline-variant/20">
        <div className="site-container flex flex-col md:flex-row items-center justify-between gap-space-sm sm:gap-space-md font-caption text-caption text-tertiary">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-space-md">
            <Link className="hover:text-primary transition-colors" href="/mentions-legales">
              Mentions légales
            </Link>
            <span>•</span>
            <span className="text-tertiary">Statuts et références d&apos;enregistrement en cours de validation</span>
            <span>•</span>
            <Link className="hover:text-primary transition-colors" href="/politique-de-confidentialite">
              Politique de confidentialité
            </Link>
          </div>
          <p className="text-center md:text-right">© 2000 - 2026 MIDH. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
