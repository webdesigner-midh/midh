export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'terrain' | 'formation' | 'plaidoyer' | 'partenaires';
  categoryLabel: string;
  imageUrl: string;
  date: string;
  location: string;
  description: string;
}

export interface GalleryVideo {
  id: string;
  title: string;
  category: 'reportage' | 'plaidoyer' | 'formation' | 'declaration';
  categoryLabel: string;
  videoUrl: string;
  youtubeId?: string;
  date: string;
  duration?: string;
  source: 'YouTube' | 'Facebook' | 'Télévision';
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

export const OFFICIAL_GALLERY_VIDEOS: GalleryVideo[] = [
  {
    id: 'v-1',
    title: "Reportage officiel : 26 ans d'engagement du MIDH pour les droits humains",
    category: 'reportage',
    categoryLabel: 'Documentaire Institutionnel',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ', // ID de démonstration prêt à être remplacé par les liens officiels MIDH
    date: 'Octobre 2026',
    duration: '12:45',
    source: 'YouTube',
    description: "Rétrospective complète sur les actions majeures menées par le MIDH depuis sa fondation le 8 octobre 2000 : assistance juridique, monitoring électoral et plaidoyer international.",
  },
  {
    id: 'v-2',
    title: "Intervention télévisée : La protection des libertés fondamentales en Côte d'Ivoire",
    category: 'plaidoyer',
    categoryLabel: 'Débat & Plaidoyer',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeId: 'ScMzIvxBSi4',
    date: 'Septembre 2026',
    duration: '08:20',
    source: 'Télévision',
    description: "Prise de parole de la direction exécutive du MIDH sur le respect des droits humains, le renforcement du système judiciaire et l'égalité des chances.",
  },
  {
    id: 'v-3',
    title: "Atelier national : La justice de proximité au service des populations vulnérables",
    category: 'formation',
    categoryLabel: 'Formation & Séminaire',
    videoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    youtubeId: 'L_LUpnjgPso',
    date: 'Août 2026',
    duration: '15:10',
    source: 'YouTube',
    description: "Synthèse des travaux et témoignages des bénéficiaires des cliniques juridiques mobiles déployées dans les 20 sections territoriales du MIDH.",
  },
  {
    id: 'v-4',
    title: "Conférence de presse : Déclaration conjointe sur la transparence du scrutin",
    category: 'declaration',
    categoryLabel: 'Déclaration Officielle',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    youtubeId: 'kJQP7kiw5Fk',
    date: 'Juillet 2026',
    duration: '06:35',
    source: 'Facebook',
    description: "Lecture de la déclaration officielle du MIDH et des partenaires de la société civile appelant à un processus électoral pacifique, transparent et respectueux des libertés.",
  },
];
