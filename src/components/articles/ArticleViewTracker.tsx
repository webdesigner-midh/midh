'use client';

import { useEffect, useState } from 'react';

interface ArticleViewTrackerProps {
  articleId: number | string;
  initialViews?: number;
  className?: string;
  showIcon?: boolean;
}

export default function ArticleViewTracker({
  articleId,
  initialViews = 0,
  className,
  showIcon = true,
}: ArticleViewTrackerProps) {
  const [views, setViews] = useState<number>(initialViews);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!articleId) return;

    const storageKey = `midh_viewed_art_${articleId}`;
    let isViewRecorded = false;

    try {
      isViewRecorded = Boolean(sessionStorage.getItem(storageKey));
    } catch {
      // Si sessionStorage n'est pas disponible (ex: navigation privée stricte)
      isViewRecorded = false;
    }

    if (!isViewRecorded) {
      try {
        sessionStorage.setItem(storageKey, 'true');
      } catch {
        // Ignorer les erreurs de quota de stockage
      }

      setIsUpdating(true);
      // Appel sécurisé pour incrémenter la vue
      fetch('/api/articles/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && typeof data.views === 'number') {
            setViews(data.views);
          } else {
            // Optimistic update
            setViews((prev) => prev + 1);
          }
        })
        .catch((err) => {
          console.warn('Impossible d\'enregistrer la vue de l\'article :', err);
        })
        .finally(() => {
          setIsUpdating(false);
        });
    } else {
      // Déjà comptabilisé dans cette session : interroger la valeur la plus fraîche
      fetch(`/api/articles/view?articleId=${articleId}`, {
        cache: 'no-store',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && typeof data.views === 'number') {
            setViews(data.views);
          }
        })
        .catch(() => {});
    }
  }, [articleId]);

  const defaultClasses =
    'flex items-center gap-1.5 text-secondary bg-surface-container-high/60 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300';

  return (
    <span
      className={`${className || defaultClasses} ${isUpdating ? 'animate-pulse text-primary font-bold' : ''}`}
      title={`${views} consultations`}
    >
      {showIcon && (
        <span className="material-symbols-outlined text-[14px] text-primary">
          visibility
        </span>
      )}
      <span className="tabular-nums">
        {views.toLocaleString('fr-FR')} {views > 1 ? 'vues' : 'vue'}
      </span>
    </span>
  );
}
