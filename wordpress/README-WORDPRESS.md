# Guide d'Installation et d'Administration du Backend WordPress Headless (MIDH)

Ce document décrit pas-à-pas la mise en service, la configuration et la maintenance du CMS WordPress Headless pour le **Mouvement Ivoirien des Droits Humains (MIDH)**.

---

## 1. Architecture & Principes Directeurs

- **Rôle de WordPress :** WordPress est utilisé exclusivement comme **CMS Headless** (back-office de saisie et d'administration des contenus).
- **Communication :** Le frontend Next.js interroge l'API REST native `/wp-json/wp/v2/` et les endpoints personnalisés `/wp-json/midh/v1/`.
- **Indépendance & Résilience :** Le frontend intègre un mécanisme de repli gracieux (fallback). Si le serveur WordPress est temporairement indisponible, le site public continue de fonctionner sans rupture de service.
- **Synchronisation en direct (ISR) :** À chaque publication ou mise à jour d'un article, projet ou document, WordPress déclenche un webhook vers `/api/revalidate` sur Next.js pour régénérer instantanément le cache.

---

## 2. Déploiement Local Rapide (Docker)

Un fichier `docker-compose.yml` prêt à l'emploi est inclus dans ce dossier.

### Démarrage :
```bash
cd wordpress
docker compose up -d
```

- **Accès à WordPress :** [http://localhost:8080](http://localhost:8080)
- **Base de données :** MariaDB 10.11
- **Identifiants DB locaux :**
  - Nom de la base : `midh_wordpress`
  - Utilisateur : `midh_user`
  - Mot de passe : `midh_password_2026`

---

## 3. Déploiement en Production (Hébergement PHP / MySQL)

### Prérequis Serveur :
- PHP 8.1 ou supérieur (avec extensions `curl`, `json`, `mbstring`, `openssl`, `mysqli`)
- Base de données MySQL 5.7+ ou MariaDB 10.5+
- Certificat SSL actif (HTTPS obligatoire pour les API REST en production)
- Serveur Web Apache avec `mod_rewrite` ou Nginx

### Étapes d'installation :
1. Téléversez une installation propre de WordPress (v6.4 ou v6.7).
2. Créez la base de données MySQL via votre cPanel / Plesk / phpMyAdmin.
3. Finalisez l'installation classique de WordPress en créant le compte **Administrateur Technique**.
4. Déposez le dossier `plugins/midh-headless-core` dans `/wp-content/plugins/`.
5. Connectez-vous à l'administration WordPress et activez l'extension **MIDH Headless Core**.

---

## 4. Configuration de l'Extension « MIDH Headless Core »

Rendez-vous dans le menu d'administration **MIDH Headless** :

1. **URL du Frontend Next.js :**
   - En développement : `http://localhost:3000`
   - En production : `https://midh-ci.org` (ou l'URL de votre déploiement Vercel)
2. **Jeton Secret de Revalidation :**
   - Saisissez une chaîne de caractères aléatoire et sécurisée (ex. `midh_reval_token_87a9b23c`).
   - Reportez impérativement cette même valeur dans la variable `REVALIDATE_SECRET_TOKEN` sur Vercel.
3. **Coordonnées Officielles du MIDH :**
   - Siège : Abidjan, Cocody Angré, Carrefour les Oscars
   - Téléphone / WhatsApp : `+225 01 01 49 87 39`
   - Email officiel : `brahimacoulibaly7777@gmail.com`
4. Cliquez sur **Enregistrer les réglages**.

---

## 5. Gestion des Types de Contenus

L'extension enregistre automatiquement les structures éditoriales suivantes dans la barre latérale WordPress :

| Type de Contenu | Menu WP | Usage & Champs |
|---|---|---|
| **Articles & Communiqués** | `Articles` | Déclarations, communiqués de presse, actualités avec catégories |
| **Projets & Programmes** | `Projets & Programmes` | Actions de terrain, statut (actif, clôturé), période, localités |
| **Documents & Rapports** | `Documents & Rapports` | Rapports d'activité annuels, études thématiques, fichiers PDF |
| **Équipe & Gouvernance** | `Équipe & Gouvernance` | Responsables du Bureau Exécutif, Conseil d'Administration, fonctions |
| **Partenaires** | `Partenaires` | Bailleurs institutionnels, partenaires techniques, logos |

---

## 6. Rôles et Permissions Sécurisées

Pour préserver la sécurité de l'infrastructure, deux niveaux d'accès distincts sont prévus :

1. **Administrateur Technique (DSI / Agence) :**
   - Accès aux extensions, mises à jour, configuration CORS et jetons API.
2. **Éditeur MIDH (`midh_editor`) :**
   - Rôle dédié au personnel non technique du secrétariat du MIDH.
   - Autorisé à créer, modifier et publier les articles, projets, documents PDF et partenaires.
   - **Interdiction formelle :** Pas d'accès aux réglages du serveur, aux thèmes, aux extensions ni à la modification du code source.

---

## 7. Sécurité & Bonnes Pratiques Appliquées

- **Blocage de l'énumération des utilisateurs :** L'endpoint REST `/wp-json/wp/v2/users` est inaccessible aux visiteurs anonymes pour éviter le moissonnage d'identifiants administrateurs.
- **Désactivation de XML-RPC :** Protège contre les attaques par force brute distribuée.
- **Masquage de version :** La balise `<meta name="generator">` révélant la version de WordPress est supprimée.
- **En-têtes CORS stricts :** Seuls les domaines frontend autorisés sont habilités à interroger les endpoints en écriture.
