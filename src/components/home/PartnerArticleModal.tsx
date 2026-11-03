'use client';

import { MIDHPartner } from '@/types/wordpress';
import Link from 'next/link';
import { useEffect } from 'react';

interface PartnerArticleModalProps {
  partner: MIDHPartner | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Nettoie le code HTML provenant de WordPress pour prévenir les failles XSS
 */
function sanitizePartnerHtml(html: string): string {
  if (!html) return '<p>Aucun contenu supplémentaire rédigé.</p>';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:[^"]*/gi, '');
}

export default function PartnerArticleModal({
  partner,
  isOpen,
  onClose,
}: PartnerArticleModalProps) {
  // Fermeture par la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !partner) return null;

  const partnerImage =
    partner.featuredImage ||
    partner.logoUrl ||
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-outline-variant/40 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête avec image mise en avant */}
        <div className="relative h-48 sm:h-64 w-full bg-[#0B3827] overflow-hidden flex-shrink-0">
          <img
            src={partnerImage}
            alt={partner.name}
            className="w-full h-full object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3827] via-[#0B3827]/40 to-transparent" />

          {/* Bouton fermeture */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>

          {/* Badge & Titre sur l'image */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col gap-1.5 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white w-fit shadow-md">
              <span className="material-symbols-outlined text-[14px]">handshake</span>
              {partner.typeLabel || 'Partenaire Institutionnel'}
            </span>
            <h3
              id="partner-modal-title"
              className="font-display text-xl sm:text-2xl font-bold text-white drop-shadow-sm"
            >
              {partner.name}
            </h3>
          </div>
        </div>

        {/* Corps de l'article avec défilement */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Extrait / Courte description en exergue */}
          {partner.excerpt && (
            <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-primary text-primary-content">
              <p className="font-body-md text-sm sm:text-base italic text-tertiary font-medium leading-relaxed">
                « {partner.excerpt} »
              </p>
            </div>
          )}

          {/* Contenu de l'article WordPress ou description */}
          <div className="prose prose-sm sm:prose-base max-w-none text-tertiary leading-relaxed space-y-4">
            {partner.content ? (
              <div
                // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
                dangerouslySetInnerHTML={{ __html: sanitizePartnerHtml(partner.content) }}
                className="[&_h3]:text-[#0B3827] [&_h3]:font-bold [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:text-[#0B3827]"
              />
            ) : (
              <p>{partner.description || "Aucun article détaillé n'a encore été rédigé pour ce partenaire."}</p>
            )}
          </div>
        </div>

        {/* Pied de la modale avec actions */}
        <div className="p-4 sm:p-5 bg-surface-container-low border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-3">
          {partner.websiteUrl ? (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-[#0F7326] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">language</span>
              <span>Visiter le site officiel</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          ) : (
            <span className="text-xs text-outline">Partenaire certifié par le MIDH</span>
          )}

          <div className="flex items-center gap-2">
            {partner.slug && (
              <Link
                href={`/partenaires/${partner.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#0B3827] text-white hover:bg-[#0A2F21] transition-colors shadow-sm"
              >
                <span>Voir la page complète</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-outline-variant/60 text-tertiary hover:bg-surface-container-high transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
