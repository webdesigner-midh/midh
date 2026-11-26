import type { Metadata } from 'next';
import { getArticles } from '@/services/wordpress';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Actualités & Communiqués officiels | MIDH',
  description: 'Toutes les actualités, déclarations publiques et communiqués de presse du Mouvement Ivoirien des Droits Humains.',
};

export const revalidate = 30; // Revalidation ISR toutes les 30s pour réactivité éditoriale

export default async function ActualitesPage() {
  const articles = await getArticles();

  return (
    <div className="w-full bg-[#f6faf5] min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20">
      <div className="site-container flex flex-col gap-6 sm:gap-10">
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 font-caption text-caption text-secondary">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">home</span>
            <span>Accueil</span>
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-semibold">Actualités &amp; Communiqués</span>
        </nav>

        {/* En-tête de la page */}
        <div className="max-w-3xl flex flex-col gap-2 sm:gap-3">
          <span className="font-label-lg text-label-lg text-primary uppercase tracking-wider font-bold">
            Veille &amp; Presse
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0B3827] font-extrabold leading-tight break-words">
            Actualités, Déclarations &amp; Communiqués
          </h1>
          <p className="font-body-lg text-sm sm:text-base md:text-lg text-on-surface-variant leading-relaxed">
            Consultez les prises de position publiques, les analyses juridiques et les communiqués de presse officiels émis par le MIDH pour la promotion et la protection des droits humains.
          </p>
        </div>

        {/* Grille des publications avec Image à la Une */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-2xl overflow-hidden border border-outline-variant/40 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  {/* Zone Image Mise en Avant (16:9) */}
                  <div className="relative aspect-[16/9] w-full bg-surface-container overflow-hidden">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-primary/40 bg-gradient-to-br from-[#f0f5f0] to-[#e5e9e4]">
                        <span className="material-symbols-outlined text-[44px] mb-1">image</span>
                        <span className="font-caption text-caption text-secondary font-medium">
                          Photo officielle MIDH
                        </span>
                      </div>
                    )}

                    {/* Badge de catégorie flottant sur l'image */}
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {article.categoryLabel}
                    </span>
                  </div>

                  {/* Contenu textuel */}
                  <div className="p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-secondary font-medium">
                      <span className="material-symbols-outlined text-[15px]">calendar_today</span>
                      <span>{article.formattedDate}</span>
                    </div>

                    <h2 className="font-title-lg text-xl text-[#0B3827] font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/actualites/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Pied de carte */}
                <div className="p-5 bg-surface-container-low/70 border-t border-outline-variant/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-caption text-caption text-secondary font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">person</span>
                      <span>{article.author || 'MIDH'}</span>
                    </span>
                    {typeof article.views === 'number' && (
                      <span
                        className="font-caption text-caption text-secondary font-medium flex items-center gap-1 bg-surface-container-high/60 px-2 py-0.5 rounded-full text-xs"
                        title={`${article.views} consultations`}
                      >
                        <span className="material-symbols-outlined text-[13px] text-primary">visibility</span>
                        <span>{article.views}</span>
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/actualites/${article.slug}`}
                    className="inline-flex items-center gap-1.5 font-label-md text-sm text-primary group-hover:gap-2.5 font-bold transition-all"
                  >
                    <span>Lire l&apos;article</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="w-full bg-white rounded-2xl p-8 sm:p-14 text-center border border-outline-variant/40 flex flex-col items-center justify-center gap-3 shadow-xs">
            <span className="material-symbols-outlined text-[52px] text-primary/40">newspaper</span>
            <h2 className="font-headline-sm text-xl sm:text-2xl font-bold text-[#0B3827]">
              Aucune publication pour le moment
            </h2>
            <p className="font-body-md text-secondary max-w-lg leading-relaxed">
              Les déclarations officielles, communiqués de presse et rapports d&apos;enquête du MIDH apparaîtront ici dès leur publication depuis le Newsroom Studio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
