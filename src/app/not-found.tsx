import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-space-xl sm:py-space-3xl px-4 sm:px-6">
      <div className="max-w-md text-center flex flex-col items-center gap-4 bg-surface-container-lowest p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm">
        <span className="w-16 h-16 rounded-2xl bg-secondary-container/50 text-primary flex items-center justify-center font-bold text-2xl">
          <span className="material-symbols-outlined text-[36px]">search_off</span>
        </span>
        <span className="font-display text-display text-[#0B3827] font-extrabold leading-none">
          404
        </span>
        <h1 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold">
          Page non trouvée
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Le document ou la page que vous recherchez n&apos;existe pas ou a été déplacé dans le cadre de la mise à jour institutionnelle.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] text-white font-label-lg px-6 py-3 rounded-xl transition-colors shadow-xs mt-2"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>
    </div>
  );
}
