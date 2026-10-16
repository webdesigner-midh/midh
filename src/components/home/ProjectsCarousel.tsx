'use client';

import { MIDHProject } from '@/types/wordpress';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ProjectsCarouselProps {
  projects: MIDHProject[];
}

export default function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Défilement automatique fluide toutes les 4,5 secondes avec pause au survol
  useEffect(() => {
    if (projects.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % projects.length;
        if (carouselRef.current) {
          const cards = Array.from(carouselRef.current.children) as HTMLElement[];
          if (cards[next]) {
            carouselRef.current.scrollTo({
              left: cards[next].offsetLeft - carouselRef.current.offsetLeft,
              behavior: 'smooth',
            });
          }
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [projects.length, isPaused]);

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const cards = Array.from(carouselRef.current.children) as HTMLElement[];
    if (cards[index]) {
      carouselRef.current.scrollTo({
        left: cards[index].offsetLeft - carouselRef.current.offsetLeft,
        behavior: 'smooth',
      });
    }
    setActiveIndex(index);
  };

  const scroll = (direction: 'left' | 'right') => {
    const nextIndex =
      direction === 'left'
        ? (activeIndex - 1 + projects.length) % projects.length
        : (activeIndex + 1) % projects.length;
    scrollToIndex(nextIndex);
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cards = Array.from(carouselRef.current.children) as HTMLElement[];
    if (cards.length === 0) return;

    let closestIndex = 0;
    let minDiff = Infinity;
    cards.forEach((card, i) => {
      const diff = Math.abs(card.offsetLeft - carouselRef.current!.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });
    setActiveIndex(closestIndex);
  };

  return (
    <section className="w-full bg-background py-space-xl sm:py-space-2xl lg:py-space-3xl" id="actions">
      <div className="site-container flex flex-col gap-space-lg sm:gap-space-xl">
        {/* En-tête avec contrôles */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="max-w-3xl flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-semibold">
              Projets &amp; Programmes
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-headline-lg text-[#0B3827] font-bold leading-tight">
              Nos actions et projets sur le terrain.
            </h2>
            <p className="font-body-lg text-sm sm:text-base md:text-body-lg text-on-surface-variant">
              Emplacements réservés pour les projets et programmes opérationnels du MIDH (données administrables en temps réel depuis le back-office WordPress).
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full md:w-auto">
            <Link
              className="inline-flex items-center gap-1.5 sm:gap-2 text-primary font-label-lg text-xs sm:text-label-lg hover:underline"
              href="/nos-actions"
            >
              <span>Voir tous nos projets</span>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">arrow_forward</span>
            </Link>
            <div className="inline-flex items-center gap-2">
              <button
                aria-label="Projet précédent"
                className="w-10 h-10 rounded-full border border-outline-variant/60 bg-surface-container-lowest text-[#0B3827] flex items-center justify-center hover:bg-[#138A2E] hover:text-on-primary hover:border-[#138A2E] transition-all shadow-xs active:scale-95"
                onClick={() => scroll('left')}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <button
                aria-label="Projet suivant"
                className="w-10 h-10 rounded-full border border-outline-variant/60 bg-surface-container-lowest text-[#0B3827] flex items-center justify-center hover:bg-[#138A2E] hover:text-on-primary hover:border-[#138A2E] transition-all shadow-xs active:scale-95"
                onClick={() => scroll('right')}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carrousel à défilement horizontal */}
        <div className="relative w-full">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            className="flex flex-nowrap overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scroll-smooth cursor-grab select-none no-scrollbar"
            id="projects-carousel"
          >
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="snap-start shrink-0 w-[300px] sm:w-[360px] lg:w-[380px] bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {/* En-tête carte visuel */}
                <div className="h-44 bg-surface-container flex flex-col items-center justify-center p-6 text-center text-tertiary border-b border-outline-variant/30 relative">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[36px] text-secondary mb-2">
                        {idx === 0 ? 'pending_actions' : idx === 1 ? 'task_alt' : idx === 2 ? 'campaign' : 'record_voice_over'}
                      </span>
                      <span className="font-label-md text-label-md uppercase tracking-wider font-semibold">
                        [{project.statusLabel}]
                      </span>
                      <span className="font-caption text-caption text-outline mt-1">
                        {project.period || 'Visuel / Illustration à renseigner'}
                      </span>
                    </>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-secondary-container/60 text-secondary font-label-md text-label-md font-semibold">
                    0{idx + 1}
                  </span>
                </div>

                {/* Corps de la carte */}
                <div className="p-6 flex flex-col justify-between flex-grow gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-secondary-container/50 text-secondary font-label-md text-label-md w-fit font-semibold">
                      {project.statusLabel}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold leading-snug">
                      {project.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {project.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                    <span className="font-caption text-caption text-tertiary">
                      {project.location ? `Zone : ${project.location}` : 'Statut : Synchronisé CMS'}
                    </span>
                    <Link
                      href={`/nos-actions/${project.slug}`}
                      className="text-primary hover:text-[#0F7326] font-label-md text-label-md font-semibold inline-flex items-center gap-1"
                    >
                      <span>Détails</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs de pagination */}
          <div className="flex items-center justify-center gap-2 pt-2" id="projects-carousel-dots">
            {projects.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Aller au projet ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex
                    ? 'w-7 bg-[#138A2E]'
                    : 'w-2.5 bg-outline-variant/60 hover:bg-[#138A2E]/60'
                }`}
                onClick={() => scrollToIndex(idx)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
