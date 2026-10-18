'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GalleryPhoto, GalleryVideo, OFFICIAL_GALLERY_PHOTOS, OFFICIAL_GALLERY_VIDEOS } from '@/data/galleryData';

export default function GalleryClient() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  
  // Pagination Photos (6 photos par page pour rapidité et légèreté)
  const PHOTOS_PER_PAGE = 6;
  const [photoPage, setPhotoPage] = useState(1);
  const [photoCategory, setPhotoCategory] = useState<string>('all');

  // Filtre photos par catégorie
  const filteredPhotos = OFFICIAL_GALLERY_PHOTOS.filter((photo) => {
    if (photoCategory === 'all') return true;
    return photo.category === photoCategory;
  });

  const totalPhotoPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE);
  const paginatedPhotos = filteredPhotos.slice(
    (photoPage - 1) * PHOTOS_PER_PAGE,
    photoPage * PHOTOS_PER_PAGE
  );

  // Lightbox Modal pour agrandir une photo
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const openLightbox = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextLightboxPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  const prevLightboxPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Hero Banner Institutionnel */}
      <section className="bg-gradient-to-b from-[#07261a] via-[#0B3827] to-[#12573c] text-white py-12 sm:py-16 lg:py-20">
        <div className="site-container">
          <nav className="flex items-center gap-2 text-xs text-white/70 mb-4 font-medium" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Médiathèque</span>
          </nav>

          <div className="max-w-3xl flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold w-fit backdrop-blur-sm border border-white/15">
              <span className="material-symbols-outlined text-[16px]">photo_library</span>
              Archives & Médiathèque Officielle
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Galerie Photos & Vidéos du MIDH
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
              Découvrez en images les actions de terrain, missions de plaidoyer, ateliers de formation citoyenne et reportages institutionnels menés par le Mouvement Ivoirien des Droits Humains à travers la Côte d&apos;Ivoire.
            </p>
          </div>

          {/* Sélecteur d'onglets (Photos / Vidéos) */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setActiveTab('photos'); setPhotoPage(1); }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                activeTab === 'photos'
                  ? 'bg-white text-[#0B3827] shadow-md scale-102'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>Galerie Photos ({OFFICIAL_GALLERY_PHOTOS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                activeTab === 'videos'
                  ? 'bg-white text-[#0B3827] shadow-md scale-102'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">smart_display</span>
              <span>Vidéos & Reportages ({OFFICIAL_GALLERY_VIDEOS.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Contenu de la Médiathèque */}
      <section className="py-10 sm:py-14 site-container">
        {/* ================= ONGLET 1 : PHOTOS ================= */}
        {activeTab === 'photos' && (
          <div className="flex flex-col gap-8">
            {/* Barre de filtres par thématique */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-tertiary uppercase tracking-wider mr-1">Filtre :</span>
                {[
                  { id: 'all', label: 'Toutes les photos' },
                  { id: 'terrain', label: 'Terrain & Monitoring' },
                  { id: 'formation', label: 'Formations' },
                  { id: 'plaidoyer', label: 'Plaidoyers & Presse' },
                  { id: 'partenaires', label: 'Partenariats' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { setPhotoCategory(cat.id); setPhotoPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      photoCategory === cat.id
                        ? 'bg-[#0B3827] text-white shadow-xs'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-tertiary font-medium">
                Affichage de {paginatedPhotos.length} sur {filteredPhotos.length} clichés
              </div>
            </div>

            {/* Grille des photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedPhotos.map((photo) => (
                <article
                  key={photo.id}
                  onClick={() => openLightbox(photo)}
                  className="group cursor-pointer bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Image container avec ratio 16/10 */}
                  <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Badge catégorie en haut */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#0B3827]/90 text-white text-[11px] font-bold backdrop-blur-xs shadow-xs">
                        {photo.categoryLabel}
                      </span>
                    </div>

                    {/* Icône zoom au survol */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#0B3827] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                    </div>
                  </div>

                  {/* Description sous la photo */}
                  <div className="p-4 sm:p-5 flex flex-col gap-2 flex-grow">
                    <div className="flex items-center justify-between text-caption text-tertiary">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">calendar_today</span>
                        <span>{photo.date}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-[140px]">
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">location_on</span>
                        <span>{photo.location}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-on-surface text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {photo.title}
                    </h3>

                    <p className="font-body-sm text-xs sm:text-body-sm text-tertiary line-clamp-2 leading-relaxed mt-1">
                      {photo.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination photos : Précédent / Suivant */}
            {totalPhotoPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setPhotoPage((p) => Math.max(1, p - 1))}
                  disabled={photoPage === 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-surface-container-low hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  <span>Précédent</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPhotoPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPhotoPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        pageNum === photoPage
                          ? 'bg-[#0B3827] text-white shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setPhotoPage((p) => Math.min(totalPhotoPages, p + 1))}
                  disabled={photoPage === totalPhotoPages}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-surface-container-low hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span>Suivant</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= ONGLET 2 : VIDÉOS ================= */}
        {activeTab === 'videos' && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0B3827]">Reportages, Débats & Plaidoyers Vidéos</h2>
                <p className="text-xs sm:text-sm text-tertiary mt-0.5">
                  Vidéos officielles issues des chaînes certifiées (YouTube, Facebook, Télévision nationale)
                </p>
              </div>
              <span className="text-xs font-bold text-primary bg-secondary-container px-3 py-1 rounded-full">
                {OFFICIAL_GALLERY_VIDEOS.length} vidéos disponibles
              </span>
            </div>

            {/* Grille des vidéos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {OFFICIAL_GALLERY_VIDEOS.map((video) => (
                <div
                  key={video.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Lecteur Vidéo Embed Responsive (YouTube) */}
                  <div className="relative aspect-video bg-black w-full overflow-hidden">
                    {video.youtubeId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-white text-center">
                        <span className="material-symbols-outlined text-[48px] text-red-500 mb-2">play_circle</span>
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold underline"
                        >
                          Visionner la vidéo sur {video.source}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Descriptif détaillé sous la vidéo */}
                  <div className="p-5 sm:p-6 flex flex-col gap-2.5 flex-grow">
                    <div className="flex items-center justify-between text-xs text-tertiary">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container font-semibold text-primary">
                        <span className="material-symbols-outlined text-[14px]">label</span>
                        {video.categoryLabel}
                      </span>
                      <span className="flex items-center gap-2">
                        {video.duration && (
                          <span className="flex items-center gap-1 font-mono font-medium">
                            <span className="material-symbols-outlined text-[13px]">schedule</span>
                            {video.duration}
                          </span>
                        )}
                        <span>•</span>
                        <span>{video.date}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-on-surface text-base sm:text-lg leading-snug">
                      {video.title}
                    </h3>

                    {/* Courte description explicative */}
                    <p className="font-body-sm text-xs sm:text-body-sm text-tertiary leading-relaxed mt-1">
                      {video.description}
                    </p>

                    <div className="pt-3 mt-auto border-t border-surface-container flex items-center justify-between">
                      <span className="text-xs text-tertiary font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-red-600">smart_display</span>
                        <span>Source : <strong>{video.source}</strong></span>
                      </span>

                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-emerald-700 transition-colors"
                      >
                        <span>Ouvrir sur {video.source}</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================= LIGHTBOX MODAL PLEIN ÉCRAN ================= */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton Fermer */}
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md"
              aria-label="Fermer la vue agrandie"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {/* Navigation Précédent */}
            <button
              type="button"
              onClick={prevLightboxPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md"
              aria-label="Photo précédente"
            >
              <span className="material-symbols-outlined text-[26px]">chevron_left</span>
            </button>

            {/* Navigation Suivant */}
            <button
              type="button"
              onClick={nextLightboxPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all shadow-md"
              aria-label="Photo suivante"
            >
              <span className="material-symbols-outlined text-[26px]">chevron_right</span>
            </button>

            {/* Image en grand format */}
            <div className="w-full max-h-[60vh] sm:max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full max-h-[65vh] object-contain"
              />
            </div>

            {/* Légende & Détails */}
            <div className="p-5 sm:p-6 bg-white flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0B3827] text-white font-bold">
                  {selectedPhoto.categoryLabel}
                </span>
                <span className="text-tertiary">•</span>
                <span className="text-tertiary">{selectedPhoto.date}</span>
                <span className="text-tertiary">•</span>
                <span className="text-tertiary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600">location_on</span>
                  {selectedPhoto.location}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface">
                {selectedPhoto.title}
              </h2>
              <p className="text-xs sm:text-sm text-tertiary leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
