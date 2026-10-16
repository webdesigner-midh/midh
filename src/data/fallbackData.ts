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
} from '@/types/wordpress';

export const OFFICIAL_SITE_OPTIONS: MIDHSiteOptions = {
  organizationName: "Mouvement Ivoirien des Droits Humains (MIDH)",
  creationDate: "08 octobre 2000",
  membersCount: "300+",
  sectionsCount: "Environ 20",
  address: "Abidjan, Cocody Angré, Carrefour les Oscars",
  phone: "+225 01 01 49 87 39",
  whatsapp: "+225 01 01 49 87 39",
  email: "contact@midh-ci.org",
  socialLinks: {
    facebook: "https://facebook.com/midh.ci",
    instagram: "https://instagram.com/midh.ci",
    linkedin: "https://linkedin.com/company/midh-ci",
    tiktok: "https://tiktok.com/@midh.ci",
    youtube: "https://youtube.com/@midh-ci",
  },
  institutional: {
    heroTag: "Présentation Institutionnelle",
    heroTitle: "Fidèle aux valeurs de justice et de dignité depuis 2000.",
    heroSubtitle: "Le Mouvement Ivoirien des Droits Humains (MIDH) est une organisation non gouvernementale laïque, indépendante et à but non lucratif, régie par la loi ivoirienne.",
    historyP1: "Le Mouvement Ivoirien des Droits Humains (MIDH) a été fondé le 8 octobre 2000 en Côte d'Ivoire par un collectif de juristes, d'universitaires, de syndicalistes et de citoyens engagés, face aux défis majeurs de protection des libertés fondamentales et aux crises sociopolitiques de l'époque.",
    historyP2: "Dès sa création, le MIDH s'est distingué par sa rigueur documentaire, son impartialité et son courage civique. L'organisation a constamment maintenu une présence active de veille, d'assistance judiciaire aux victimes et d'interpellation des pouvoirs publics, sans jamais transiger sur son indépendance politique ou confessionnelle.",
    mission: "Assurer la promotion, la protection et la défense des droits de l'Homme reconnus, et œuvrer pour l'effectivité des droits économiques, sociaux et culturels de chaque citoyen en Côte d'Ivoire.",
    vision: "Une société ivoirienne démocratique, équitable et pacifiée, où la dignité inhérente à toute personne humaine est garantie et protégée par un État de droit exemplaire.",
    values: "Indépendance, intégrité, solidarité, non-discrimination, vérité factuelle et engagement désintéressé au service des populations les plus vulnérables.",
    teamPhotoUrl: "/images/midh-team-group.jpg",
  },
};

export const OFFICIAL_DOMAINS: MIDHDomainInfo[] = [
  {
    id: 'elections',
    number: '1',
    title: 'Élections',
    icon: 'how_to_vote',
    shortDescription: "Observation du processus électoral, promotion du droit de vote et veille citoyenne pour des scrutins apaisés et transparents.",
    fullDescription: "Observation indépendante des scrutins, sensibilisation citoyenne à la paix électorale, monitoring des violences électorales et plaidoyer pour des réformes électorales inclusives."
  },
  {
    id: 'bonne-gouvernance',
    number: '2',
    title: 'Bonne gouvernance',
    icon: 'account_balance',
    shortDescription: "Suivi de la redevabilité institutionnelle, respect de l'État de droit et transparence de la gestion des affaires publiques.",
    fullDescription: "Plaidoyer pour l'accès à l'information publique, contrôle citoyen de l'action publique et renforcement des capacités des acteurs étatiques et non étatiques."
  },
  {
    id: 'education',
    number: '3',
    title: 'Éducation',
    icon: 'school',
    shortDescription: "Défense du droit à l'éducation inclusive, sensibilisation en milieu scolaire et universitaire aux libertés fondamentales.",
    fullDescription: "Promotion des clubs de droits humains dans les établissements scolaires et universitaires, lutte contre les violences en milieu éducatif et veille sur l'équité scolaire."
  },
  {
    id: 'sante',
    number: '4',
    title: 'Santé',
    icon: 'medical_services',
    shortDescription: "Plaidoyer pour l'accès aux soins de santé primaires, respect des droits des malades et assistance médicale d'urgence aux victimes.",
    fullDescription: "Surveillance du respect de la dignité des patients dans les centres de santé, accompagnement médical d'urgence des victimes de violences et plaidoyer pour la couverture sanitaire universelle."
  },
  {
    id: 'lutte-contre-la-corruption',
    number: '5',
    title: 'Lutte contre la corruption',
    icon: 'policy',
    shortDescription: "Dénonciation des pratiques de corruption et de concussion, protection des lanceurs d'alerte et éducation à la probité civique.",
    fullDescription: "Veille juridique contre les infractions de corruption, sensibilisation communautaire à l'intégrité et plaidoyer pour l'application rigoureuse des sanctions légales."
  },
  {
    id: 'violences-basees-sur-le-genre',
    number: '6',
    title: 'Violences basées sur le genre',
    icon: 'escalator_warning',
    shortDescription: "Assistance juridique et psycho-médicale aux victimes de VBG, lutte contre les discriminations et protection des femmes et enfants.",
    fullDescription: "Cliniques juridiques dédiées, prise en charge psycho-judiciaire des victimes, lutte contre les mariages d'enfants et les violences conjugales sur tout le territoire."
  },
  {
    id: 'environnement',
    number: '7',
    title: 'Environnement',
    icon: 'forest',
    shortDescription: "Protection des droits des communautés riveraines, surveillance des impacts écologiques et préservation du cadre de vie.",
    fullDescription: "Documentation des impacts environnementaux et de l'orpaillage clandestin, défense des droits fonciers ruraux et formation des communautés à la justice climatique."
  },
  {
    id: 'securite-des-defenseures',
    number: '8',
    title: 'Sécurité numérique et physique des défenseur·es',
    icon: 'security',
    shortDescription: "Protection numérique et physique des défenseur·es des droits humains, assistance juridique urgente et renforcement des capacités.",
    fullDescription: "Mécanismes d'alerte précoce, relocalisation d'urgence, assistance juridique aux militants poursuivis et ateliers de sécurité physique et numérique."
  },
  {
    id: 'jeunesse',
    number: '9',
    title: 'Jeunesse',
    icon: 'groups_3',
    shortDescription: "Promotion de la citoyenneté active, formation civique des jeunes, inclusion démocratique et prévention des violences politiques.",
    fullDescription: "Ateliers de dialogue intercommunautaire, renforcement du leadership civique des jeunes filles et garçons, et sensibilisation à la culture de la paix et des droits fondamentaux."
  },
  {
    id: 'autonomisation-des-femmes',
    number: '10',
    title: 'Autonomisation des femmes',
    icon: 'diversity_2',
    shortDescription: "Promotion des droits économiques et sociaux des femmes, égalité des chances, leadership féminin et accès aux ressources.",
    fullDescription: "Accompagnement juridique des femmes entrepreneures, formation aux droits successoraux et fonciers, et plaidoyer pour une réelle parité dans les instances décisionnelles."
  },
  {
    id: 'protection-de-l-enfance',
    number: '11',
    title: "Protection de l'enfance",
    icon: 'child_care',
    shortDescription: "Lutte contre le travail des enfants, protection contre les abus et exploitation, et garantie de l'accès universel à l'état civil.",
    fullDescription: "Assistance judiciaire aux mineurs en danger ou en conflit avec la loi, campagnes d'enregistrement des naissances et protection contre les pires formes de travail des enfants."
  },
  {
    id: 'formation-professionnelle',
    number: '12',
    title: 'Formation professionnelle',
    icon: 'engineering',
    shortDescription: "Renforcement des capacités techniques et juridiques, insertion socioprofessionnelle des publics vulnérables et promotion de l'emploi décent.",
    fullDescription: "Programmes d'apprentissage et de reconversion pour les jeunes déscolarisés, formation aux normes du travail et défense des droits des travailleurs du secteur informel."
  },
  {
    id: 'aide-humanitaire',
    number: '13',
    title: 'Aide humanitaire',
    icon: 'volunteer_activism',
    shortDescription: "Assistance d'urgence, solidarité active et soutien psychosocial aux populations affectées par les crises sociopolitiques ou sinistres.",
    fullDescription: "Déploiement d'actions de premier secours civique, aide d'urgence aux déplacés internes, médiation humanitaire et plaidoyer pour la protection des personnes déplacées."
  },
  {
    id: 'agriculture',
    number: '14',
    title: 'Agriculture & Droits fonciers',
    icon: 'agriculture',
    shortDescription: "Défense des droits des producteurs agricoles ruraux, médiation sur les conflits fonciers ruraux et sécurisation des terres cultivables.",
    fullDescription: "Accompagnement juridique des coopératives agricoles, vulgarisation de la loi sur le foncier rural, résolution pacifique des litiges éleveurs-agriculteurs et promotion de la souveraineté alimentaire."
  },
];

export const OFFICIAL_SECTIONS: MIDHSection[] = [
  { id: 1, city: "Abidjan (Siège)", isHeadquarters: true, activeStatus: true },
  { id: 2, city: "Bouaké", isHeadquarters: false, activeStatus: true },
  { id: 3, city: "Daloa", isHeadquarters: false, activeStatus: true },
  { id: 4, city: "Gagnoa", isHeadquarters: false, activeStatus: true },
  { id: 5, city: "Korhogo", isHeadquarters: false, activeStatus: true },
  { id: 6, city: "San-Pédro", isHeadquarters: false, activeStatus: true },
  { id: 7, city: "Yamoussoukro", isHeadquarters: false, activeStatus: true },
  { id: 8, city: "Dimbokro", isHeadquarters: false, activeStatus: true },
  { id: 9, city: "Toumodi", isHeadquarters: false, activeStatus: true },
  { id: 10, city: "Odienné", isHeadquarters: false, activeStatus: true },
  { id: 11, city: "Katiola", isHeadquarters: false, activeStatus: true },
];

export const FALLBACK_PROJECTS: MIDHProject[] = [
  {
    id: 1,
    title: "Projet de renforcement de l'accès à la justice et d'assistance aux victimes",
    slug: "renforcement-acces-justice-victimes",
    excerpt: "Présentation du programme, objectifs d'intervention, bénéficiaires et localités d'exécution.",
    content: "Ce projet opérationnel vise à déployer des cliniques juridiques mobiles et à assurer un conseil juridique gratuit et un suivi judiciaire aux citoyens vulnérables dans les régions ciblées.",
    status: "actif",
    statusLabel: "Projet actif",
    domain: "bonne-gouvernance",
    period: "2025 - 2026",
    location: "Abidjan, Bouaké, Daloa",
    order: 1,
  },
  {
    id: 2,
    title: "Observatoire citoyen de la transparence électorale et de l'apaisement",
    slug: "observatoire-citoyen-transparence-electorale",
    excerpt: "Bilan des activités réalisées, documentation et axes d'impact sur le terrain.",
    content: "Mission de monitoring et de plaidoyer pour la transparence du fichier électoral et la non-violence civique.",
    status: "cloture",
    statusLabel: "Projet clôturé",
    domain: "elections",
    period: "2023 - 2024",
    location: "Ensemble du territoire national",
    order: 2,
  },
  {
    id: 3,
    title: "Caravane nationale de sensibilisation aux droits fondamentaux et VBG",
    slug: "caravane-sensibilisation-droits-vbg",
    excerpt: "Sensibilisation, ateliers ou assistance communautaire auprès des populations locales.",
    content: "Actions de proximité menées par les sections locales du MIDH auprès des communautés rurales et périurbaines pour promouvoir l'égalité et la dénonciation des violences.",
    status: "action_terrain",
    statusLabel: "Action de terrain",
    domain: "violences-basees-sur-le-genre",
    period: "En cours",
    location: "Sections de l'intérieur du pays",
    order: 3,
  },
  {
    id: 4,
    title: "Plaidoyer national pour la protection légale des défenseur·es des droits",
    slug: "plaidoyer-protection-defenseures",
    excerpt: "Campagnes d'interpellation publique, dialogues constructifs avec les institutions et veille juridique.",
    content: "Action concertée d'interpellation institutionnelle pour le renforcement des garanties légales et la sécurité des acteurs de la société civile en Côte d'Ivoire.",
    status: "plaidoyer",
    statusLabel: "Plaidoyer actif",
    domain: "securite-des-defenseures",
    period: "2025 - 2027",
    location: "National / Institutions républicaines",
    order: 4,
  },
];

export const FALLBACK_ARTICLES: MIDHArticle[] = [
  {
    id: 1,
    title: "Déclaration officielle sur la situation des droits humains et la consolidation de l'État de droit",
    slug: "declaration-officielle-droits-humains-etat-de-droit",
    excerpt: "Texte d'introduction de la déclaration, du communiqué de presse ou de la dernière analyse officielle publiée par le Mouvement Ivoirien des Droits Humains.",
    content: `Le Mouvement Ivoirien des Droits Humains (MIDH), fidèle à son mandat fondateur depuis le 8 octobre 2000, réaffirme sa détermination à œuvrer pour la primauté du droit, l'indépendance de la justice et l'intégrité des libertés fondamentales en Côte d'Ivoire.\n\nÀ travers ce communiqué, le Bureau Exécutif National rappelle aux autorités publiques, aux institutions républicaines et à l'ensemble des acteurs civiques l'impérieuse nécessité de garantir le respect scrupuleux des traités internationaux et régionaux ratifiés par l'État de Côte d'Ivoire.\n\nLe MIDH appelle à poursuivre les efforts pour l'accès équitable de tous les citoyens aux tribunaux et le traitement diligent des requêtes déposées par les justiciables vulnérables.`,
    date: "2026-03-15",
    formattedDate: "15 mars 2026",
    author: "Bureau Exécutif National du MIDH",
    category: "declarations",
    categoryLabel: "Déclaration officielle",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Publication du Rapport annuel sur l'état des libertés fondamentales",
    slug: "rapport-annuel-etat-libertes-fondamentales",
    excerpt: "Le MIDH compte environ vingt sections et sous-sections réparties à travers le pays pour un ancrage de proximité.",
    content: `Ce rapport annuel compile les observations factuelles, les plaintes documentées par les cliniques juridiques et les constats de terrain effectués par les sections régionales du MIDH au cours de l'exercice écoulé. Il formule une série de recommandations concrètes à l'attention des pouvoirs publics.`,
    date: "2026-02-10",
    formattedDate: "10 février 2026",
    author: "Commission Documentation & Enquêtes",
    category: "rapports",
    categoryLabel: "Rapport d'activité",
    isFeatured: false,
  },
  {
    id: 3,
    title: "Prise de position institutionnelle du MIDH sur le dialogue social et la paix citoyenne",
    slug: "prise-de-position-dialogue-social-paix-citoyenne",
    excerpt: "Le MIDH compte environ vingt sections et sous-sections réparties à travers le pays pour un ancrage de proximité.",
    content: `Communiqué officiel appelant à la concertation régulière entre société civile, forces républicaines et citoyens pour désamorcer les tensions communautaires et promouvoir la citoyenneté responsable.`,
    date: "2026-01-20",
    formattedDate: "20 janvier 2026",
    author: "Secrétariat Général",
    category: "communiques",
    categoryLabel: "Communiqué officiel",
    isFeatured: false,
  },
];

export const FALLBACK_DOCUMENTS: MIDHDocument[] = [
  {
    id: 1,
    title: "Rapport d'activité annuel du MIDH (Version consolidée)",
    slug: "rapport-activite-annuel-midh",
    excerpt: "Bilan complet des interventions d'assistance juridique, plaidoyers et formations menées par les sections.",
    fileUrl: "/documents/rapport-annuel-midh.pdf",
    fileSize: "2.4 Mo",
    fileFormat: "PDF",
    category: "rapport_annuel",
    categoryLabel: "Rapport annuel",
    publicationDate: "Février 2026",
  },
  {
    id: 2,
    title: "Guide pratique de l'observateur citoyen des droits humains",
    slug: "guide-pratique-observateur-citoyen",
    excerpt: "Manuel de référence pour les membres des sections locales et les points focaux de terrain.",
    fileUrl: "/documents/guide-observateur-midh.pdf",
    fileSize: "1.8 Mo",
    fileFormat: "PDF",
    category: "guide_juridique",
    categoryLabel: "Guide juridique",
    publicationDate: "Janvier 2026",
  },
  {
    id: 3,
    title: "Étude thématique sur l'accès à la justice des personnes vulnérables",
    slug: "etude-thematique-acces-justice-vulnerables",
    excerpt: "Analyse des obstacles financiers, géographiques et procéduraux rencontrés par les justiciables.",
    fileUrl: "/documents/etude-acces-justice-midh.pdf",
    fileSize: "3.1 Mo",
    fileFormat: "PDF",
    category: "etude_thematique",
    categoryLabel: "Étude thématique",
    publicationDate: "Décembre 2025",
  },
];

export const FALLBACK_PARTNERS: MIDHPartner[] = [
  {
    id: 1,
    name: "Partenaire Technique & Institutionnel",
    type: "technique",
    typeLabel: "Partenaire Technique",
    description: "Appui aux programmes de monitoring des droits humains et formation juridique continue.",
  },
  {
    id: 2,
    name: "Organisation Partenaire de la Société Civile",
    type: "societe_civile",
    typeLabel: "Société Civile",
    description: "Synergie d'actions pour le plaidoyer national et la justice de proximité.",
  },
  {
    id: 3,
    name: "Bailleur de Fonds Institutionnel",
    type: "bailleur",
    typeLabel: "Bailleur de fonds",
    description: "Soutien aux projets d'accompagnement juridique et de protection des victimes.",
  },
];

export const FALLBACK_TEAM: MIDHTeamMember[] = [
  {
    id: 1,
    fullName: "Présidence du Conseil d'Administration",
    role: "Direction Stratégique & Représentation Institutionnelle",
    biography: "Garant de l'orientation morale, de l'indépendance et des statuts du MIDH.",
    order: 1,
  },
  {
    id: 2,
    fullName: "Secrétariat Général & Coordination",
    role: "Coordination Opérationnelle & Gestion des Sections",
    biography: "Supervision des activités courantes, animation des sections régionales et des missions.",
    order: 2,
  },
  {
    id: 3,
    fullName: "Pôle Assistance Juridique & Contentieux",
    role: "Responsable Juridique & Accompagnement des Victimes",
    biography: "Coordination du réseau d'avocats bénévoles, conseils juridiques et cliniques mobiles.",
    order: 3,
  },
];

export const FALLBACK_HERO_SLIDES: MIDHHeroSlide[] = [
  {
    id: 1,
    title: 'Dialogue citoyen de terrain',
    desc: 'Sensibilisation civique et écoute des populations locales',
    tag: 'Présence active',
    icon: 'diversity_3',
    image: 'https://lh3.googleusercontent.com/aida/AEtjO1WOA1M1m8IRlJqMCGe3r-S7GFY1g8pe_msVOj38-Cn9a757M_M9GXl4D5XYM_iHV7lczfzpVfAwN3oHIzkSrq7VsjSizsdw49QtYphlC4MRKMP1GxjL4Ug_v_MJyRjQovCOHTEYtgkysDB7wB9WkcD0nL2W30F9W0TfanH5VJGhKEowjEmkuZtjFz5EUu0VJNVRTjRzWfnx8Oj3Okp62SKhXAE4ot0o9EebSIk6WZruRszhaRiOmwJHqx4',
    alt: "Dialogue citoyen de terrain - MIDH Côte d'Ivoire",
    order: 1,
  },
  {
    id: 2,
    title: 'Ateliers & Formations aux droits',
    desc: 'Renforcement des capacités civiques et juridiques des communautés',
    tag: 'Éducation civique',
    icon: 'school',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPjcNeWB_TP4Uu1BXcKnq7PsF2EfKAz0O_KNqVZB4TMLnMKmTQFivYQlc3d9W_dYmRgbpdPqfFa4kFMjTnQ-dAqXoFmWIOdEvRbrPaUAXayFkfX0spTq5JMYe68kDLrOMZLjrbQyJztqoxUxRKa47K67tO8I2PwIheYeRkhdq3YZdjaXBzUbqu_nRGAYQTorq8jK3WbcLFe-OTczheTJF-b6qAO9_cyWH6DnuzaOyLoJa56gYCZ2dx',
    alt: "Ateliers & Formations aux droits - MIDH Côte d'Ivoire",
    order: 2,
  },
  {
    id: 3,
    title: 'Cliniques juridiques de proximité',
    desc: 'Assistance et accompagnement direct au cœur des localités',
    tag: 'Défense & Conseil',
    icon: 'gavel',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoTco8u1jRLRqdp1TejOxMyz59DYm7yrsOJRZhx08qMfa881b7je40w6PCXJX7U8WWd4NT0pG2-UKkNiMnhfEnerQK0jJn8W0BAUMCg7q95v8xYx6A3JK2ModcgWm7aE66n952kp5TOrO05htKYeIwzkkic7-AX9s6hXLN4ily14yRMJrA5nE0eeBMwUSIbLHGjPdtiyhpVOYfE3yghy4UXNqYS-UFwdFnPsdRgE3OgQdcWvKQvxWD',
    alt: "Cliniques juridiques de proximité - MIDH Côte d'Ivoire",
    order: 3,
  },
];
