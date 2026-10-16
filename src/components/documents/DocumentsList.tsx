'use client';

import { useState, useMemo } from 'react';
import type { MIDHDocument } from '@/types/wordpress';

interface DocumentsListProps {
  documents: MIDHDocument[];
}

const CATEGORIES = [
  { id: 'tous', label: 'Tous les documents' },
  { id: 'rapport_annuel', label: 'Rapports annuels' },
  { id: 'guide', label: 'Guides & Manuels' },
  { id: 'etude', label: 'Études thématiques' },
  { id: 'declaration', label: 'Déclarations officielles' },
];

export default function DocumentsList({ documents }: DocumentsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Filtre catégorie
      const matchesCategory =
        selectedCategory === 'tous' ||
        doc.category === selectedCategory ||
        (selectedCategory === 'guide' && (doc.category?.includes('guide') || doc.categoryLabel?.toLowerCase().includes('guide'))) ||
        (selectedCategory === 'etude' && (doc.category?.includes('etude') || doc.categoryLabel?.toLowerCase().includes('étude') || doc.categoryLabel?.toLowerCase().includes('etude'))) ||
        (selectedCategory === 'declaration' && (doc.category?.includes('declaration') || doc.categoryLabel?.toLowerCase().includes('déclaration') || doc.categoryLabel?.toLowerCase().includes('declaration')));

      // Filtre recherche textuelle
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.excerpt.toLowerCase().includes(q) ||
        doc.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-8">
      {/* Barre d'outils : Filtres & Recherche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-outline-variant/30 shadow-xs">
        {/* Filtres par catégorie */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === 'tous'
                ? documents.length
                : documents.filter((d) => {
                    if (cat.id === 'guide') return d.category?.includes('guide') || d.categoryLabel?.toLowerCase().includes('guide');
                    if (cat.id === 'etude') return d.category?.includes('etude') || d.categoryLabel?.toLowerCase().includes('étude') || d.categoryLabel?.toLowerCase().includes('etude');
                    if (cat.id === 'declaration') return d.category?.includes('declaration') || d.categoryLabel?.toLowerCase().includes('déclaration');
                    return d.category === cat.id;
                  }).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0B3827] text-white shadow-xs'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-outline-variant/20 text-on-surface-variant'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Barre de recherche */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un rapport..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-surface-container-low text-on-surface rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[14px]"
              aria-label="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grille de documents */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDocuments.map((doc) => (
            <article
              key={doc.id}
              className="bg-white p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-emerald-300 flex flex-col justify-between gap-6 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[26px]">picture_as_pdf</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0B3827] border border-emerald-100 text-xs font-semibold">
                    {doc.categoryLabel || 'Rapport officiel'}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg text-[#0B3827] font-bold leading-snug group-hover:text-emerald-900 transition-colors">
                  {doc.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {doc.excerpt || 'Consultez le document complet du MIDH au format PDF.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex flex-col text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {doc.fileFormat || 'PDF'} • {doc.fileSize || 'Standard'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {doc.publicationDate || '2026'}
                  </span>
                </div>

                <a
                  href={doc.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 bg-[#138A2E] hover:bg-[#0F7326] active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs shrink-0"
                >
                  <span>Télécharger</span>
                  <span className="material-symbols-outlined text-[16px]">download</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center gap-4">
          <span className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">folder_off</span>
          </span>
          <h3 className="text-lg font-bold text-slate-800">Aucun document trouvé</h3>
          <p className="text-sm text-slate-500 max-w-md">
            Aucun rapport ne correspond à votre filtre actuel ou à votre recherche « {searchQuery} ».
          </p>
          <button
            onClick={() => {
              setSelectedCategory('tous');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs sm:text-sm transition-colors border border-emerald-200"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
