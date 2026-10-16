'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/nos-actions', label: 'Nos actions' },
    { href: '/actualites', label: 'Actualités' },
    { href: '/documents-rapports', label: 'Documents & Rapports' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Barre d'information institutionnelle supérieure */}
      <div className="bg-[#0B3827] text-white hidden sm:block border-b border-white/10 shadow-xs">
        <div className="site-container flex items-center justify-between min-h-[36px] py-1 text-xs">
          {/* Gauche : Nom organisation + Année de création + Siège */}
          <div className="flex items-center gap-2.5 overflow-hidden text-white/95">
            <span className="flex items-center gap-1.5 font-semibold text-white shrink-0">
              <span className="material-symbols-outlined text-[15px] text-emerald-300">verified</span>
              <span>Mouvement Ivoirien des Droits Humains</span>
            </span>
            <span className="hidden xl:inline text-white/30">•</span>
            <span className="hidden xl:inline text-white/85 truncate">
              Année de création : le 08 octobre 2000
            </span>
            <span className="hidden xl:inline text-white/30">/</span>
            <span className="hidden xl:inline text-white/85 truncate">
              Siège : Abidjan, Cocody Angré, Carrefour les Oscars
            </span>
            {/* Affichage pour écrans moyens md/lg */}
            <span className="hidden md:inline xl:hidden text-white/30">•</span>
            <span className="hidden md:inline xl:hidden text-white/85 truncate">
              Créé le 08 oct. 2000 / Cocody Angré
            </span>
          </div>

          {/* Droite : Téléphone/WhatsApp + Email + Sélecteur FR/EN avec drapeaux */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Téléphone & WhatsApp */}
            <a
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              href="https://wa.me/2250101498739"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacter le MIDH sur WhatsApp ou par téléphone"
            >
              <span className="material-symbols-outlined text-[14px] text-emerald-300">call</span>
              {/* Logo WhatsApp SVG */}
              <svg className="w-3.5 h-3.5 fill-emerald-300 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span className="font-medium tracking-tight">+225 01 01 49 87 39</span>
            </a>

            <span className="text-white/30">•</span>

            {/* Email officiel */}
            <a
              className="inline-flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
              href="mailto:contact@midh-ci.org"
              aria-label="Envoyer un email au MIDH"
            >
              <span className="material-symbols-outlined text-[14px] text-emerald-300">mail</span>
              <span className="font-medium tracking-tight">contact@midh-ci.org</span>
            </a>

            <span className="text-white/30">•</span>

            {/* Sélecteur de langue avec drapeaux interactifs (préparation traduction automatique) */}
            <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-full border border-white/10" role="group" aria-label="Choix de la langue">
              <button
                type="button"
                onClick={() => setLang('FR')}
                aria-pressed={lang === 'FR'}
                title="Passer le site en Français"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  lang === 'FR'
                    ? 'bg-white text-[#0B3827] shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Drapeau France SVG */}
                <svg className="w-3.5 h-2.5 rounded-[2px] shadow-xs shrink-0 overflow-hidden" viewBox="0 0 3 2">
                  <rect width="1" height="2" fill="#002395" />
                  <rect width="1" height="2" x="1" fill="#FFFFFF" />
                  <rect width="1" height="2" x="2" fill="#ED2939" />
                </svg>
                <span>FR</span>
              </button>

              <button
                type="button"
                onClick={() => setLang('EN')}
                aria-pressed={lang === 'EN'}
                title="Switch website to English (Automated translation ready)"
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  lang === 'EN'
                    ? 'bg-white text-[#0B3827] shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {/* Drapeau USA SVG */}
                <svg className="w-3.5 h-2.5 rounded-[2px] shadow-xs shrink-0 overflow-hidden" viewBox="0 0 7410 3900">
                  <rect width="7410" height="3900" fill="#b22234"/>
                  <path d="M0,450H7410M0,1050H7410M0,1650H7410M0,2250H7410M0,2850H7410M0,3450H7410" stroke="#fff" strokeWidth="300"/>
                  <rect width="2964" height="2100" fill="#3c3b6e"/>
                  <g fill="#fff">
                    <circle cx="500" cy="400" r="140"/>
                    <circle cx="1000" cy="400" r="140"/>
                    <circle cx="1500" cy="400" r="140"/>
                    <circle cx="2000" cy="400" r="140"/>
                    <circle cx="2500" cy="400" r="140"/>
                    <circle cx="750" cy="800" r="140"/>
                    <circle cx="1250" cy="800" r="140"/>
                    <circle cx="1750" cy="800" r="140"/>
                    <circle cx="2250" cy="800" r="140"/>
                    <circle cx="500" cy="1200" r="140"/>
                    <circle cx="1000" cy="1200" r="140"/>
                    <circle cx="1500" cy="1200" r="140"/>
                    <circle cx="2000" cy="1200" r="140"/>
                    <circle cx="2500" cy="1200" r="140"/>
                    <circle cx="750" cy="1600" r="140"/>
                    <circle cx="1250" cy="1600" r="140"/>
                    <circle cx="1750" cy="1600" r="140"/>
                    <circle cx="2250" cy="1600" r="140"/>
                  </g>
                </svg>
                <span>EN</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de navigation principale */}
      <div className="h-16 sm:h-20 w-full site-container flex items-center justify-between gap-space-sm sm:gap-space-md">
        {/* Logo MIDH */}
        <div className="flex items-center gap-space-md shrink-0">
          <Link className="flex items-center gap-space-sm group" href="/" aria-label="Accueil MIDH">
            <div className="bg-surface-container-lowest p-1 sm:p-1.5 rounded-lg flex items-center justify-center shadow-xs group-hover:shadow-sm transition-all">
              <img
                alt="Logo MIDH - Mouvement Ivoirien des Droits Humains"
                className="h-8 sm:h-9 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqleL8xzGZSLZrm2GJ1CkOLa3XtfT-YB-qju_J3cgaA7uVqvANt-B6jBuOtXUvm3yFvyb03jR7ahcjyvlLOZEpRfv0bNvT7SNgtz-lguwRFFE9hFySm4XIkh67F3xF4EZodlXLuBhLjXS00O1IcyEXBpdDKkQNx8da-SITyDTmbfgXfQD7uv3cGb3IEew3hoQXcaXCdv7J5wUJWBfeVCsRzWifeF4jh7ldsz4l74QWSxnSTY_Iz9vjMSu9ojWTkBmGmA"
              />
            </div>
          </Link>
        </div>

        {/* Liens desktop */}
        <nav className="hidden lg:flex items-center gap-space-xs p-1" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-space-md py-space-sm font-label-lg text-label-lg transition-colors rounded-lg ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bouton CTA Don & Menu Mobile */}
        <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
          <Link
            className="inline-flex items-center gap-1.5 sm:gap-space-sm bg-primary-container hover:bg-primary text-on-primary font-label-lg text-xs sm:text-label-lg px-3 py-2 sm:px-space-lg sm:py-2.5 rounded-lg transition-all shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-md active:scale-95"
            href="/don"
          >
            <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            <span className="hidden sm:inline">Faire un don</span>
          </Link>

          {/* Pastille visuelle régalienne */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-bold text-xs" title="République de Côte d'Ivoire">
            CI
          </div>

          {/* Déclencheur menu mobile */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label="Ouvrir le menu de navigation"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Menu mobile dépliant */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-outline-variant/30 bg-surface-container-lowest site-container py-space-md shadow-lg">
          <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-label-lg text-label-lg transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-secondary-container text-on-secondary-container font-semibold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="material-symbols-outlined text-[18px] text-tertiary">chevron_right</span>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-surface-container flex flex-col gap-2">
              <Link
                href="/don"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary py-3 rounded-lg font-label-lg"
              >
                <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                <span>Faire un don au MIDH</span>
              </Link>
              <div className="p-3 bg-surface-container rounded-lg text-caption text-tertiary flex flex-col gap-1">
                <span>Téléphone / WhatsApp : +225 01 01 49 87 39</span>
                <span>Email : contact@midh-ci.org</span>
                <span>Siège : Abidjan, Cocody Angré, Carrefour les Oscars</span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
