/**
 * Typages stricts pour l'écosystème WordPress Headless du MIDH
 * (Mouvement Ivoirien des Droits Humains)
 */

export type PublicationCategory = 
  | 'tous'
  | 'communiques'
  | 'rapports'
  | 'declarations'
  | 'actualites';

export type InterventionDomain =
  | 'elections'
  | 'bonne-gouvernance'
  | 'education'
  | 'sante'
  | 'lutte-contre-la-corruption'
  | 'violences-basees-sur-le-genre'
  | 'environnement'
  | 'securite-des-defenseures'
  | 'jeunesse'
  | 'autonomisation-des-femmes'
  | 'protection-de-l-enfance'
  | 'formation-professionnelle'
  | 'aide-humanitaire'
  | 'agriculture';

export interface MIDHDomainInfo {
  id: InterventionDomain;
  number: string;
  title: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
}

export interface MIDHProject {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: 'actif' | 'cloture' | 'en_cours' | 'action_terrain' | 'plaidoyer';
  statusLabel: string;
  domain: InterventionDomain | string;
  period?: string;
  location?: string;
  date?: string;
  gallery?: string[];
  documents?: {
    title: string;
    url: string;
    size?: string;
  }[];
  order?: number;
}

export interface MIDHDocument {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  fileUrl: string;
  fileSize?: string;
  fileFormat: string; // 'PDF' | 'DOCX'
  category: 'rapport_annuel' | 'etude_thematique' | 'communique' | 'guide_juridique';
  categoryLabel: string;
  publicationDate: string;
}

export interface MIDHArticle {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  date: string;
  formattedDate: string;
  author?: string;
  category: PublicationCategory;
  categoryLabel: string;
  isFeatured?: boolean;
}

export interface MIDHTeamMember {
  id: number | string;
  fullName: string;
  role: string;
  photoUrl?: string;
  biography?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  order: number;
}

export interface MIDHHeroSlide {
  id?: number | string;
  title: string;
  desc: string;
  tag: string;
  icon: string;
  image: string;
  alt: string;
  order?: number;
}

export interface MIDHPartner {
  id: number | string;
  name: string;
  logoUrl?: string;
  type: 'technique' | 'societe_civile' | 'bailleur';
  typeLabel: string;
  websiteUrl?: string;
  description?: string;
}

export interface MIDHSection {
  id: number | string;
  city: string;
  isHeadquarters: boolean;
  activeStatus: boolean;
  contactNote?: string;
}

export interface MIDHInstitutionalTexts {
  heroTag?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  historyP1?: string;
  historyP2?: string;
  mission?: string;
  vision?: string;
  values?: string;
  teamPhotoUrl?: string;
}

export interface MIDHSiteOptions {
  organizationName: string;
  creationDate: string;
  membersCount: string;
  sectionsCount: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
    youtube?: string;
  };
  institutional?: MIDHInstitutionalTexts;
}

export interface ApiResponse<T> {
  data: T;
  source: 'wordpress' | 'fallback';
  timestamp: string;
}
