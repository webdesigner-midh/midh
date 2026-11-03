'use client';

import { MIDHPartner } from '@/types/wordpress';
import { useEffect, useRef, useState } from 'react';
import PartnerArticleModal from './PartnerArticleModal';

interface PartnersCarouselProps {
  partners: MIDHPartner[];
}

export default function PartnersCarousel({ partners }: PartnersCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<MIDHPartner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Défilement automatique toutes les 3,8 secondes avec pause au survol
  useEffect(() => {
    if (!partners || partners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % partners.length;
        if (scrollContainerRef.current) {
          const cards = Array.from(scrollContainerRef.current.children) as HTMLElement[];
          if (cards[next]) {
            scrollContainerRef.current.scrollTo({
              left: cards[next].offsetLeft - scrollContainerRef.current.offsetLeft,
              behavior: 'smooth',
            });
          }
        }
        return next;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [partners, isPaused]);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const cards = Array.from(scrollContainerRef.current.children) as HTMLElement[];
    if (cards[index]) {
      scrollContainerRef.current.scrollTo({
        left: cards[index].offsetLeft - scrollContainerRef.current.offsetLeft,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  const handleScroll = (direction: 'prev' | 'next') => {
    if (!partners.length) return;
    const nextIndex =
      direction === 'prev'
        ? (activeIndex - 1 + partners.length) % partners.length
        : (activeIndex + 1) % partners.length;
    scrollToIndex(nextIndex);
  };

  const handleOpenPartnerArticle = (partner: MIDHPartner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  if (!partners || partners.length === 0) return null;

  return (
    <div
      className="relative w-full py-4 flex flex-col gap-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Barre de contrôles et titre de section partenaire */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="font-label-md text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0B3827]">
            Réseau de nos Partenaires Actifs
          </span>
        </div>

        {/* Flèches de navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('prev')}
            aria-label="Partenaire précédent"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-outline-variant/70 bg-white hover:bg-surface-container flex items-center justify-center text-primary shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => handleScroll('next')}
            aria-label="Partenaire suivant"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-outline-variant/70 bg-white hover:bg-surface-container flex items-center justify-center text-primary shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Conteneur Carrousel défilant */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-3 pt-1"
        tabIndex={0}
        role="region"
        aria-label="Carrousel des partenaires du MIDH"
      >
        {partners.map((partner, idx) => {
          const imageSrc =
            partner.featuredImage ||
            partner.logoUrl ||
            'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={partner.id || idx}
              onClick={() => handleOpenPartnerArticle(partner)}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] snap-start bg-white rounded-2xl border border-outline-variant/50 shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1.5 flex flex-col overflow-hidden cursor-pointer group"
            >
              {/* Photo mise en avant avec zoom hover */}
              <div className="relative h-44 w-full bg-surface-container overflow-hidden">
                <img
                  src={imageSrc}
                  alt={partner.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Badge Type de Partenaire */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-[#0B3827] backdrop-blur-md shadow-xs">
                    {partner.typeLabel || 'Partenaire'}
                  </span>
                </div>

                {/* Icône lecture rapide au survol */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-md">
                  <span className="material-symbols-outlined text-[18px]">article</span>
                </div>
              </div>

              {/* Contenu textuel de la carte */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <h4 className="font-display text-base sm:text-lg font-bold text-[#0B3827] line-clamp-1 group-hover:text-primary transition-colors">
                    {partner.name}
                  </h4>
                  <p className="font-body-sm text-xs sm:text-sm text-tertiary line-clamp-2 leading-relaxed">
                    {partner.excerpt || partner.description || 'Découvrez les actions et programmes conjoints avec le MIDH.'}
                  </p>
                </div>

                {/* Bouton Voir l'article */}
                <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-[#0F7326]">
                  <span className="inline-flex items-center gap-1">
                    <span>Voir l&apos;article du partenaire</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Puces de pagination / Indicateurs */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {partners.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => scrollToIndex(dotIdx)}
            aria-label={`Aller au partenaire ${dotIdx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === dotIdx
                ? 'w-6 bg-primary'
                : 'w-2 bg-outline-variant/60 hover:bg-outline-variant'
            }`}
          />
        ))}
      </div>

      {/* Modale d'article partenaire */}
      <PartnerArticleModal
        partner={selectedPartner}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

