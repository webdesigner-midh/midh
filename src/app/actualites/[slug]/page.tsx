import type { Metadata } from 'next';
import { getArticleBySlug, getArticles } from '@/services/wordpress';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Nettoie le code HTML provenant de WordPress pour prévenir les injections XSS
 */
function sanitizeArticleHtml(html: string): string {
  if (!html) return '<p>Aucun contenu supplémentaire rédigé.</p>';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:[^"]*/gi, '');
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article introuvable | MIDH',
    };
  }

  return {
    title: `${article.title} — Mouvement Ivoirien des Droits Humains (MIDH)`,
    description: article.excerpt || 'Article et publication officielle du MIDH.',
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
  ]);

  if (!article) {
    notFound();
  }

  // Articles suggérés / connexes (excluant l'article courant)
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 3);

  // Estimation du temps de lecture
  const wordCount = (article.content || '').replace(/<[^>]+>/g, '').split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="w-full bg-[#f6faf5] min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20">
      {/* 1. HERO INSTITUTIONNEL DE L'ARTICLE */}
      <section className="w-full bg-gradient-to-b from-surface-container-high/40 to-transparent border-b border-outline-variant/30 pt-6 sm:pt-8 pb-10 sm:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-4 sm:gap-6">
          {/* Fil d'Ariane épuré */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 font-caption text-caption text-secondary flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>Accueil</span>
            </Link>
            <span className="text-outline-variant">/</span>
            <Link href="/actualites" className="hover:text-primary transition-colors">
              Actualités &amp; Plaidoyers
            </Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-semibold truncate max-w-[200px] sm:max-w-md">
              {article.title}
            </span>
          </nav>

          {/* Badges & Métadonnées d'autorité */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-caption font-semibold">
            <span className="px-3 py-1 rounded-full bg-primary text-white font-bold tracking-wide uppercase shadow-xs text-xs">
              {article.categoryLabel || 'Actualité'}
            </span>
            <span className="flex items-center gap-1 text-secondary bg-surface-container-high/60 px-2.5 py-1 rounded-full text-xs">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              {article.formattedDate}
            </span>
            <span className="flex items-center gap-1 text-secondary bg-surface-container-high/60 px-2.5 py-1 rounded-full text-xs">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {readTime} min de lecture
            </span>
            <span className="flex items-center gap-1 text-secondary bg-surface-container-high/60 px-2.5 py-1 rounded-full text-xs">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              {article.author || 'MIDH'}
            </span>
          </div>

          {/* Grand Titre Éditorial */}
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B3827] leading-[1.18] tracking-tight break-words">
            {article.title}
          </h1>

          {/* Chapô / Excerpt si présent */}
          {article.excerpt && (
            <p className="font-body-lg text-base sm:text-lg md:text-xl text-on-surface-variant leading-relaxed font-medium border-l-4 border-primary pl-4 sm:pl-5 bg-white/70 py-3 rounded-r-xl shadow-xs">
              {article.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* 2. CONTENU PRINCIPAL + IMAGE MISE EN AVANT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mt-8 sm:mt-10">
        {/* Grande Image à la Une */}
        {article.featuredImage ? (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-outline-variant/40 mb-8 sm:mb-12 bg-surface-container">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64 rounded-2xl bg-gradient-to-br from-[#e8efe9] to-[#d6e4d7] flex flex-col items-center justify-center text-center p-6 mb-12 border border-outline-variant/30">
            <span className="material-symbols-outlined text-[48px] text-primary/60 mb-2">newspaper</span>
            <span className="font-label-md text-label-md uppercase tracking-wider font-bold text-[#0B3827]">
              Publication officielle MIDH
            </span>
            <span className="font-caption text-caption text-secondary mt-1">
              Mouvement Ivoirien des Droits Humains
            </span>
          </div>
        )}

        {/* Corps de l'article HTML rendu proprement et sécurisé */}
        <article
          className="article-body bg-white rounded-2xl p-6 sm:p-10 md:p-14 shadow-sm border border-outline-variant/40 text-[#181d1a]"
          // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
        />

        {/* 3. ENCADRÉ D'AUTORITÉ INSTITUTIONNELLE DU MIDH */}
        <div className="mt-12 bg-gradient-to-r from-[#004d15] to-[#006b1f] text-white p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <span className="font-label-md text-label-md uppercase tracking-wider text-[#bcead1] font-bold">
              À propos de cette publication
            </span>
            <h3 className="font-headline-sm text-xl font-bold">
              Une initiative du Mouvement Ivoirien des Droits Humains
            </h3>
            <p className="font-body-sm text-sm text-[#d8f5dc] max-w-xl leading-relaxed">
              Le MIDH agit au quotidien pour l&apos;assistance juridique aux victimes, la défense de l&apos;état de droit et l&apos;éducation civique en Côte d&apos;Ivoire.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#006b1f] hover:bg-[#bcead1] font-label-lg font-bold px-6 py-3 rounded-xl transition-all shadow-sm shrink-0 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            <span>Contacter le MIDH</span>
          </Link>
        </div>

        {/* 4. ACTIONS DE PARTAGE & NAVIGATION RETOUR */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-y border-outline-variant/40">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-primary hover:text-[#0F7326] font-label-lg font-bold transition-all group"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span>Retour à toutes les actualités</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-caption text-caption text-secondary font-semibold">Partager :</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-colors text-secondary"
              title="Partager sur WhatsApp"
            >
              <span className="material-symbols-outlined text-[18px] block">chat</span>
            </a>
            <a
              href="mailto:?subject=Article MIDH&body=Découvrez cet article du MIDH"
              className="p-2.5 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-colors text-secondary"
              title="Partager par Email"
            >
              <span className="material-symbols-outlined text-[18px] block">mail</span>
            </a>
          </div>
        </div>

        {/* 5. AUTRES PUBLICATIONS RECOMMANDÉES */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline-sm text-2xl font-bold text-[#0B3827]">
                À lire également
              </h2>
              <Link href="/actualites" className="text-primary hover:underline font-label-md text-sm font-semibold">
                Voir tout &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/actualites/${item.slug}`}
                  className="bg-white rounded-xl overflow-hidden border border-outline-variant/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="h-40 bg-surface-container relative overflow-hidden">
                    {item.featuredImage ? (
                      <img
                        src={item.featuredImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/40">
                        <span className="material-symbols-outlined text-[36px]">article</span>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow gap-3">
                    <span className="text-[12px] text-secondary font-medium">{item.formattedDate}</span>
                    <h3 className="font-title-md font-bold text-[#0B3827] group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="font-body-xs text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-primary text-xs font-bold pt-2 border-t border-surface-container">
                      Lire &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
