# Site Institutionnel du Mouvement Ivoirien des Droits Humains (MIDH)

Plateforme web institutionnelle officielle développée selon une architecture **Next.js 15 (App Router) + WordPress Headless CMS**, reproduisant avec exactitude la maquette Stitch et la charte graphique « Justice & Dignité ».

---

## 1. Présentation du Projet

Le **Mouvement Ivoirien des Droits Humains (MIDH)** est une organisation non gouvernementale de droit ivoirien fondée le **8 octobre 2000**, engagée dans la promotion, la protection et la défense des libertés fondamentales en Côte d’Ivoire.

### Caractéristiques de l'Architecture :
- **Frontend Découplé :** Next.js 15 (App Router), React 19, TypeScript (mode strict), Tailwind CSS avec tokens graphiques Stitch.
- **Backend & Administration Éditoriale :** WordPress configuré en **Headless CMS**, hébergé sur un serveur dédié PHP/MySQL avec l'extension sur-mesure `midh-headless-core`.
- **Communication & Synchronisation :** API REST native WordPress (`/wp-json/wp/v2/`) + endpoints personnalisés (`/wp-json/midh/v1/`).
- **Mise en cache & ISR :** Cache Next.js avec revalidation toutes les 60 secondes et Webhook instantané (`/api/revalidate`) lors de toute publication dans WordPress.
- **Résilience & Mode Déconnecté :** Données de secours officielles garantissant le fonctionnement continu du site même si le CMS WordPress est temporairement inaccessible.

---

## 2. Structure du Dépôt

```
stitch_midh_institutional_ui_ux_redesign (4)/
├── public/                      # Ressources statiques et documents PDF
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # Routes API sécurisées (contact, bénévole, newsletter, revalidate)
│   │   ├── a-propos/            # Page Présentation, Historique et Gouvernance
│   │   ├── actualites/          # Liste et détail des actualités et déclarations
│   │   │   └── [slug]/          # Page de détail avec génération statique SSG
│   │   ├── benevolat/           # Formulaire de candidature bénévole pour les 20 sections
│   │   ├── contact/             # Coordonnées officielles Cocody Angré et formulaire
│   │   ├── documents-rapports/  # Rapports annuels et documents PDF téléchargeables
│   │   ├── don/                 # Soutien, transparence et cadrage Mobile Money
│   │   ├── mentions-legales/    # Mentions légales conformes
│   │   ├── politique-de-confidentialite/ # Protection des données personnelles
│   │   ├── globals.css          # Styles de base, polices Manrope/Inter et Material Symbols
│   │   ├── layout.tsx           # Layout racine avec Header, Footer et SEO OpenGraph
│   │   ├── page.tsx             # Page d'accueil intégrant toutes les sections Stitch
│   │   ├── robots.ts            # Fichier robots.txt dynamique
│   │   └── sitemap.ts           # Plan du site sitemap.xml dynamique
│   ├── components/              # Composants modulaires et réutilisables
│   │   ├── home/                # Carrousel héro, chiffres, piliers, domaines, carte, etc.
│   │   └── layout/              # Header (avec sélecteur de langue FR/EN) et Footer
│   ├── data/                    # Données officielles de repli (fallbackData.ts)
│   ├── services/                # Couche de communication centralisée WordPress (wordpress.ts)
│   └── types/                   # Typages stricts TypeScript (wordpress.ts)
├── wordpress/                   # Configuration du CMS Headless
│   ├── docker-compose.yml       # Environnement local MariaDB / WordPress en 1 commande
│   ├── README-WORDPRESS.md      # Guide d'installation et de maintenance du CMS
│   └── plugins/
│       └── midh-headless-core/  # Extension WordPress sur-mesure (CPT, taxonomies, REST, rôles)
├── .env.example                 # Variables d'environnement documentées
├── next.config.ts               # Configuration Next.js et en-têtes de sécurité OWASP
├── tailwind.config.ts           # Palette HSL et tokens typographiques du design system
└── package.json                 # Dépendances applicatives
```

---

## 3. Démarrage Rapide

### Prérequis :
- Node.js version 20+
- npm version 10+
- (Optionnel pour tester WordPress en local) Docker & Docker Compose

### Installation des dépendances :
```bash
npm install
```

### Lancement du serveur de développement frontend :
```bash
npm run dev
```
L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### Compilation de production :
```bash
npm run build
npm run start
```

---

## 4. Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine (ou renseignez les variables dans Vercel) :

```ini
# URL publique du frontend
NEXT_PUBLIC_SITE_URL=https://midh-ci.org

# URL de l'instance WordPress Headless (laisser vide pour utiliser le fallback officiel)
NEXT_PUBLIC_WORDPRESS_URL=https://cms.midh-ci.org

# Jeton secret partagé avec WordPress pour la revalidation ISR
REVALIDATE_SECRET_TOKEN=votre_jeton_secret_aleatoire

# Destinataire des formulaires de contact
CONTACT_FORM_RECIPIENT=info@midh-ci.org,brahimacoulibaly7777@gmail.com
```

---

## 5. Déploiement en Production

### A. Déploiement du Frontend sur Vercel :
1. Poussez le dépôt sur votre compte GitHub / GitLab.
2. Importez le projet sur [Vercel](https://vercel.com).
3. Dans les réglages du projet Vercel, ajoutez les variables d'environnement (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WORDPRESS_URL`, `REVALIDATE_SECRET_TOKEN`).
4. Cliquez sur **Deploy**.

### B. Déploiement du Backend WordPress :
Consultez le guide dédié [wordpress/README-WORDPRESS.md](wordpress/README-WORDPRESS.md).

---

## 6. Sécurité & Conformité OWASP

- **Validation des entrées :** Tous les formulaires (`/api/contact`, `/api/benevole`, `/api/newsletter`) sont validés côté serveur via des schémas stricts **Zod**.
- **Anti-Spam Silencieux :** Champs pièges invisible (Honeypot) éliminant les soumissions automatiques de robots sans gêner l'expérience utilisateur.
- **Limitation de Débit (Rate Limiting) :** Protection contre les attaques par déni de service et le bombardement d'emails.
- **En-têtes HTTP de Sécurité :** HSTS (`max-age=63072000`), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Protection des Identifiants :** Aucun mot de passe ni clé privée n'est inclus dans le code ou exposé dans les variables publiques.
- **WordPress Hardened :** Désactivation de XML-RPC, masquage de la version de WordPress et interdiction d'énumération des comptes administrateurs via l'API REST.

---

## 7. État des Intégrations Externes

| Service | Statut Actuel | Action Requise avant Mise en Service |
|---|---|---|
| **Passerelle Mobile Money (Dons)** | Interface provisoire transparente et sécurisée | Brancher le webhook du prestataire agréé (ex. Wave, Orange Money, CinetPay) après validation du compte bancaire |
| **Envoi d'e-mails (Contact)** | API serveur opérationnelle avec validation | Renseigner les identifiants SMTP ou la clé d'API transactionnelle (Resend/Brevo) dans les variables d'environnement |
| **Lettre d'information (Newsletter)** | API serveur opérationnelle avec consentement | Connecter le connecteur d'API au service CRM/Newsletter retenu par le MIDH |
| **Statuts & Références officielles** | Données confirmées intégrées | Actualiser les références d'enregistrement dans WordPress dès délivrance des arrêtés ministériels |

---

## 8. Données Officielles Confirmées du MIDH

- **Dénomination :** Mouvement Ivoirien des Droits Humains (MIDH)
- **Date de fondation :** 08 octobre 2000
- **Siège :** Abidjan, Cocody Angré, Carrefour les Oscars
- **Téléphone / WhatsApp officiel :** `+225 01 01 49 87 39`
- **Email officiel :** `info@midh-ci.org`
- **Sections régionales actives (11 localités vérifiées) :** Abidjan (Siège), Bouaké, Daloa, Gagnoa, Korhogo, San-Pédro, Yamoussoukro, Dimbokro, Toumodi, Odienné, Katiola.
