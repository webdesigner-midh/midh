'use client';

import { useState, useEffect } from 'react';
import type { MIDHDocument } from '@/types/wordpress';

interface PdfViewerModalProps {
  document: MIDHDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PdfViewerModal({
  document: doc,
  isOpen,
  onClose,
}: PdfViewerModalProps) {
  const [useGoogleViewer, setUseGoogleViewer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Gestion de la touche Échap et du scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setIsLoading(true);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Réinitialiser le loader à chaque changement de document
  useEffect(() => {
    if (doc) {
      setIsLoading(true);
      // Par défaut pour les URL relatives/locales, utiliser le lecteur natif
      const isExternalHttp = doc.fileUrl?.startsWith('http://') || doc.fileUrl?.startsWith('https://');
      // Pour les appareils mobiles, Google Docs Viewer est parfois plus stable sur les URL distantes
      if (isExternalHttp && typeof window !== 'undefined' && window.innerWidth < 768) {
        setUseGoogleViewer(true);
      } else {
        setUseGoogleViewer(false);
      }
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const rawUrl = doc.fileUrl || '#';
  const isHttpUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');

  // Déterminer l'URL source de la visionneuse
  let viewerSrc = rawUrl;
  if (useGoogleViewer && isHttpUrl) {
    viewerSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`;
  } else if (!rawUrl.includes('#')) {
    // Activer la barre d'outils et le zoom dans le lecteur natif du navigateur
    viewerSrc = `${rawUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl h-[94vh] sm:h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BARRE D'EN-TÊTE DE LA VISIONNEUSE */}
        <header className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between gap-4 shrink-0 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
            </span>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0B3827] border border-emerald-100 text-[11px] font-semibold">
                  {doc.categoryLabel || 'Rapport officiel'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  {doc.fileFormat || 'PDF'} • {doc.fileSize || 'Standard'}
                </span>
              </div>
              <h2
                id="pdf-viewer-title"
                className="text-sm sm:text-base font-bold text-[#0B3827] truncate leading-tight"
                title={doc.title}
              >
                {doc.title}
              </h2>
            </div>
          </div>

          {/* ACTIONS & CONTRÔLES */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Bouton bascule de lecteur (Lecteur direct / Google Docs) pour les URL distantes */}
            {isHttpUrl && (
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setUseGoogleViewer(!useGoogleViewer);
                }}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                title="Changer de moteur d'affichage si le document ne s'affiche pas"
              >
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                <span>{useGoogleViewer ? 'Lecteur Standard' : 'Mode Alternatif'}</span>
              </button>
            )}

            {/* Plein écran dans un nouvel onglet */}
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="Ouvrir en plein écran dans un nouvel onglet"
            >
              <span className="material-symbols-outlined text-[17px]">open_in_new</span>
              <span className="hidden md:inline">Plein écran</span>
            </a>

            {/* Bouton de téléchargement */}
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#138A2E] hover:bg-[#0F7326] transition-colors shadow-xs"
              title="Télécharger le fichier PDF sur votre appareil"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span className="hidden sm:inline">Télécharger</span>
            </a>

            {/* Bouton Fermer */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center transition-colors border border-slate-200 ml-1"
              aria-label="Fermer la visionneuse"
              title="Fermer (Échap)"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </header>

        {/* CADRE D'AFFICHAGE DU PDF */}
        <div className="flex-1 w-full bg-slate-100 relative overflow-hidden flex flex-col">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 gap-3">
              <div className="w-10 h-10 border-3 border-emerald-600/30 border-t-[#0B3827] rounded-full animate-spin" />
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Chargement du document officiel en cours...
              </p>
            </div>
          )}

          <iframe
            src={viewerSrc}
            title={doc.title}
            className="w-full h-full flex-1 border-0"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            allow="fullscreen"
          />

          {/* Bandeau d'aide inférieur */}
          <footer className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
            <span className="truncate">
              Document officiel certifié du Mouvement Ivoirien des Droits Humains (MIDH) • Reproduction autorisée avec citation de la source.
            </span>
            <span className="text-[11px] text-slate-400 shrink-0">
              Raccourci : touche <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono">Échap</kbd> pour quitter
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
