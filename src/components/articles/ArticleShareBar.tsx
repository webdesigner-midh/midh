'use client';

import React, { useState } from 'react';

interface ArticleShareBarProps {
  title: string;
  slug: string;
  featuredImage?: string;
  excerpt?: string;
  views?: number;
  variant?: 'compact' | 'full';
}

export default function ArticleShareBar({
  title,
  slug,
  featuredImage,
  excerpt,
  views,
  variant = 'full',
}: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);

  // Raccourcissement intelligent du titre pour les partages sociaux
  const cleanTitle = title.trim();
  const shortTitle =
    cleanTitle.length > 70 ? `${cleanTitle.slice(0, 68).trim()}…` : cleanTitle;

  // Résolution de l'URL absolue de l'article
  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://midh-ci.org';
  const pageUrl = `${siteUrl.replace(/\/$/, '')}/actualites/${slug}`;

  // Liens de partage officiels
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `📢 *${shortTitle}*\n\nDécouvrez cette publication officielle du MIDH :\n${pageUrl}`
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      pageUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      pageUrl
    )}&text=${encodeURIComponent(shortTitle)}&via=midh_ci`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      pageUrl
    )}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback si l'accès presse-papier est restreint
      const input = document.createElement('input');
      input.value = pageUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shortTitle,
          text: excerpt || shortTitle,
          url: pageUrl,
        });
      } catch {
        // Annulation ou non supporté
      }
    } else {
      handleCopyLink();
    }
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
          Partager :
        </span>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all text-xs font-bold shadow-xs active:scale-95"
          title="Partager sur WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.146-.532-1.854-.772-3.033-2.656-3.125-2.777-.093-.122-.748-.995-.748-1.897 0-.903.473-1.344.642-1.528.169-.184.37-.23.493-.23.123 0 .247.002.355.007.113.006.264-.043.413.315.153.368.525 1.278.57 1.37.046.092.077.2.015.323-.061.123-.092.2-.184.307-.092.107-.194.24-.277.322-.092.093-.189.194-.081.38.107.185.477.787 1.025 1.275.706.629 1.302.823 1.487.915.185.093.293.078.401-.047.108-.123.462-.538.585-.723.123-.184.246-.153.414-.092.169.062 1.076.507 1.261.599.184.092.307.138.353.215.046.077.046.446-.098.851zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.628 0-3.14-.477-4.417-1.298l-.317-.204-2.966.778.791-2.893-.223-.356A7.954 7.954 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all text-xs font-bold shadow-xs active:scale-95"
          title="Partager sur Facebook"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </a>

        {/* Copier le lien */}
        <button
          onClick={handleCopyLink}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-primary hover:text-white transition-all text-xs font-bold shadow-xs active:scale-95 text-on-surface"
          title="Copier le lien de l'article"
        >
          <span className="material-symbols-outlined text-[16px]">
            {copied ? 'check' : 'link'}
          </span>
          <span>{copied ? 'Lien copié !' : 'Copier'}</span>
        </button>
      </div>
    );
  }

  // Version complète avec aperçu visuel (Image mise en avant + Titre court + Boutons)
  return (
    <div className="w-full my-8 bg-gradient-to-br from-[#f8fbf8] to-[#edf4ee] rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Aperçu visuel de l'article à partager */}
        <div className="flex items-center gap-4 min-w-0">
          {featuredImage ? (
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-container shrink-0 shadow-sm border border-outline-variant/30">
              <img
                src={featuredImage}
                alt={shortTitle}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center shrink-0 border border-primary/20">
              <span className="material-symbols-outlined text-[28px]">article</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">MIDH</span>
            </div>
          )}

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                Plaidoyer officiel
              </span>
              {typeof views === 'number' && (
                <span className="text-[11px] font-semibold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-primary">
                    visibility
                  </span>
                  <span>{views.toLocaleString('fr-FR')} vues</span>
                </span>
              )}
            </div>
            <h4 className="font-title-md text-base sm:text-lg font-bold text-[#0B3827] line-clamp-2 leading-snug">
              {shortTitle}
            </h4>
            <span className="text-xs text-secondary font-medium truncate">
              {siteUrl.replace(/^https?:\/\//, '')}/actualites/{slug}
            </span>
          </div>
        </div>

        {/* Boutons de partage officiels */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#1ebd5b] transition-all text-xs font-bold shadow-sm active:scale-95"
            title="Partager sur WhatsApp"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.146-.532-1.854-.772-3.033-2.656-3.125-2.777-.093-.122-.748-.995-.748-1.897 0-.903.473-1.344.642-1.528.169-.184.37-.23.493-.23.123 0 .247.002.355.007.113.006.264-.043.413.315.153.368.525 1.278.57 1.37.046.092.077.2.015.323-.061.123-.092.2-.184.307-.092.107-.194.24-.277.322-.092.093-.189.194-.081.38.107.185.477.787 1.025 1.275.706.629 1.302.823 1.487.915.185.093.293.078.401-.047.108-.123.462-.538.585-.723.123-.184.246-.153.414-.092.169.062 1.076.507 1.261.599.184.092.307.138.353.215.046.077.046.446-.098.851zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.628 0-3.14-.477-4.417-1.298l-.317-.204-2.966.778.791-2.893-.223-.356A7.954 7.954 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1877F2] text-white hover:bg-[#166fe5] transition-all text-xs font-bold shadow-sm active:scale-95"
            title="Partager sur Facebook"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </a>

          {/* X (Twitter) */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#000000] text-white hover:bg-[#222222] transition-all text-xs font-bold shadow-sm active:scale-95"
            title="Partager sur X (Twitter)"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>X</span>
          </a>

          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0A66C2] text-white hover:bg-[#095196] transition-all text-xs font-bold shadow-sm active:scale-95"
            title="Partager sur LinkedIn"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </a>

          {/* Copier le lien / Partage natif */}
          <button
            onClick={handleNativeShare}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white text-[#0B3827] border border-outline-variant/60 hover:bg-surface-container transition-all text-xs font-bold shadow-xs active:scale-95"
            title="Copier le lien"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              {copied ? 'check_circle' : 'link'}
            </span>
            <span>{copied ? 'Copié !' : 'Copier le lien'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
