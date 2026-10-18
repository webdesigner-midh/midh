'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MIDHSection } from '@/types/wordpress';
import { OFFICIAL_GALLERY_PHOTOS } from '@/data/galleryData';

interface TerritorialMapProps {
  sections: MIDHSection[];
}

export default function TerritorialMap({ sections }: TerritorialMapProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = OFFICIAL_GALLERY_PHOTOS.slice(0, 6);

  // Défilement automatique doux toutes les 5 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section className="w-full bg-background py-space-xl sm:py-space-2xl lg:py-space-3xl border-t border-outline-variant/30">
      <div className="site-container flex flex-col gap-space-xl sm:gap-space-2xl">
        {/* En-tête de section */}
        <div className="max-w-3xl flex flex-col gap-space-xs">
          <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-semibold">
            Présence & Actions de terrain
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-headline-lg text-[#0B3827] font-bold leading-tight">
            Un engagement ancré sur l&apos;ensemble du territoire ivoirien.
          </h2>
          <p className="font-body-lg text-sm sm:text-base md:text-body-lg text-on-surface-variant">
            Le MIDH compte une vingtaine de sections et sous-sections réparties à travers le pays pour agir au plus près des réalités citoyennes.
          </p>
        </div>

        {/* Panneau d'Information & Carrousel de photos sur le terrain */}
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
                      ? 'bg-[#0B3827] text-white shadow-2xs'
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

          {/* Carrousel Dynamique des Actions de Terrain du MIDH (7 colonnes) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="w-full relative aspect-[16/10] sm:aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden shadow-md group border border-outline-variant/30">
              {/* Image active avec transition fluide */}
              <img
                key={current.id}
                src={current.imageUrl}
                alt={current.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />

              {/* Voile sombre pour lisibilité du texte */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Badge Catégorie & Date en haut */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B3827]/90 text-white text-[11px] font-bold backdrop-blur-md shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {current.categoryLabel}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/50 text-white/90 text-[11px] font-medium backdrop-blur-md">
                  {current.date}
                </span>
              </div>

              {/* Contenu textuel en bas du slide */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="text-sm sm:text-base md:text-lg font-bold line-clamp-2 leading-tight drop-shadow-sm mb-1">
                  {current.title}
                </h4>
                <p className="text-xs text-white/80 line-clamp-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-emerald-400">location_on</span>
                  <span>{current.location}</span>
                </p>
              </div>

              {/* Bouton Précédent */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Photo précédente"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              {/* Bouton Suivant */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Photo suivante"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>

              {/* Puces de navigation */}
              <div className="absolute bottom-2 right-4 flex items-center gap-1.5">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Aller au slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bouton CTA d'accès à la galerie complète */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="text-xs text-tertiary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">photo_library</span>
                <span>Médiathèque officielle : missions de terrain, ateliers & reportages</span>
              </div>
              <Link
                href="/galerie"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0B3827] hover:bg-[#12573c] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-95 group shrink-0"
              >
                <span>Visiter notre galerie photo & vidéo</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
