'use client';

import { MIDHArticle, MIDHDocument, PublicationCategory } from '@/types/wordpress';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NewsAndReportsProps {
  initialArticles: MIDHArticle[];
  documents: MIDHDocument[];
}

export default function NewsAndReports({ initialArticles, documents }: NewsAndReportsProps) {
  const [selectedCategory, setSelectedCategory] = useState<PublicationCategory>('tous');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const categories: { key: PublicationCategory; label: string }[] = [
    { key: 'tous', label: 'Tous' },
    { key: 'communiques', label: 'Communiqués' },
    { key: 'rapports', label: 'Rapports' },
    { key: 'declarations', label: 'Déclarations' },
  ];

  const filteredArticles =
    selectedCategory === 'tous'
      ? initialArticles
      : initialArticles.filter((a) => a.category === selectedCategory);

  const articlesToDisplay = filteredArticles.length > 0 ? filteredArticles : initialArticles;

  // Réinitialiser l'index si la catégorie change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Autoplay doux pour le carrousel d'articles (toutes les 6 secondes, sauf si survolé)
  useEffect(() => {
    if (articlesToDisplay.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articlesToDisplay.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [articlesToDisplay.length, isPaused]);

  const currentArticle = articlesToDisplay[currentIndex] || articlesToDisplay[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + articlesToDisplay.length) % articlesToDisplay.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % articlesToDisplay.length);
  };

  const secondaryArticles = initialArticles.filter((a) => a.id !== currentArticle?.id).slice(0, 1);
  const featuredDoc = documents[0];

  return (
    <section className="w-full bg-surface-container-low py-space-xl sm:py-space-2xl lg:py-space-3xl border-t border-outline-variant/30">
      <div className="site-container flex flex-col gap-space-xl sm:gap-space-2xl">
        {/* En-tête et filtres */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-semibold">
              Veille &amp; Rapports
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-headline-lg text-[#0B3827] font-bold leading-tight">
              Comprendre. Informer. Agir.
            </h2>
          </div>

          {/* Filtres de catégories */}
          <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Filtrer les publications">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-[#0B3827] text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container text-tertiary hover:text-on-surface'
                }`}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.key}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Disposition Média Institutionnel (12 colonnes) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          {/* CARROUSEL D'ARTICLES EN CARD (7 colonnes) */}
          <div
            className="lg:col-span-7 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/40 flex flex-col justify-between hover:shadow-md transition-all relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {currentArticle && (
              <>
                {/* Zone Image Mise en Avant (avec support plein format ou placeholder brandé) */}
                <div className="relative h-64 sm:h-80 bg-surface-container flex flex-col items-center justify-center overflow-hidden">
                  {currentArticle.featuredImage ? (
                    <img
                      src={currentArticle.featuredImage}
                      alt={currentArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-tertiary bg-gradient-to-br from-[#f0f5f0] to-[#e5e9e4]">
                      <span className="material-symbols-outlined text-[52px] text-primary/70 mb-2">image</span>
                      <span className="font-label-md text-label-md uppercase tracking-wider font-bold text-on-surface">
                        [{currentArticle.categoryLabel}]
                      </span>
                      <span className="font-caption text-caption text-secondary mt-1">
                        Image mise en avant WordPress
                      </span>
                    </div>
                  )}

                  {/* Badge d'espace */}
                  <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full text-caption font-semibold shadow-xs flex items-center gap-1.5 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
                    <span>Actualité {currentIndex + 1} / {articlesToDisplay.length}</span>
                  </div>

                  {/* Contrôles de navigation gauche / droite sur l'image */}
                  {articlesToDisplay.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handlePrev}
                        className="pointer-events-auto p-2.5 rounded-full bg-surface-container-lowest/85 backdrop-blur-md text-on-surface shadow-md hover:bg-surface-container-lowest hover:scale-110 active:scale-95 transition-all"
                        aria-label="Article précédent"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px] block leading-none">chevron_left</span>
                      </button>
                      <button
                        onClick={handleNext}
                        className="pointer-events-auto p-2.5 rounded-full bg-surface-container-lowest/85 backdrop-blur-md text-on-surface shadow-md hover:bg-surface-container-lowest hover:scale-110 active:scale-95 transition-all"
                        aria-label="Article suivant"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px] block leading-none">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Corps de la carte */}
                <div className="p-space-lg sm:p-space-xl flex flex-col justify-between flex-grow gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
                        {currentArticle.formattedDate} · {currentArticle.author || 'MIDH'} · {currentArticle.categoryLabel}
                      </span>

                      {/* Indicateurs (dots) du carrousel */}
                      {articlesToDisplay.length > 1 && (
                        <div className="flex items-center gap-1.5" aria-label="Choisir l'article">
                          {articlesToDisplay.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentIndex(idx)}
                              className={`h-2 rounded-full transition-all ${
                                currentIndex === idx
                                  ? 'w-6 bg-primary'
                                  : 'w-2 bg-outline-variant hover:bg-primary/50'
                              }`}
                              aria-label={`Aller à l'article ${idx + 1}`}
                              type="button"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="font-headline-md text-headline-md text-[#0B3827] font-bold leading-snug line-clamp-2">
                      <Link href={`/actualites/${currentArticle.slug}`} className="hover:text-primary transition-colors">
                        {currentArticle.title}
                      </Link>
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-3">
                      {currentArticle.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-surface-container">
                    <Link
                      className="inline-flex items-center gap-1.5 font-label-lg text-label-lg text-primary font-bold hover:gap-2.5 transition-all"
                      href={`/actualites/${currentArticle.slug}`}
                    >
                      <span>Lire l&apos;article complet</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                    <span className="font-caption text-caption text-tertiary">
                      {articlesToDisplay.length} publication{articlesToDisplay.length > 1 ? 's' : ''} disponible{articlesToDisplay.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* COLONNE DROITE : 1 Document & 1 Autre Actualité (5 colonnes) */}
          <div className="lg:col-span-5 flex flex-col gap-space-lg">
            {/* Carte 1 : Rapport d'activité ou Document PDF */}
            {featuredDoc && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col justify-between flex-1 gap-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-secondary-container/60 text-primary font-label-md text-label-md font-semibold">
                      [Rapport officiel]
                    </span>
                    <span className="font-caption text-caption text-tertiary">
                      {featuredDoc.fileFormat} · {featuredDoc.fileSize}
                    </span>
                  </div>
                  <h4 className="font-title-lg text-title-lg text-on-surface font-bold hover:text-primary transition-colors">
                    <Link href="/documents-rapports">{featuredDoc.title}</Link>
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-2">
                    {featuredDoc.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                  <span className="font-caption text-caption text-secondary font-medium">
                    {featuredDoc.publicationDate}
                  </span>
                  <a
                    className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:underline"
                    href={featuredDoc.fileUrl}
                    download
                  >
                    <span>Télécharger le document</span>
                    <span className="material-symbols-outlined text-[16px]">download</span>
                  </a>
                </div>
              </div>
            )}

            {/* Carte 2 : Deuxième article récent en aperçu */}
            {secondaryArticles[0] && (
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/40 flex flex-col justify-between flex-1 gap-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-surface-container text-tertiary font-label-md text-label-md font-semibold">
                      [{secondaryArticles[0].categoryLabel}]
                    </span>
                    <span className="font-caption text-caption text-tertiary">
                      {secondaryArticles[0].formattedDate}
                    </span>
                  </div>
                  <h4 className="font-title-lg text-title-lg text-on-surface font-bold hover:text-primary transition-colors">
                    <Link href={`/actualites/${secondaryArticles[0].slug}`}>{secondaryArticles[0].title}</Link>
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-2">
                    {secondaryArticles[0].excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                  <span className="font-caption text-caption text-tertiary">
                    {secondaryArticles[0].author || 'MIDH'}
                  </span>
                  <Link
                    className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:underline"
                    href={`/actualites/${secondaryArticles[0].slug}`}
                  >
                    <span>Consulter</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bouton toutes les publications */}
        <div className="flex justify-center pt-space-md">
          <Link
            className="inline-flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg px-8 py-3 rounded-lg transition-colors shadow-xs active:scale-95"
            href="/documents-rapports"
          >
            <span>Consulter toutes les publications et documents PDF</span>
            <span className="material-symbols-outlined text-[18px]">library_books</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
