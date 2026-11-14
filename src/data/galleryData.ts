export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  imageUrl: string;
  date: string;
  location: string;
  description: string;
  showOnHome?: boolean;
}

export interface GalleryVideo {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  videoUrl: string;
  videoEmbed?: string;
  youtubeId?: string;
  thumbnail?: string;
  date: string;
  duration?: string;
  source: string;
  description: string;
}

export const OFFICIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'p-1',
    title: "Session de travail et de concertation avec les forces de l'ordre",
    category: 'formation',
    categoryLabel: 'Formation & Sécurité',
    imageUrl: 'https://cms.midh-ci.org/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-14-at-15.06.42.webp',
    date: '14 Octobre 2026',
    location: 'Abidjan, Côte d’Ivoire',
    description: "Atelier d'échange et de sensibilisation mutuelle entre les juristes du MIDH et les représentants de la gendarmerie et de la police nationale sur les garanties légales de garde à vue.",
  },
  {
    id: 'p-2',
    title: 'Dialogue institutionnel avec les partenaires techniques et financiers',
    category: 'partenaires',
    categoryLabel: 'Partenariat International',
    imageUrl: 'https://cms.midh-ci.org/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-14-at-15.06.38-1.webp',
    date: '12 Octobre 2026',
    location: 'Siège du MIDH, Cocody',
    description: "Rencontre de cadrage stratégique avec les délégations internationales pour le suivi des programmes de consolidation de la justice de proximité en Côte d’Ivoire.",
  },
  {
    id: 'p-3',
    title: 'Formation citoyenne et renforcement des capacités communautaires',
    category: 'formation',
    categoryLabel: 'Éducation Civique',
    imageUrl: 'https://cms.midh-ci.org/wp-content/uploads/2026/10/Vue-de-la-salle.webp',
    date: '08 Octobre 2026',
    location: 'Bouaké, Région du Gbêkê',
    description: "Vue d'ensemble de la salle lors de la session de vulgarisation des instruments juridiques de protection contre les violations des droits humains.",
  },
  {
    id: 'p-4',
    title: 'Mission de veille et plaidoyer du Chargé de Programmes',
    category: 'plaidoyer',
    categoryLabel: 'Plaidoyer & Veille',
    imageUrl: 'https://cms.midh-ci.org/wp-content/uploads/2026/10/Image-charge-de-programme-MIDH.webp',
    date: '28 Septembre 2026',
    location: 'Abidjan, Plateau',
    description: "Intervention du pôle programmes lors d'une table ronde sur la protection des défenseurs des droits humains et le droit d'accès universel à la justice.",
  },
  {
    id: 'p-5',
    title: "Observation et monitoring de terrain dans le Woroba",
    category: 'terrain',
    categoryLabel: 'Monitoring de Terrain',
    imageUrl: 'https://cms.midh-ci.org/wp-content/uploads/2026/10/Image-agent-de-monitoring-woroba.webp',
    date: '15 Septembre 2026',
    location: 'Séguéla, District du Woroba',
    description: "Déploiement des observateurs du MIDH pour la collecte rigoureuse des données factuelles sur les libertés publiques et la paix communautaire.",
  },
  {
    id: 'p-6',
    title: 'Assemblée générale et photo institutionnelle du MIDH',
    category: 'partenaires',
    categoryLabel: 'Vie de l’Organisation',
    imageUrl: 'https://cms.midh-ci.org/wp-content/uploads/2026/10/Photo-de-famille-2.webp',
    date: '08 Octobre 2026',
    location: 'Abidjan, Côte d’Ivoire',
    description: "Rassemblement des membres du Conseil d’Administration, du Secrétariat Général et des coordonnateurs des sections régionales à l'occasion du 26e anniversaire.",
  },
  {
    id: 'p-7',
    title: 'Conférence de presse sur la transparence électorale et la paix sociale',
    category: 'plaidoyer',
    categoryLabel: 'Veille & Presse',
    imageUrl: 'https://cms.midh-ci.org/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-14-at-15.21.15-2.webp',
    date: '02 Septembre 2026',
    location: 'Abidjan, Cocody',
    description: "Restitution publique des recommandations du MIDH aux institutions nationales pour la garantie d'un climat électoral démocratique, inclusif et apaisé.",
  },
  {
    id: 'p-8',
    title: 'Caravane de sensibilisation aux droits civils et politiques',
    category: 'terrain',
    categoryLabel: 'Sensibilisation',
    imageUrl: 'https://cms.midh-ci.org/wp-content/uploads/2026/10/WhatsApp-Image-2026-10-14-at-15.21.16.webp',
    date: '18 Août 2026',
    location: 'Daloa, Région du Haut-Sassandra',
    description: "Échanges directs avec les jeunes et les associations de femmes sur la prévention des conflits et la promotion de l'État de droit.",
  },
];

// Les vidéos officielles sont administrées depuis le back-office WordPress (/wp-admin > Galerie Photo & Vidéo MIDH)
export const OFFICIAL_GALLERY_VIDEOS: GalleryVideo[] = [];
