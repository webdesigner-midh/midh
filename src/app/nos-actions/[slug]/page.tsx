import type { Metadata } from 'next';
import { getProjectBySlug, getProjects } from '@/services/wordpress';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Nettoie le code HTML provenant de WordPress pour prévenir les injections XSS
 */
function sanitizeProjectHtml(html: string): string {
  if (!html) return '<p>Présentation détaillée en cours de rédaction par l\'équipe du MIDH.</p>';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:[^"]*/gi, '');
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Projet introuvable | MIDH',
    };
  }

  return {
    title: `${project.title} — Actions & Projets | MIDH`,
    description: project.excerpt || 'Programme d\'action et projet de terrain du MIDH.',
    openGraph: {
      title: project.title,
      description: project.excerpt,
      type: 'article',
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const otherProjects = allProjects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <article className="w-full bg-background min-h-screen py-space-lg sm:py-space-xl">
      <div className="site-container flex flex-col gap-space-lg sm:gap-space-xl">
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs sm:text-sm text-tertiary">
          <Link href="/" className="hover:text-primary transition-colors">
            Accueil
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/nos-actions" className="hover:text-primary transition-colors">
            Nos actions &amp; Projets
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#0B3827] font-medium truncate max-w-[200px] sm:max-w-md">
            {project.title}
          </span>
        </nav>

        {/* En-tête du projet */}
        <header className="flex flex-col gap-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-secondary-container/70 text-secondary font-label-md text-xs sm:text-sm font-bold uppercase tracking-wider">
              {project.statusLabel}
            </span>
            {project.period && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-container-high text-on-surface-variant font-label-md text-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                <span>{project.period}</span>
              </span>
            )}
            {project.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surface-container-high text-on-surface-variant font-label-md text-xs">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <span>{project.location}</span>
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-[#0B3827] font-extrabold leading-[1.18] tracking-tight">
            {project.title}
          </h1>

          {project.excerpt && (
            <p className="font-body-lg text-base sm:text-lg text-on-surface-variant leading-relaxed font-normal">
              {project.excerpt}
            </p>
          )}
        </header>

        {/* Image de couverture si disponible */}
        {project.coverImage && (
          <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md max-h-[460px] bg-surface-container-high">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover object-center max-h-[460px]"
            />
          </div>
        )}

        {/* Corps principal : 2 colonnes (Contenu riche + Panneau d'action) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Colonne principale (8 colonnes) */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-xs flex flex-col gap-6">
            <h2 className="font-headline-sm text-lg sm:text-xl text-[#0B3827] font-bold border-b border-surface-container pb-3">
              Présentation et objectifs du projet
            </h2>

            <div
              className="article-body"
              // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
              dangerouslySetInnerHTML={{ __html: sanitizeProjectHtml(project.content || project.excerpt) }}
            />
          </div>

          {/* Colonne latérale : Fiche technique et Actions (4 colonnes) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Fiche technique */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col gap-4">
              <h3 className="font-title-lg text-base sm:text-lg text-[#0B3827] font-bold pb-2 border-b border-surface-container">
                Fiche de cadrage
              </h3>

              <div className="flex flex-col gap-3.5 text-sm">
                <div>
                  <span className="block text-caption text-tertiary uppercase tracking-wider font-semibold">
                    Statut du programme
                  </span>
                  <span className="font-medium text-on-surface">
                    {project.statusLabel}
                  </span>
                </div>

                {project.period && (
                  <div>
                    <span className="block text-caption text-tertiary uppercase tracking-wider font-semibold">
                      Durée d&apos;exécution
                    </span>
                    <span className="font-medium text-on-surface">
                      {project.period}
                    </span>
                  </div>
                )}

                {project.location && (
                  <div>
                    <span className="block text-caption text-tertiary uppercase tracking-wider font-semibold">
                      Territoires d&apos;intervention
                    </span>
                    <span className="font-medium text-on-surface">
                      {project.location}
                    </span>
                  </div>
                )}

                <div>
                  <span className="block text-caption text-tertiary uppercase tracking-wider font-semibold">
                    Organisation porteuse
                  </span>
                  <span className="font-medium text-on-surface">
                    Mouvement Ivoirien des Droits Humains (MIDH)
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Soutien & Engagement */}
            <div className="bg-[#0B3827] text-white p-6 sm:p-8 rounded-2xl flex flex-col gap-4 shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[32px]">
                volunteer_activism
              </span>
              <h3 className="font-title-lg text-lg font-bold text-white leading-snug">
                Participer à la réussite de cette action
              </h3>
              <p className="font-body-sm text-xs sm:text-sm text-surface-variant leading-relaxed">
                Votre soutien financier ou votre engagement bénévole permet à nos équipes d&apos;agir directement auprès des communautés.
              </p>
              <div className="flex flex-col gap-2.5 pt-2">
                <Link
                  href="/don"
                  className="w-full text-center py-3 px-4 rounded-xl bg-[#138A2E] hover:bg-[#0F7326] text-white font-label-lg text-sm font-semibold transition-all shadow-xs"
                >
                  Faire un don pour ce projet
                </Link>
                <Link
                  href="/benevolat"
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-label-md text-xs font-medium transition-colors"
                >
                  Devenir bénévole de terrain
                </Link>
                <Link
                  href="/contact"
                  className="w-full text-center py-2 px-4 rounded-xl text-surface-variant hover:text-white font-label-md text-xs transition-colors"
                >
                  Proposer un partenariat institutionnel
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Autres projets */}
        {otherProjects.length > 0 && (
          <section className="pt-space-xl border-t border-surface-container flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-xl text-[#0B3827] font-bold">
                Découvrir d&apos;autres actions du MIDH
              </h2>
              <Link
                href="/nos-actions"
                className="text-primary hover:underline font-label-md text-sm font-semibold inline-flex items-center gap-1"
              >
                <span>Tous nos projets</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between gap-4 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-secondary-container/60 text-secondary font-label-md text-xs w-fit font-semibold">
                      {p.statusLabel}
                    </span>
                    <h3 className="font-title-lg text-lg text-[#0B3827] font-bold">
                      {p.title}
                    </h3>
                    <p className="font-body-sm text-sm text-on-surface-variant line-clamp-2">
                      {p.excerpt}
                    </p>
                  </div>
                  <Link
                    href={`/nos-actions/${p.slug}`}
                    className="text-primary hover:text-[#0F7326] font-label-md text-sm font-bold inline-flex items-center gap-1 pt-2 border-t border-surface-container"
                  >
                    <span>Consulter ce projet</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
