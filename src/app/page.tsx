import ActionCta from '@/components/home/ActionCta';
import EngagementPillars from '@/components/home/EngagementPillars';
import HeroCarousel from '@/components/home/HeroCarousel';
import KeyFigures from '@/components/home/KeyFigures';
import NewsAndReports from '@/components/home/NewsAndReports';
import NewsletterSection from '@/components/home/NewsletterSection';
import PartnersAndTeam from '@/components/home/PartnersAndTeam';
import ProjectsCarousel from '@/components/home/ProjectsCarousel';
import TerritorialMap from '@/components/home/TerritorialMap';
import {
  getArticles,
  getDocuments,
  getPartners,
  getProjects,
  getSections,
  getTeamMembers,
  getHeroSlides,
} from '@/services/wordpress';

export const revalidate = 60; // Revalidation ISR toutes les 60s

export default async function HomePage() {
  const [projects, articles, documents, sections, partners, team, slides] = await Promise.all([
    getProjects(),
    getArticles(),
    getDocuments(),
    getSections(),
    getPartners(),
    getTeamMembers(),
    getHeroSlides(),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* SECTION B — HERO PRINCIPAL AVEC CARROUSEL INTERACTIF */}
      <HeroCarousel initialSlides={slides} />

      {/* SECTION C — CHIFFRES CLÉS */}
      <KeyFigures />

      {/* SECTION D — NOTRE ENGAGEMENT (PROMOUVOIR, PROTÉGER, DÉFENDRE) */}
      <EngagementPillars />

      {/* SECTION F — NOS ACTIONS SUR LE TERRAIN (PROJETS DU MIDH) */}
      <ProjectsCarousel projects={projects} />

      {/* SECTION G — ACTUALITÉS ET PUBLICATIONS (AVEC RAPPORTS & DÉCLARATIONS) */}
      <NewsAndReports initialArticles={articles} documents={documents} />

      {/* SECTION H — IMPLANTATION TERRITORIALE (SECTIONS & CARTE DE CÔTE D'IVOIRE) */}
      <TerritorialMap sections={sections} />

      {/* SECTION I — PARTENAIRES INSTITUTIONNELS & ÉQUIPE */}
      <PartnersAndTeam partners={partners} team={team} />

      {/* SECTION J — APPEL À L'ENGAGEMENT (HERO CTA PROFOND #0B3827) */}
      <ActionCta />

      {/* SECTION K — NEWSLETTER INSTITUTIONNELLE */}
      <NewsletterSection />
    </div>
  );
}
