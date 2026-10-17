import {
  FALLBACK_ARTICLES,
  FALLBACK_DOCUMENTS,
  FALLBACK_HERO_SLIDES,
  FALLBACK_PARTNERS,
  FALLBACK_PROJECTS,
  FALLBACK_TEAM,
  OFFICIAL_DOMAINS,
  OFFICIAL_SECTIONS,
  OFFICIAL_SITE_OPTIONS,
} from '@/data/fallbackData';
import {
  MIDHArticle,
  MIDHDocument,
  MIDHDomainInfo,
  MIDHPartner,
  MIDHProject,
  MIDHSection,
  MIDHSiteOptions,
  MIDHTeamMember,
  MIDHHeroSlide,
  PublicationCategory,
} from '@/types/wordpress';

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';

/**
 * Effectue un appel sécurisé vers l'API REST WordPress avec timeout et gestion gracieuse d'erreur
 */
async function fetchWordPressAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  if (!WORDPRESS_URL) {
    return null;
  }

  // Nettoyage de l'URL de base pour supporter aussi bien https://cms.midh-ci.org que https://cms.midh-ci.org/wp-json
  const cleanBase = WORDPRESS_URL.replace(/\/+$/, '').replace(/\/wp-json\/?$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBase}${cleanEndpoint}`;

  const isDev = process.env.NODE_ENV === 'development';
  // En dev : pas de cache pour synchronisation instantanée dès publication dans WordPress
  // En prod : ISR 30s et webhook de revalidation à la demande
  const cacheConfig = isDev
    ? { cache: 'no-store' as const }
    : {
        next: {
          revalidate: 30,
          tags: ['wordpress'],
        },
      };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      ...cacheConfig,
      headers: {
        'Accept': 'application/json',
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[WordPress API] Erreur HTTP ${res.status} sur ${endpoint}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.warn('[WordPress API] Impossible de joindre endpoint:', endpoint, (error as Error).message);
    return null;
  }
}

/**
 * Récupère les options globales et coordonnées du MIDH
 */
export async function getSiteOptions(): Promise<MIDHSiteOptions> {
  const wpOptions = await fetchWordPressAPI<Partial<MIDHSiteOptions>>('/wp-json/midh/v1/options');
  if (wpOptions && wpOptions.organizationName) {
    return {
      ...OFFICIAL_SITE_OPTIONS,
      ...wpOptions,
      socialLinks: {
        ...OFFICIAL_SITE_OPTIONS.socialLinks,
        ...(wpOptions.socialLinks || {}),
      },
      institutional: {
        ...OFFICIAL_SITE_OPTIONS.institutional,
        ...(wpOptions.institutional || {}),
      },
    };
  }
  return OFFICIAL_SITE_OPTIONS;
}

/**
 * Récupère les domaines d'intervention officiels
 */
export async function getInterventionDomains(): Promise<MIDHDomainInfo[]> {
  const wpDomains = await fetchWordPressAPI<MIDHDomainInfo[]>('/wp-json/midh/v1/domains');
  if (wpDomains && Array.isArray(wpDomains) && wpDomains.length > 0) {
    return wpDomains;
  }
  return OFFICIAL_DOMAINS;
}

/**
 * Récupère les projets et actions de terrain
 */
export async function getProjects(): Promise<MIDHProject[]> {
  const wpProjects = await fetchWordPressAPI<any[]>('/wp-json/wp/v2/midh_project?_embed&per_page=20');
  
  if (wpProjects && Array.isArray(wpProjects) && wpProjects.length > 0) {
    return wpProjects.map((item) => {
      const rawExcerpt = item.excerpt?.rendered || '';
      const rawContent = item.content?.rendered || '';
      const cleanExcerpt =
        rawExcerpt.replace(/<[^>]+>/g, '').trim() ||
        (rawContent.replace(/<[^>]+>/g, '').trim().slice(0, 200) + (rawContent.length > 200 ? '...' : '')) ||
        '';

      return {
        id: item.id,
        title: item.title?.rendered || 'Projet sans titre',
        slug: item.slug,
        excerpt: cleanExcerpt,
        content: rawContent,
        coverImage: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || item.meta?.cover_image,
        status: item.meta?.status || 'actif',
        statusLabel: item.meta?.status_label || 'Projet actif',
        domain: item.meta?.domain || 'bonne-gouvernance',
        period: item.meta?.period || '',
        location: item.meta?.location || '',
        order: item.menu_order || 0,
      };
    });
  }

  return FALLBACK_PROJECTS;
}

/**
 * Récupère un projet par son slug
 */
export async function getProjectBySlug(slug: string): Promise<MIDHProject | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * Récupère les actualités, communiqués et déclarations
 */
export async function getArticles(category?: PublicationCategory): Promise<MIDHArticle[]> {
  let endpoint = '/wp-json/wp/v2/posts?_embed&per_page=20';
  if (category && category !== 'tous') {
    // Si la catégorie est spécifiée, on tente de filtrer
    endpoint += `&category_slug=${encodeURIComponent(category)}`;
  }

  const wpPosts = await fetchWordPressAPI<any[]>(endpoint);

  if (wpPosts && Array.isArray(wpPosts) && wpPosts.length > 0) {
    const mapped = wpPosts.map((post) => {
      const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'actualites';
      const catName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Actualité';
      const dateObj = new Date(post.date);
      const formattedDate = dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      return {
        id: post.id,
        title: post.title?.rendered || 'Sans titre',
        slug: post.slug,
        excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
        content: post.content?.rendered || '',
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        date: post.date,
        formattedDate,
        author: post._embedded?.author?.[0]?.name || 'MIDH',
        category: (catSlug as PublicationCategory) || 'actualites',
        categoryLabel: catName,
        isFeatured: post.sticky || false,
      };
    });

    if (category && category !== 'tous') {
      return mapped.filter((a) => a.category === category);
    }
    return mapped;
  }

  if (category && category !== 'tous') {
    return FALLBACK_ARTICLES.filter((a) => a.category === category);
  }
  return FALLBACK_ARTICLES;
}

/**
 * Récupère un article par son slug
 */
export async function getArticleBySlug(slug: string): Promise<MIDHArticle | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) || null;
}

/**
 * Récupère les documents institutionnels et rapports PDF
 */
export async function getDocuments(): Promise<MIDHDocument[]> {
  // 1. Tente d'abord l'endpoint optimisé MIDH Core
  const customDocs = await fetchWordPressAPI<MIDHDocument[]>('/wp-json/midh/v1/documents');
  if (customDocs && Array.isArray(customDocs) && customDocs.length > 0) {
    return customDocs;
  }

  // 2. Tente l'endpoint REST standard WP CPT
  const wpDocs = await fetchWordPressAPI<any[]>('/wp-json/wp/v2/midh_document?_embed&per_page=50');
  if (wpDocs && Array.isArray(wpDocs) && wpDocs.length > 0) {
    return wpDocs.map((doc) => ({
      id: doc.id,
      title: doc.title?.rendered || 'Document',
      slug: doc.slug,
      excerpt: doc.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
      fileUrl: doc.meta?.file_url || '#',
      fileSize: doc.meta?.file_size || 'PDF',
      fileFormat: doc.meta?.file_format || 'PDF',
      category: doc.meta?.category || 'rapport_annuel',
      categoryLabel: doc.meta?.category_label || 'Rapport annuel',
      publicationDate: doc.meta?.publication_date || '',
    }));
  }

  return FALLBACK_DOCUMENTS;
}

/**
 * Récupère les membres de l'équipe et l'organigramme
 */
export async function getTeamMembers(): Promise<MIDHTeamMember[]> {
  const wpTeam = await fetchWordPressAPI<any[]>('/wp-json/wp/v2/midh_team?_embed&per_page=50');

  if (wpTeam && Array.isArray(wpTeam) && wpTeam.length > 0) {
    return wpTeam.map((m) => {
      // Résolution intelligente de la photo : meta photo_url, image mise en avant, ou balise img insérée
      let photoUrl = m.meta?.photo_url || m._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      if (!photoUrl && m.content?.rendered) {
        const match = m.content.rendered.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match) {
          photoUrl = match[1];
        }
      }

      const rawTitle = m.title?.rendered || 'Membre du MIDH';
      let role = m.meta?.role || '';
      if (!role) {
        if (/secr[eé]taire/i.test(rawTitle)) {
          role = 'Secrétaire Général';
        } else if (/pr[eé]sident/i.test(rawTitle)) {
          role = "Président du Conseil d'Administration";
        } else {
          role = 'Membre de la Direction';
        }
      }

      let biography = m.meta?.biography || '';
      if (!biography && m.content?.rendered) {
        biography = m.content.rendered.replace(/<[^>]+>/g, '').trim();
      }

      return {
        id: m.id,
        fullName: rawTitle,
        role,
        photoUrl: photoUrl || '',
        biography,
        email: m.meta?.email || '',
        linkedin: m.meta?.linkedin || '',
        twitter: m.meta?.twitter || '',
        order: m.menu_order || 0,
      };
    }).sort((a, b) => {
      const orderA = a.order > 0 ? a.order : 999;
      const orderB = b.order > 0 ? b.order : 999;
      return orderA - orderB;
    });
  }

  return FALLBACK_TEAM;
}

/**
 * Récupère les partenaires institutionnels
 */
export async function getPartners(): Promise<MIDHPartner[]> {
  const wpPartners = await fetchWordPressAPI<any[]>('/wp-json/wp/v2/midh_partner?_embed&per_page=20');

  if (wpPartners && Array.isArray(wpPartners) && wpPartners.length > 0) {
    return wpPartners.map((p) => ({
      id: p.id,
      name: p.title?.rendered || 'Partenaire',
      logoUrl: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.meta?.logo_url,
      type: p.meta?.type || 'technique',
      typeLabel: p.meta?.type_label || 'Partenaire',
      websiteUrl: p.meta?.website_url,
      description: p.content?.rendered?.replace(/<[^>]+>/g, '') || p.meta?.description,
    }));
  }

  return FALLBACK_PARTNERS;
}

/**
 * Récupère les sections et sous-sections régionales
 */
export async function getSections(): Promise<MIDHSection[]> {
  const wpSections = await fetchWordPressAPI<MIDHSection[]>('/wp-json/midh/v1/sections');
  if (wpSections && Array.isArray(wpSections) && wpSections.length > 0) {
    return wpSections;
  }
  return OFFICIAL_SECTIONS;
}

/**
 * Récupère les diapositives dynamiques du Carrousel d'Accueil
 */
export async function getHeroSlides(): Promise<MIDHHeroSlide[]> {
  const wpSlides = await fetchWordPressAPI<MIDHHeroSlide[]>('/wp-json/midh/v1/slides');
  if (wpSlides && Array.isArray(wpSlides) && wpSlides.length > 0) {
    const valid = wpSlides.filter((s) => s.title && s.image);
    if (valid.length > 0) {
      return valid;
    }
  }
  return FALLBACK_HERO_SLIDES;
}
