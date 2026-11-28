import {
  OFFICIAL_DOMAINS,
  OFFICIAL_SECTIONS,
  OFFICIAL_SITE_OPTIONS,
} from '@/data/fallbackData';
import {
  GalleryPhoto,
  GalleryVideo,
} from '@/data/galleryData';
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

interface WPRestRecord {
  id: number;
  slug: string;
  date?: string;
  sticky?: boolean;
  menu_order?: number;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  meta?: Record<string, string | undefined>;
  views?: number | string;
  _embedded?: {
    author?: Array<{ name?: string }>;
    'wp:featuredmedia'?: Array<{ source_url?: string }>;
    'wp:term'?: Array<Array<{ slug?: string; name?: string }>>;
  };
}

function getWordPressBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  if (envUrl && !envUrl.includes('.local')) {
    return envUrl;
  }
  // En production ou par défaut si non configuré / si ancienne valeur .local
  return 'https://cms.midh-ci.org';
}

const WORDPRESS_URL = getWordPressBaseUrl();

function decodeHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/&rsquo;/g, "’")
    .replace(/&#8217;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, '…');
}

function sanitizeUrl(url?: string): string {
  if (!url) return '';
  return url
    .replace(/http:\/\/midh-cms\.local/g, 'https://cms.midh-ci.org')
    .replace(/\\+$/, '');
}

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
  const separator = cleanEndpoint.includes('?') ? '&' : '?';
  // Cache buster pour contourner le cache Nginx/Varnish agressif de l'hébergeur LWS
  const url = `${cleanBase}${cleanEndpoint}${separator}_t=${Date.now()}`;

  // Bypass complet du cache de fetch pour interroger en direct le CMS WordPress (l'ISR gère le cache au niveau page)
  const cacheConfig = { cache: 'no-store' as const };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout pour hébergement mutualisé LWS

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      ...cacheConfig,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
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
  const wpProjects = await fetchWordPressAPI<WPRestRecord[]>('/wp-json/wp/v2/midh_project?_embed&per_page=20');
  
  if (wpProjects && Array.isArray(wpProjects)) {
    return wpProjects.map((item) => {
      const rawExcerpt = item.excerpt?.rendered || '';
      const rawContent = item.content?.rendered || '';
      const cleanExcerpt =
        rawExcerpt.replace(/<[^>]+>/g, '').trim() ||
        (rawContent.replace(/<[^>]+>/g, '').trim().slice(0, 200) + (rawContent.length > 200 ? '...' : '')) ||
        '';

      return {
        id: item.id,
        title: decodeHtml(item.title?.rendered || 'Projet sans titre'),
        slug: item.slug,
        excerpt: cleanExcerpt,
        content: rawContent,
        coverImage: sanitizeUrl(item._embedded?.['wp:featuredmedia']?.[0]?.source_url || item.meta?.cover_image),
        status: (item.meta?.status as MIDHProject['status']) || 'actif',
        statusLabel: item.meta?.status_label || 'Projet actif',
        domain: item.meta?.domain || 'bonne-gouvernance',
        period: item.meta?.period || '',
        location: item.meta?.location || '',
        order: item.menu_order || 0,
      };
    });
  }

  return [];
}

/**
 * Récupère un projet par son slug
 */
export async function getProjectBySlug(slug: string): Promise<MIDHProject | null> {
  const projects = await getProjects();
  const found = projects.find((p) => p.slug === slug);
  if (found) {
    return found;
  }

  // Si pas encore présent dans la liste paginée, interroger directement l'API WordPress par slug
  const wpProjects = await fetchWordPressAPI<WPRestRecord[]>(
    `/wp-json/wp/v2/midh_project?slug=${encodeURIComponent(slug)}&_embed`
  );
  if (wpProjects && Array.isArray(wpProjects) && wpProjects.length > 0) {
    const item = wpProjects[0];
    const rawExcerpt = item.excerpt?.rendered || '';
    const rawContent = item.content?.rendered || '';
    const cleanExcerpt =
      rawExcerpt.replace(/<[^>]+>/g, '').trim() ||
      (rawContent.replace(/<[^>]+>/g, '').trim().slice(0, 200) + (rawContent.length > 200 ? '...' : '')) ||
      '';

    return {
      id: item.id,
      title: decodeHtml(item.title?.rendered || 'Projet sans titre'),
      slug: item.slug,
      excerpt: cleanExcerpt,
      content: rawContent,
      coverImage: sanitizeUrl(item._embedded?.['wp:featuredmedia']?.[0]?.source_url || item.meta?.cover_image),
      status: (item.meta?.status as MIDHProject['status']) || 'actif',
      statusLabel: item.meta?.status_label || 'Projet actif',
      domain: item.meta?.domain || 'bonne-gouvernance',
      period: item.meta?.period || '',
      location: item.meta?.location || '',
      order: item.menu_order || 0,
    };
  }

  return null;
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

  const wpPosts = await fetchWordPressAPI<WPRestRecord[]>(endpoint);

  // Si WordPress a répondu avec succès (y compris un tableau vide si l'administrateur a supprimé tous les articles)
  if (wpPosts && Array.isArray(wpPosts)) {
    if (wpPosts.length === 0) {
      // Aucun article publié sur le CMS : ne JAMAIS afficher d'articles fictifs de remplacement
      return [];
    }

    const mapped = wpPosts.map((post) => {
      const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'actualites';
      const catName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Actualité';
      const postDate = post.date || new Date().toISOString();
      const dateObj = new Date(postDate);
      const formattedDate = dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const postViews = post.views !== undefined
        ? Number(post.views)
        : (post.meta?.midh_post_views ? Number(post.meta.midh_post_views) : 0);

      return {
        id: post.id,
        title: decodeHtml(post.title?.rendered || 'Sans titre'),
        slug: post.slug,
        excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
        content: post.content?.rendered || '',
        featuredImage: sanitizeUrl(post._embedded?.['wp:featuredmedia']?.[0]?.source_url),
        date: postDate,
        formattedDate,
        author: post._embedded?.author?.[0]?.name || 'MIDH',
        category: (catSlug as PublicationCategory) || 'actualites',
        categoryLabel: catName,
        isFeatured: post.sticky || false,
        views: postViews,
      };
    });

    if (category && category !== 'tous') {
      return mapped.filter((a) => a.category === category);
    }
    return mapped;
  }

  // Si l'API WordPress est inaccessible ou vide, retourner une liste vide (zéro article fictif)
  return [];
}

/**
 * Récupère un article par son slug
 */
export async function getArticleBySlug(slug: string): Promise<MIDHArticle | null> {
  const articles = await getArticles();
  const found = articles.find((a) => a.slug === slug);
  if (found) {
    return found;
  }

  // Si pas encore présent dans la liste paginée, interroger directement par slug
  const wpPost = await fetchWordPressAPI<WPRestRecord[]>(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`);
  if (wpPost && Array.isArray(wpPost) && wpPost.length > 0) {
    const post = wpPost[0];
    const catSlug = post._embedded?.['wp:term']?.[0]?.[0]?.slug || 'actualites';
    const catName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Actualité';
    const postDate = post.date || new Date().toISOString();
    const postViews = post.views !== undefined
      ? Number(post.views)
      : (post.meta?.midh_post_views ? Number(post.meta.midh_post_views) : 0);

    return {
      id: post.id,
      title: decodeHtml(post.title?.rendered || 'Sans titre'),
      slug: post.slug,
      excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
      content: post.content?.rendered || '',
      featuredImage: sanitizeUrl(post._embedded?.['wp:featuredmedia']?.[0]?.source_url),
      date: postDate,
      formattedDate: new Date(postDate).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      author: post._embedded?.author?.[0]?.name || 'MIDH',
      category: (catSlug as PublicationCategory) || 'actualites',
      categoryLabel: catName,
      isFeatured: post.sticky || false,
      views: postViews,
    };
  }

  return null;
}

/**
 * Enregistre et incrémente une vue d'article auprès de l'API WordPress MIDH
 */
export async function recordArticleView(articleId: number | string): Promise<{ success: boolean; views?: number }> {
  const cleanId = typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;
  if (!cleanId || isNaN(cleanId)) {
    return { success: false };
  }

  try {
    const res = await fetchWordPressAPI<{ success: boolean; id: number; views: number }>(
      `/wp-json/midh/v1/articles/${cleanId}/view`,
      {
        method: 'POST',
      }
    );
    if (res && res.success) {
      return { success: true, views: res.views };
    }
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de la vue :', err);
  }
  return { success: false };
}

/**
 * Récupère le nombre actuel de vues d'un article auprès de l'API WordPress MIDH
 */
export async function getArticleViews(articleId: number | string): Promise<{ success: boolean; views: number }> {
  const cleanId = typeof articleId === 'string' ? parseInt(articleId, 10) : articleId;
  if (!cleanId || isNaN(cleanId)) {
    return { success: false, views: 0 };
  }

  try {
    const res = await fetchWordPressAPI<{ success: boolean; id: number; views: number }>(
      `/wp-json/midh/v1/articles/${cleanId}/view`,
      {
        method: 'GET',
      }
    );
    if (res && res.success && typeof res.views === 'number') {
      return { success: true, views: res.views };
    }
  } catch {
    // Fallback: interroger le post directement si GET /view n'est pas encore actif
    try {
      const post = await fetchWordPressAPI<{ id: number; views?: number; meta?: { midh_post_views?: number } }>(
        `/wp-json/wp/v2/posts/${cleanId}`
      );
      if (post) {
        const v = post.views !== undefined
          ? Number(post.views)
          : (post.meta?.midh_post_views ? Number(post.meta.midh_post_views) : 0);
        return { success: true, views: v };
      }
    } catch {
      // Ignorer les erreurs réseau pour le fallback
    }
  }
  return { success: false, views: 0 };
}

/**
 * Récupère les documents institutionnels et rapports PDF
 */
export async function getDocuments(): Promise<MIDHDocument[]> {
  // 1. Tente d'abord l'endpoint optimisé MIDH Core
  const customDocs = await fetchWordPressAPI<MIDHDocument[]>('/wp-json/midh/v1/documents');
  if (customDocs && Array.isArray(customDocs)) {
    return customDocs.map((doc) => ({
      ...doc,
      title: decodeHtml(doc.title),
      fileUrl: sanitizeUrl(doc.fileUrl),
    }));
  }

  // 2. Tente l'endpoint REST standard WP CPT
  const wpDocs = await fetchWordPressAPI<WPRestRecord[]>('/wp-json/wp/v2/midh_document?_embed&per_page=50');
  if (wpDocs && Array.isArray(wpDocs)) {
    return wpDocs.map((doc) => ({
      id: doc.id,
      title: decodeHtml(doc.title?.rendered || 'Document'),
      slug: doc.slug,
      excerpt: doc.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
      fileUrl: sanitizeUrl(doc.meta?.file_url || '#'),
      fileSize: doc.meta?.file_size || 'PDF',
      fileFormat: doc.meta?.file_format || 'PDF',
      category: (doc.meta?.category as MIDHDocument['category']) || 'rapport_annuel',
      categoryLabel: doc.meta?.category_label || 'Rapport annuel',
      publicationDate: doc.meta?.publication_date || '',
    }));
  }

  return [];
}

/**
 * Récupère les membres de l'équipe et l'organigramme
 */
export async function getTeamMembers(): Promise<MIDHTeamMember[]> {
  // 1. Tenter d'abord l'endpoint dédié /wp-json/midh/v1/team avec métadonnées résolues
  const customTeam = await fetchWordPressAPI<Array<{
    id: number;
    fullName: string;
    role: string;
    photoUrl: string;
    biography: string;
    mandateStatus: 'actuel' | 'ancien';
    mandatePeriod: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
    order: number;
  }>>('/wp-json/midh/v1/team');

  if (customTeam && Array.isArray(customTeam)) {
    return customTeam.map((m) => ({
      id: m.id,
      fullName: decodeHtml(m.fullName || 'Membre du MIDH'),
      role: m.role || 'Membre de la Direction',
      photoUrl: sanitizeUrl(m.photoUrl || ''),
      biography: decodeHtml(m.biography || ''),
      email: m.email || '',
      linkedin: m.linkedin || '',
      twitter: m.twitter || '',
      order: m.order || 0,
      mandateStatus: (m.mandateStatus === 'ancien' ? 'ancien' : 'actuel') as 'actuel' | 'ancien',
      mandatePeriod: m.mandatePeriod || '',
    })).sort((a, b) => {
      const orderA = a.order > 0 ? a.order : 999;
      const orderB = b.order > 0 ? b.order : 999;
      return orderA - orderB;
    });
  }

  // 2. Fallback sur l'API standard /wp-json/wp/v2/midh_team
  const wpTeam = await fetchWordPressAPI<WPRestRecord[]>('/wp-json/wp/v2/midh_team?_embed&per_page=50');

  if (wpTeam && Array.isArray(wpTeam)) {
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

      const rawMandateStatus = (m.meta?.mandate_status || '').toLowerCase().trim();
      const mandateStatus: 'actuel' | 'ancien' = rawMandateStatus === 'ancien' || rawMandateStatus === 'former' ? 'ancien' : 'actuel';
      const mandatePeriod = m.meta?.mandate_period || '';

      return {
        id: m.id,
        fullName: rawTitle,
        role,
        photoUrl: sanitizeUrl(photoUrl || ''),
        biography,
        email: m.meta?.email || '',
        linkedin: m.meta?.linkedin || '',
        twitter: m.meta?.twitter || '',
        order: m.menu_order || 0,
        mandateStatus,
        mandatePeriod,
      };
    }).sort((a, b) => {
      const orderA = a.order > 0 ? a.order : 999;
      const orderB = b.order > 0 ? b.order : 999;
      return orderA - orderB;
    });
  }

  return [];
}

/**
 * Récupère les partenaires institutionnels
 */
export async function getPartners(): Promise<MIDHPartner[]> {
  const wpPartners = await fetchWordPressAPI<WPRestRecord[]>('/wp-json/wp/v2/midh_partner?_embed&per_page=50');

  if (wpPartners && Array.isArray(wpPartners)) {
    return wpPartners.map((p) => {
      const featuredMedia = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      const cleanExcerpt = p.excerpt?.rendered
        ? p.excerpt.rendered.replace(/<[^>]+>/g, '').trim()
        : p.meta?.description || '';

      return {
        id: p.id,
        name: decodeHtml(p.title?.rendered || 'Partenaire'),
        slug: p.slug || `partenaire-${p.id}`,
        logoUrl: sanitizeUrl(featuredMedia || p.meta?.logo_url || ''),
        featuredImage: sanitizeUrl(featuredMedia || p.meta?.featured_image || p.meta?.logo_url || ''),
        type: (p.meta?.type as MIDHPartner['type']) || 'technique',
        typeLabel: p.meta?.type_label || (p.meta?.type === 'bailleur' ? 'Bailleur Institutionnel' : p.meta?.type === 'societe_civile' ? 'Société Civile' : 'Partenaire Technique'),
        websiteUrl: p.meta?.website_url,
        description: cleanExcerpt || p.meta?.description,
        excerpt: cleanExcerpt,
        content: p.content?.rendered || '',
        order: p.menu_order || 0,
      };
    });
  }

  return [];
}

/**
 * Récupère un partenaire spécifique par son slug
 */
export async function getPartnerBySlug(slug: string): Promise<MIDHPartner | null> {
  // 1. Chercher d'abord dans la liste de tous les partenaires
  const partners = await getPartners();
  const found = partners.find((p) => p.slug === slug || String(p.id) === slug);
  if (found) {
    return found;
  }

  // 2. Si pas encore présent, interroger directement l'API WordPress par slug
  const wpPartners = await fetchWordPressAPI<WPRestRecord[]>(`/wp-json/wp/v2/midh_partner?slug=${encodeURIComponent(slug)}&_embed`);

  if (wpPartners && Array.isArray(wpPartners) && wpPartners.length > 0) {
    const p = wpPartners[0];
    const featuredMedia = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const cleanExcerpt = p.excerpt?.rendered
      ? p.excerpt.rendered.replace(/<[^>]+>/g, '').trim()
      : p.meta?.description || '';

    return {
      id: p.id,
      name: decodeHtml(p.title?.rendered || 'Partenaire'),
      slug: p.slug || `partenaire-${p.id}`,
      logoUrl: sanitizeUrl(featuredMedia || p.meta?.logo_url || ''),
      featuredImage: sanitizeUrl(featuredMedia || p.meta?.featured_image || p.meta?.logo_url || ''),
      type: (p.meta?.type as MIDHPartner['type']) || 'technique',
      typeLabel: p.meta?.type_label || (p.meta?.type === 'bailleur' ? 'Bailleur Institutionnel' : p.meta?.type === 'societe_civile' ? 'Société Civile' : 'Partenaire Technique'),
      websiteUrl: p.meta?.website_url,
      description: cleanExcerpt || p.meta?.description,
      excerpt: cleanExcerpt,
      content: p.content?.rendered || '',
      order: p.menu_order || 0,
    };
  }

  return null;
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
    const valid = wpSlides.map((s) => ({
      ...s,
      title: decodeHtml(s.title),
      image: sanitizeUrl(s.image),
    })).filter((s) => s.title && s.image);
    if (valid.length > 0) {
      return valid;
    }
  }
  return [];
}

export interface WordPressGalleryResponse {
  photos: Array<{
    id: number | string;
    title: string;
    category?: string;
    image?: string;
    date?: string;
    location?: string;
    description?: string;
    show_on_home?: boolean;
  }>;
  videos: Array<{
    id: number | string;
    title: string;
    video_url?: string;
    video_embed?: string;
    youtube_id?: string;
    thumbnail?: string;
    date?: string;
    duration?: string;
    source?: string;
    description?: string;
    location?: string;
    category?: string;
  }>;
  homeSlides: Array<{
    id: number | string;
    title: string;
    category?: string;
    image?: string;
    date?: string;
    location?: string;
    description?: string;
  }>;
}

/**
 * Récupère les photos et vidéos de la médiathèque depuis WordPress
 */
export async function getGalleryData(): Promise<{
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
  homePhotos: GalleryPhoto[];
}> {
  const wpData = await fetchWordPressAPI<WordPressGalleryResponse>('/wp-json/midh/v1/gallery');

  if (wpData && (wpData.photos?.length > 0 || wpData.videos?.length > 0)) {
    const photos: GalleryPhoto[] = (wpData.photos || [])
      .filter((p) => p.image && p.image.trim().length > 0)
      .map((p, idx) => ({
        id: String(p.id || `wp-p-${idx}`),
        title: decodeHtml(p.title),
        category: p.category || 'terrain',
        categoryLabel: p.category || 'Action de terrain',
        imageUrl: sanitizeUrl(p.image),
        date: p.date || '',
        location: p.location || 'Côte d’Ivoire',
        description: decodeHtml(p.description || ''),
        showOnHome: p.show_on_home !== false,
      }));

    const videos: GalleryVideo[] = (wpData.videos || []).map((v, idx) => ({
      id: String(v.id || `wp-v-${idx}`),
      title: decodeHtml(v.title),
      category: v.category || 'reportage',
      categoryLabel: v.category || 'Reportage officiel',
      videoUrl: v.video_url || '',
      videoEmbed: v.video_embed || '',
      youtubeId: v.youtube_id || '',
      thumbnail: sanitizeUrl(v.thumbnail),
      date: v.date || '',
      duration: v.duration || 'Vidéo',
      source: v.source || 'YouTube',
      description: decodeHtml(v.description || ''),
    }));

    const homePhotos = photos.filter((p) => p.showOnHome);

    return {
      photos,
      videos,
      homePhotos: homePhotos.length > 0 ? homePhotos : photos.slice(0, 6),
    };
  }

  return {
    photos: [],
    videos: [],
    homePhotos: [],
  };
}

/**
 * Enregistre un abonné à la newsletter dans WordPress
 */
export async function subscribeNewsletterInWordPress(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetchWordPressAPI<{ success: boolean; message?: string }>('/wp-json/midh/v1/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (res && res.success) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res?.message || 'Erreur d\'enregistrement WordPress' };
  } catch (error) {
    console.warn('[WordPress Newsletter] Erreur:', (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}

export interface VolunteerSubmissionPayload {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  location: string;
  domain?: string;
  availability?: string;
  message?: string;
}

export async function submitVolunteerInWordPress(payload: VolunteerSubmissionPayload): Promise<{ success: boolean; message?: string; id?: number }> {
  try {
    const res = await fetchWordPressAPI<{ success: boolean; message?: string; id?: number }>('/wp-json/midh/v1/volunteers/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res && res.success) {
      return { success: true, message: res.message, id: res.id };
    }
    return { success: false, message: res?.message || 'Erreur d\'enregistrement WordPress' };
  } catch (error) {
    console.warn('[WordPress Volunteer] Erreur:', (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}

export interface WordPressDonationPayload {
  reference: string;
  donorName: string;
  donorType?: 'particulier' | 'organisation';
  representativeName?: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number | string;
  currency?: string;
  paymentMethod?: string;
  status?: string;
}

/**
 * Enregistre un don complété dans l'Historique des Dons de WordPress
 */
export async function recordDonationInWordPress(
  payload: WordPressDonationPayload
): Promise<{ success: boolean; message?: string }> {
  try {
    const bridgeKey =
      process.env.MIDH_WP_BRIDGE_SECRET?.trim() ||
      process.env.REVALIDATE_SECRET_TOKEN?.trim() ||
      '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (bridgeKey) {
      headers['X-MIDH-Key'] = bridgeKey;
    }

    const res = await fetchWordPressAPI<{ success: boolean; message?: string }>('/wp-json/midh/v1/donations/record', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (res && res.success) {
      return { success: true, message: res.message };
    }
    return { success: false, message: res?.message || 'Erreur d\'enregistrement du don dans WordPress' };
  } catch (error) {
    console.warn('[WordPress Donation] Erreur:', (error as Error).message);
    return { success: false, message: (error as Error).message };
  }
}

