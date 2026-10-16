'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-space-xl sm:py-space-3xl px-4 sm:px-6">
      <div className="max-w-md text-center flex flex-col items-center gap-4 bg-surface-container-lowest p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm">
        <span className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
          <span className="material-symbols-outlined text-[36px]">error</span>
        </span>
        <h1 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold">
          Une erreur inattendue est survenue
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Le service a rencontré une difficulté momentanée. Veuillez rafraîchir la page ou réessayer ultérieurement.
        </p>
        <button
          onClick={() => reset()}
          type="button"
          className="inline-flex items-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] text-white font-label-lg px-6 py-3 rounded-xl transition-colors shadow-xs mt-2"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Réessayer</span>
        </button>
      </div>
    </div>
  );
}
