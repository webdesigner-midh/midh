'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { MIDHHeroSlide } from '@/types/wordpress';
import { FALLBACK_HERO_SLIDES } from '@/data/fallbackData';

interface HeroCarouselProps {
  initialSlides?: MIDHHeroSlide[];
}

export default function HeroCarousel({ initialSlides }: HeroCarouselProps) {
  const slides = initialSlides && initialSlides.length > 0 ? initialSlides : FALLBACK_HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Défilement automatique doux toutes les 7 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide] || slides[0];

  return (
    <section className="relative w-full bg-surface-container-lowest overflow-hidden">
      <div className="site-container py-space-lg sm:py-space-xl lg:py-space-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Colonne de texte institutionnel (6 colonnes) */}
          <div className="lg:col-span-6 flex flex-col gap-space-md z-10 min-w-0">
            {/* Surtitre avec badge officiel */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container font-label-md text-xs sm:text-sm uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
                <span>PROMOTION · PROTECTION · DÉFENSE</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container-high text-tertiary font-caption text-xs">
                <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">verified</span>
                <span>ONG de droit ivoirien (fondée en 2000)</span>
              </span>
            </div>

            {/* Titre principal magistral */}
            <h1 className="font-display text-[1.75rem] sm:text-3xl md:text-5xl lg:text-[3.25rem] xl:text-[3.6rem] text-[#0B3827] leading-[1.15] tracking-tight break-words font-extrabold">
              Les droits humains, une responsabilité collective.
            </h1>

            {/* Texte introductif soigné */}
            <p className="font-body-lg text-sm sm:text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Le Mouvement Ivoirien des Droits Humains (MIDH) s&apos;engage à assurer la promotion, la protection et la défense des droits reconnus, et à faire connaître de nouveaux droits sur l&apos;ensemble du territoire national.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-space-xs">
              <Link
                className="inline-flex items-center justify-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] text-on-primary font-label-lg text-label-lg px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 text-center"
                href="/nos-actions"
              >
                <span>Découvrir nos actions</span>
                <svg className="w-4 h-4 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24">
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg px-6 py-3.5 rounded-lg transition-colors active:scale-95 text-center"
                href="/devenir-benevole"
              >
                <span>Devenir bénévole</span>
                <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">handshake</span>
              </Link>
            </div>

            {/* Badge d'ancrage territorial historique */}
            <div className="flex items-center gap-3 pt-space-sm">
              <div className="flex -space-x-1.5 shrink-0">
                <span className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-xs">
                  CI
                </span>
                <span className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                  24
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-xs sm:text-sm text-on-surface font-semibold">
                  Créé le 8 octobre 2000 en Côte d&apos;Ivoire · Plus de 300 membres
                </span>
                <span className="font-caption text-xs text-tertiary">
                  Organisation non gouvernementale reconnue d&apos;intérêt civique
                </span>
              </div>
            </div>
          </div>

          {/* Colonne visuelle : Carrousel interactif (6 colonnes) */}
          <div className="lg:col-span-6 relative">
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-surface-container-high h-[460px] lg:h-[540px] select-none group"
              id="hero-carousel"
            >
              <div className="relative w-full h-full">
                {slides.map((slide, index) => {
                  const isCurrent = index === currentSlide;
                  return (
                    <div
                      key={slide.title}
                      className={`hero-slide absolute inset-0 transition-opacity duration-700 ${
                        isCurrent ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                      }`}
                    >
                      <img
                        alt={slide.alt}
                        className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-700"
                        src={slide.image}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                  );
                })}
              </div>

              {/* Bouton précédent */}
              <button
                aria-label="Diapositive précédente"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface/80 hover:bg-surface text-on-surface backdrop-blur-md shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95"
                onClick={prevSlide}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              {/* Bouton suivant */}
              <button
                aria-label="Diapositive suivante"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface/80 hover:bg-surface text-on-surface backdrop-blur-md shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95"
                onClick={nextSlide}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>

              {/* Panneau contextuel d'information de diapositive */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-3">
                <div className="p-4 rounded-xl bg-surface/90 backdrop-blur-md shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[22px]">{current.icon}</span>
                    </div>
                    <div>
                      <span className="block font-title-lg text-title-lg text-[#0B3827] font-bold">
                        {current.title}
                      </span>
                      <span className="block font-caption text-caption text-tertiary">
                        {current.desc}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold px-2.5 py-1 rounded bg-secondary-container/50">
                      {current.tag}
                    </span>
                  </div>
                </div>

                {/* Puces de navigation */}
                <div className="flex items-center justify-center gap-2" id="hero-dots">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Aller à la diapositive ${idx + 1}`}
                      className={`h-2 rounded-full transition-all shadow-xs ${
                        idx === currentSlide
                          ? 'w-7 bg-[#138A2E]'
                          : 'w-2.5 bg-white/70 hover:bg-white'
                      }`}
                      onClick={() => goToSlide(idx)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
