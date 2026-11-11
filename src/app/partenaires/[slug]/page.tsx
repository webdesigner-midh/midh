import type { Metadata } from 'next';
import { getPartnerBySlug, getPartners } from '@/services/wordpress';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sanitizeRichHtml } from '@/lib/sanitize';

interface PartnerPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Nettoie le code HTML provenant de WordPress pour prévenir les injections XSS
 */
function sanitizePartnerHtml(html: string): string {
  if (!html) return '<p>Aucun contenu supplémentaire rédigé.</p>';
  return sanitizeRichHtml(html);
}

export async function generateMetadata({ params }: PartnerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);

  if (!partner) {
    return {
      title: 'Partenaire introuvable | MIDH',
    };
  }

  return {
    title: `${partner.name} — Partenaires Institutionnels | MIDH`,
    description: partner.excerpt || partner.description || 'Partenaire officiel du Mouvement Ivoirien des Droits Humains.',
    openGraph: {
      title: `${partner.name} — MIDH`,
      description: partner.excerpt || partner.description,
      type: 'article',
      images: partner.featuredImage ? [{ url: partner.featuredImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  const partners = await getPartners();
  return partners.map((partner) => ({
    slug: partner.slug || String(partner.id),
  }));
}

export default async function PartnerDetailPage({ params }: PartnerPageProps) {
  const { slug } = await params;
  const [partner, allPartners] = await Promise.all([
    getPartnerBySlug(slug),
    getPartners(),
  ]);

  if (!partner) {
    notFound();
  }

  const otherPartners = allPartners.filter((p) => p.slug !== partner.slug && p.id !== partner.id).slice(0, 3);
  const featuredImg = partner.featuredImage || partner.logoUrl || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80';

  return (
    <article className="min-h-screen bg-background">
      {/* 1. HERO HEADER DU PARTENAIRE */}
      <section className="relative w-full bg-[#0B3827] text-white pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-white/10">
        <div className="site-container">
          {/* Fil d'Ariane */}
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-surface-variant font-medium flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Accueil</span>
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li>
                <Link href="/#partenaires" className="hover:text-white transition-colors">
                  Partenaires
                </Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white font-semibold truncate max-w-[200px] sm:max-w-md">
                {partner.name}
              </li>
            </ol>
          </nav>

          {/* En-tête */}
          <div className="max-w-3xl flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">handshake</span>
                {partner.typeLabel || 'Partenaire Institutionnel'}
              </span>
              <span className="text-xs text-white/70">Coopération Officielle MIDH</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {partner.name}
            </h1>

            {partner.excerpt && (
              <p className="font-body-lg text-base sm:text-lg text-surface-variant/90 leading-relaxed max-w-2xl">
                {partner.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. CONTENU PRINCIPAL & COLONNE LATÉRALE */}
      <section className="py-12 sm:py-16">
        <div className="site-container grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Article principal */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Image à la une */}
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-outline-variant/40 bg-surface-container">
              <img
                src={featuredImg}
                alt={partner.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Corps de l'article formaté */}
            <div
              className="prose prose-lg max-w-none text-tertiary leading-relaxed
                [&_h2]:text-[#0B3827] [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
                [&_h3]:text-[#0B3827] [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
                [&_p]:mb-4 [&_p]:text-base [&_p]:sm:text-lg [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
                [&_li]:text-tertiary
                [&_strong]:text-[#0B3827] [&_strong]:font-semibold"
              // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
              dangerouslySetInnerHTML={{ __html: sanitizePartnerHtml(partner.content || `<p>${partner.description || ''}</p>`) }}
            />

            {/* Lien retour */}
            <div className="pt-8 border-t border-outline-variant/30 flex items-center justify-between">
              <Link
                href="/#partenaires"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-[#0F7326] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Retour aux partenaires de l&apos;accueil</span>
              </Link>
            </div>
          </div>

          {/* Fiche récapitulative latérale */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/50 shadow-sm flex flex-col gap-4">
              <h3 className="font-display text-lg font-bold text-[#0B3827]">
                Informations Clés
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-outline uppercase font-semibold">Statut</span>
                  <p className="font-medium text-tertiary">{partner.typeLabel || 'Partenaire Institutionnel'}</p>
                </div>

                <div>
                  <span className="text-xs text-outline uppercase font-semibold">Organisation</span>
                  <p className="font-medium text-[#0B3827] font-semibold">{partner.name}</p>
                </div>

                {partner.websiteUrl && (
                  <div className="pt-2">
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-[#0F7326] transition-colors shadow-xs"
                    >
                      <span>Consulter le site officiel</span>
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Autres partenaires */}
            {otherPartners.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-outline-variant/50 shadow-sm flex flex-col gap-4">
                <h3 className="font-display text-base font-bold text-[#0B3827]">
                  Autres partenaires
                </h3>
                <div className="flex flex-col divide-y divide-outline-variant/30">
                  {otherPartners.map((item) => (
                    <Link
                      key={item.id}
                      href={`/partenaires/${item.slug}`}
                      className="py-3 flex items-center justify-between group"
                    >
                      <span className="text-sm font-medium text-tertiary group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </article>
  );
}
