<?php
/**
 * Plugin Name: MIDH Headless Core
 * Plugin URI: https://midh-ci.org
 * Description: Extension officielle du Mouvement Ivoirien des Droits Humains (MIDH) pour transformer WordPress en CMS Headless performant, sécurisé et administrable pour le frontend Next.js.
 * Version: 1.0.0
 * Author: Senior Full-Stack Architect
 * Author URI: https://midh-ci.org
 * License: GPL-2.0+
 * Text Domain: midh-headless
 */

if (!defined('ABSPATH')) {
    exit; // Sécurité : empêcher l'accès direct
}

class MIDH_Headless_Core {

    public function __construct() {
        // Initialisation des Custom Post Types et Taxonomies
        add_action('init', array($this, 'register_content_types'));
        add_action('init', array($this, 'register_meta_fields'));
        add_action('init', array($this, 'setup_midh_roles'));

        // Initialisation de l'API REST personnalisée
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // Sécurité et CORS
        add_action('rest_api_init', array($this, 'apply_security_and_cors'), 15);
        add_action('init', array($this, 'harden_wordpress_security'));

        // Menu d'administration des réglages du MIDH
        add_action('admin_menu', array($this, 'register_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));

        // Webhook de revalidation Next.js lors de la publication
        add_action('save_post', array($this, 'trigger_nextjs_revalidation'), 10, 3);
        add_action('updated_option', array($this, 'trigger_nextjs_settings_revalidation'), 10, 3);

        // Conversion automatique de toutes les images importées en WebP
        add_filter('image_editor_output_format', array($this, 'force_webp_output_format'));
        add_filter('wp_editor_set_quality', array($this, 'optimize_webp_quality'), 10, 2);
        add_filter('wp_handle_upload', array($this, 'convert_uploaded_image_to_webp'));

        // Personnalisation complète de l'interface Admin & Login (MIDH Studio)
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_theme'));
        add_action('login_enqueue_scripts', array($this, 'enqueue_login_theme'));
        add_filter('login_headerurl', array($this, 'custom_login_logo_url'));
        add_filter('login_headertext', array($this, 'custom_login_logo_title'));
        add_action('admin_bar_menu', array($this, 'customize_admin_bar'), 999);
        add_filter('admin_footer_text', array($this, 'custom_admin_footer_text'));
        add_filter('update_footer', '__return_empty_string', 11);
        add_action('wp_dashboard_setup', array($this, 'setup_midh_dashboard_hub'));

        // Boîtes de métadonnées personnalisées pour Projets, Documents & Équipe
        add_action('add_meta_boxes', array($this, 'register_midh_meta_boxes'));
        add_action('save_post_midh_project', array($this, 'save_midh_project_meta_box'), 10, 2);
        add_action('save_post_midh_document', array($this, 'save_midh_document_meta_box'), 10, 2);
        add_action('save_post_midh_team', array($this, 'save_midh_team_meta_box'), 10, 2);
        add_action('save_post_midh_slide', array($this, 'save_midh_slide_meta_box'), 10, 2);
        add_filter('manage_midh_slide_posts_columns', array($this, 'customize_slide_columns'));
        add_action('manage_midh_slide_posts_custom_column', array($this, 'render_slide_custom_column'), 10, 2);
        add_filter('enter_title_here', array($this, 'custom_enter_title_placeholder'), 10, 2);
        add_filter('use_block_editor_for_post_type', array($this, 'disable_gutenberg_for_team'), 10, 2);

        // Personnalisation avancée de l'interface du Newsroom Studio (Articles & Publications)
        add_filter('manage_posts_columns', array($this, 'customize_article_columns'));
        add_action('manage_posts_custom_column', array($this, 'render_article_custom_column'), 10, 2);
        add_filter('post_row_actions', array($this, 'customize_article_row_actions'), 10, 2);
        add_action('all_admin_notices', array($this, 'render_newsroom_header_banner'));
    }

    /**
     * 1. Enregistrement des Custom Post Types et Taxonomies
     */
    public function register_content_types() {
        // A. CPT : Projets & Programmes opérationnels
        register_post_type('midh_project', array(
            'labels' => array(
                'name'               => __('Projets & Programmes', 'midh-headless'),
                'singular_name'      => __('Projet', 'midh-headless'),
                'add_new'            => __('Ajouter un projet', 'midh-headless'),
                'add_new_item'       => __('Ajouter un nouveau projet', 'midh-headless'),
                'edit_item'          => __('Modifier le projet', 'midh-headless'),
                'all_items'          => __('Tous les projets', 'midh-headless'),
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'midh_project',
            'menu_icon'    => 'dashicons-clipboard',
            'supports'     => array('title', 'editor', 'excerpt', 'thumbnail', 'page-attributes'),
            'has_archive'  => true,
            'rewrite'      => array('slug' => 'projets'),
        ));

        // B. CPT : Documents & Rapports PDF
        register_post_type('midh_document', array(
            'labels' => array(
                'name'               => __('Documents & Rapports', 'midh-headless'),
                'singular_name'      => __('Document', 'midh-headless'),
                'add_new'            => __('Ajouter un document', 'midh-headless'),
                'add_new_item'       => __('Ajouter un nouveau rapport/document', 'midh-headless'),
                'edit_item'          => __('Modifier le document', 'midh-headless'),
                'all_items'          => __('Tous les documents', 'midh-headless'),
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'midh_document',
            'menu_icon'    => 'dashicons-pdf',
            'supports'     => array('title', 'editor', 'excerpt', 'thumbnail'),
            'has_archive'  => true,
            'rewrite'      => array('slug' => 'documents'),
        ));

        // C. CPT : Membres de l'Équipe & Organigramme
        register_post_type('midh_team', array(
            'labels' => array(
                'name'               => __('Équipe & Gouvernance', 'midh-headless'),
                'singular_name'      => __('Membre de l\'équipe', 'midh-headless'),
                'add_new'            => __('Ajouter un membre', 'midh-headless'),
                'add_new_item'       => __('Ajouter un nouveau responsable', 'midh-headless'),
                'edit_item'          => __('Modifier le membre', 'midh-headless'),
                'all_items'          => __('Tous les membres', 'midh-headless'),
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'midh_team',
            'menu_icon'    => 'dashicons-groups',
            'supports'     => array('title', 'thumbnail', 'page-attributes'),
        ));

        // D. CPT : Partenaires Institutionnels
        register_post_type('midh_partner', array(
            'labels' => array(
                'name'               => __('Partenaires', 'midh-headless'),
                'singular_name'      => __('Partenaire', 'midh-headless'),
                'add_new'            => __('Ajouter un partenaire', 'midh-headless'),
                'add_new_item'       => __('Ajouter un nouveau partenaire', 'midh-headless'),
                'edit_item'          => __('Modifier le partenaire', 'midh-headless'),
                'all_items'          => __('Tous les partenaires', 'midh-headless'),
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'midh_partner',
            'menu_icon'    => 'dashicons-businessperson',
            'supports'     => array('title', 'editor', 'thumbnail'),
        ));

        // E. CPT : Diapositives du Carrousel d'Accueil
        register_post_type('midh_slide', array(
            'labels' => array(
                'name'               => __('Diapositives Accueil', 'midh-headless'),
                'singular_name'      => __('Diapositive', 'midh-headless'),
                'add_new'            => __('Ajouter une diapositive', 'midh-headless'),
                'add_new_item'       => __('Ajouter une nouvelle diapositive', 'midh-headless'),
                'edit_item'          => __('Modifier la diapositive', 'midh-headless'),
                'all_items'          => __('Toutes les diapositives', 'midh-headless'),
            ),
            'public'       => true,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'midh_slide',
            'menu_icon'    => 'dashicons-images-alt2',
            'supports'     => array('title', 'thumbnail', 'page-attributes'),
            'menu_position'=> 24,
        ));

        // Taxonomie : Domaines d'action (8 thématiques)
        register_taxonomy('midh_domain', array('midh_project', 'post'), array(
            'labels' => array(
                'name'          => __('Domaines d\'action', 'midh-headless'),
                'singular_name' => __('Domaine d\'action', 'midh-headless'),
            ),
            'hierarchical'      => true,
            'show_ui'           => true,
            'show_admin_column' => true,
            'show_in_rest'      => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'domaine'),
        ));
    }

    /**
     * 2. Enregistrement des Meta Fields exposés dans l'API REST
     */
    public function register_meta_fields() {
        // Projets
        $project_metas = array('status', 'status_label', 'domain', 'period', 'location', 'cover_image');
        foreach ($project_metas as $key) {
            register_post_meta('midh_project', $key, array(
                'show_in_rest' => true,
                'single'       => true,
                'type'         => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ));
        }

        // Documents
        $doc_metas = array('file_url', 'file_size', 'file_format', 'category', 'category_label', 'publication_date');
        foreach ($doc_metas as $key) {
            register_post_meta('midh_document', $key, array(
                'show_in_rest' => true,
                'single'       => true,
                'type'         => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ));
        }

        // Équipe
        $team_metas = array('role', 'photo_url', 'biography', 'email', 'linkedin', 'twitter');
        foreach ($team_metas as $key) {
            register_post_meta('midh_team', $key, array(
                'show_in_rest' => true,
                'single'       => true,
                'type'         => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ));
        }

        // Partenaires
        $partner_metas = array('type', 'type_label', 'website_url', 'description');
        foreach ($partner_metas as $key) {
            register_post_meta('midh_partner', $key, array(
                'show_in_rest' => true,
                'single'       => true,
                'type'         => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ));
        }
    }

    /**
     * 3. Endpoints REST API personnalisés pour le MIDH
     */
    public function register_rest_routes() {
        register_rest_route('midh/v1', '/options', array(
            'methods'  => 'GET',
            'callback' => array($this, 'get_site_options_endpoint'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('midh/v1', '/domains', array(
            'methods'  => 'GET',
            'callback' => array($this, 'get_domains_endpoint'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('midh/v1', '/sections', array(
            'methods'  => 'GET',
            'callback' => array($this, 'get_sections_endpoint'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('midh/v1', '/slides', array(
            'methods'  => 'GET',
            'callback' => array($this, 'get_slides_endpoint'),
            'permission_callback' => '__return_true',
        ));

        register_rest_route('midh/v1', '/documents', array(
            'methods'  => 'GET',
            'callback' => array($this, 'get_documents_endpoint'),
            'permission_callback' => '__return_true',
        ));
    }

    public function get_site_options_endpoint() {
        return new WP_REST_Response(array(
            'organizationName' => get_option('midh_org_name', 'Mouvement Ivoirien des Droits Humains (MIDH)'),
            'creationDate'     => get_option('midh_creation_date', '08 octobre 2000'),
            'membersCount'     => get_option('midh_members_count', '300+'),
            'sectionsCount'    => get_option('midh_sections_count', 'Environ 20'),
            'address'          => get_option('midh_address', 'Abidjan, Cocody Angré, Carrefour les Oscars'),
            'phone'            => get_option('midh_phone', '+225 01 01 49 87 39'),
            'whatsapp'         => get_option('midh_whatsapp', '+225 01 01 49 87 39'),
            'email'            => get_option('midh_email', 'contact@midh-ci.org'),
            'socialLinks'      => array(
                'facebook'  => get_option('midh_facebook', 'https://facebook.com/midh.ci'),
                'instagram' => get_option('midh_instagram', 'https://instagram.com/midh.ci'),
                'linkedin'  => get_option('midh_linkedin', 'https://linkedin.com/company/midh-ci'),
                'tiktok'    => get_option('midh_tiktok', 'https://tiktok.com/@midh.ci'),
                'youtube'   => get_option('midh_youtube', 'https://youtube.com/@midh-ci'),
            ),
            'institutional'    => array(
                'heroTag'      => get_option('midh_about_hero_tag', 'Présentation Institutionnelle'),
                'heroTitle'    => get_option('midh_about_hero_title', 'Fidèle aux valeurs de justice et de dignité depuis 2000.'),
                'heroSubtitle' => get_option('midh_about_hero_subtitle', 'Le Mouvement Ivoirien des Droits Humains (MIDH) est une organisation non gouvernementale laïque, indépendante et à but non lucratif, régie par la loi ivoirienne.'),
                'historyP1'    => get_option('midh_about_history_p1', 'Le Mouvement Ivoirien des Droits Humains (MIDH) a été fondé le 8 octobre 2000 en Côte d\'Ivoire par un collectif de juristes, d\'universitaires, de syndicalistes et de citoyens engagés, face aux défis majeurs de protection des libertés fondamentales et aux crises sociopolitiques de l\'époque.'),
                'historyP2'    => get_option('midh_about_history_p2', 'Dès sa création, le MIDH s\'est distingué par sa rigueur documentaire, son impartialité et son courage civique. L\'organisation a constamment maintenu une présence active de veille, d\'assistance judiciaire aux victimes et d\'interpellation des pouvoirs publics, sans jamais transiger sur son indépendance politique ou confessionnelle.'),
                'mission'      => get_option('midh_about_mission', 'Assurer la promotion, la protection et la défense des droits de l\'Homme reconnus, et œuvrer pour l\'effectivité des droits économiques, sociaux et culturels de chaque citoyen en Côte d\'Ivoire.'),
                'vision'       => get_option('midh_about_vision', 'Une société ivoirienne démocratique, équitable et pacifiée, où la dignité inhérente à toute personne humaine est garantie et protégée par un État de droit exemplaire.'),
                'values'       => get_option('midh_about_values', 'Indépendance, intégrité, solidarité, non-discrimination, vérité factuelle et engagement désintéressé au service des populations les plus vulnérables.'),
                'teamPhotoUrl' => get_option('midh_about_team_photo', '/images/midh-team-group.jpg'),
            ),
        ), 200);
    }

    public function get_domains_endpoint() {
        // Retourne les domaines officiels d'intervention du MIDH
        return new WP_REST_Response(array(
            array('id' => 'elections', 'number' => '1', 'title' => 'Élections', 'icon' => 'how_to_vote', 'shortDescription' => 'Observation du processus électoral, promotion du droit de vote et veille citoyenne.'),
            array('id' => 'bonne-gouvernance', 'number' => '2', 'title' => 'Bonne gouvernance', 'icon' => 'account_balance', 'shortDescription' => 'Suivi de la redevabilité institutionnelle et respect de l\'État de droit.'),
            array('id' => 'education', 'number' => '3', 'title' => 'Éducation', 'icon' => 'school', 'shortDescription' => 'Défense du droit à l\'éducation inclusive et sensibilisation civique.'),
            array('id' => 'sante', 'number' => '4', 'title' => 'Santé', 'icon' => 'medical_services', 'shortDescription' => 'Plaidoyer pour l\'accès aux soins de santé et respect des droits des malades.'),
            array('id' => 'lutte-contre-la-corruption', 'number' => '5', 'title' => 'Lutte contre la corruption', 'icon' => 'policy', 'shortDescription' => 'Dénonciation de la corruption et éducation à la probité civique.'),
            array('id' => 'violences-basees-sur-le-genre', 'number' => '6', 'title' => 'Violences basées sur le genre', 'icon' => 'escalator_warning', 'shortDescription' => 'Assistance juridique et psycho-médicale aux victimes de VBG.'),
            array('id' => 'environnement', 'number' => '7', 'title' => 'Environnement', 'icon' => 'forest', 'shortDescription' => 'Protection des droits des communautés riveraines et du cadre de vie.'),
            array('id' => 'securite-des-defenseures', 'number' => '8', 'title' => 'Sécurité numérique et physique des défenseur·es', 'icon' => 'security', 'shortDescription' => 'Protection et assistance d\'urgence aux défenseur·es des droits humains.'),
            array('id' => 'jeunesse', 'number' => '9', 'title' => 'Jeunesse', 'icon' => 'groups_3', 'shortDescription' => 'Promotion de la citoyenneté active, leadership des jeunes et prévention des violences.'),
            array('id' => 'autonomisation-des-femmes', 'number' => '10', 'title' => 'Autonomisation des femmes', 'icon' => 'diversity_2', 'shortDescription' => 'Droits économiques et sociaux, leadership féminin et égalité des chances.'),
            array('id' => 'protection-de-l-enfance', 'number' => '11', 'title' => 'Protection de l\'enfance', 'icon' => 'child_care', 'shortDescription' => 'Lutte contre le travail des enfants, protection juridique et accès à l\'état civil.'),
            array('id' => 'formation-professionnelle', 'number' => '12', 'title' => 'Formation professionnelle', 'icon' => 'engineering', 'shortDescription' => 'Appui aux compétences professionnelles, insertion des publics vulnérables et travail décent.'),
            array('id' => 'aide-humanitaire', 'number' => '13', 'title' => 'Aide humanitaire', 'icon' => 'volunteer_activism', 'shortDescription' => 'Secours civique d\'urgence, soutien psychosocial et matériel aux populations en crise.'),
            array('id' => 'agriculture', 'number' => '14', 'title' => 'Agriculture & Droits fonciers', 'icon' => 'agriculture', 'shortDescription' => 'Défense des droits des producteurs ruraux, médiation foncière et sécurité alimentaire.'),
        ), 200);
    }

    public function get_sections_endpoint() {
        return new WP_REST_Response(array(
            array('id' => 1, 'city' => 'Abidjan (Siège)', 'isHeadquarters' => true, 'activeStatus' => true),
            array('id' => 2, 'city' => 'Bouaké', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 3, 'city' => 'Daloa', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 4, 'city' => 'Gagnoa', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 5, 'city' => 'Korhogo', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 6, 'city' => 'San-Pédro', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 7, 'city' => 'Yamoussoukro', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 8, 'city' => 'Dimbokro', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 9, 'city' => 'Toumodi', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 10, 'city' => 'Odienné', 'isHeadquarters' => false, 'activeStatus' => true),
            array('id' => 11, 'city' => 'Katiola', 'isHeadquarters' => false, 'activeStatus' => true),
        ), 200);
    }

    /**
     * 4. Sécurité renforcée OWASP & CORS Headless
     */
    public function apply_security_and_cors() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function ($value) {
            $origin = get_http_origin();
            $frontend_url = get_option('midh_frontend_url', 'http://localhost:3000');
            
            // Autoriser le frontend configuré
            if ($origin) {
                header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
                header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
            }
            return $value;
        });

        // Bloquer l'énumération des utilisateurs WordPress pour les requêtes anonymes
        add_filter('rest_endpoints', function ($endpoints) {
            if (!is_user_logged_in() && isset($endpoints['/wp/v2/users'])) {
                unset($endpoints['/wp/v2/users']);
            }
            if (!is_user_logged_in() && isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
                unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
            }
            return $endpoints;
        });
    }

    public function harden_wordpress_security() {
        // Supprimer la divulgation de version WordPress
        remove_action('wp_head', 'wp_generator');
        add_filter('the_generator', '__return_empty_string');

        // Désactiver XML-RPC
        add_filter('xmlrpc_enabled', '__return_false');
    }

    /**
     * 5. Configuration des rôles : Éditeur MIDH
     */
    public function setup_midh_roles() {
        add_role('midh_editor', __('Éditeur MIDH', 'midh-headless'), array(
            'read'                   => true,
            'edit_posts'             => true,
            'edit_others_posts'      => true,
            'publish_posts'          => true,
            'upload_files'           => true,
            'edit_published_posts'   => true,
            'delete_posts'           => false,
            'manage_categories'      => true,
        ));
    }

    /**
     * 6. Webhook de revalidation Next.js
     */
    public function trigger_nextjs_revalidation($post_id, $post, $update) {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        $frontend_url = get_option('midh_frontend_url', '');
        $secret_token = get_option('midh_revalidate_token', '');

        if (empty($frontend_url) || empty($secret_token)) {
            return;
        }

        $clean_url = rtrim($frontend_url, '/') . '/api/revalidate?secret=' . urlencode($secret_token);

        wp_remote_post($clean_url, array(
            'blocking' => false,
            'timeout'  => 5,
            'headers'  => array('Content-Type' => 'application/json'),
            'body'     => wp_json_encode(array(
                'tag'     => 'wordpress',
                'post_id' => $post_id,
                'slug'    => $post->post_name,
            )),
        ));
    }

    public function trigger_nextjs_settings_revalidation($option, $old_value, $value) {
        if (strpos($option, 'midh_') === 0) {
            $frontend_url = get_option('midh_frontend_url', '');
            $secret_token = get_option('midh_revalidate_token', '');

            if (empty($frontend_url) || empty($secret_token)) {
                return;
            }

            $clean_url = rtrim($frontend_url, '/') . '/api/revalidate?secret=' . urlencode($secret_token);

            wp_remote_post($clean_url, array(
                'blocking' => false,
                'timeout'  => 5,
                'headers'  => array('Content-Type' => 'application/json'),
                'body'     => wp_json_encode(array(
                    'tag'  => 'wordpress',
                    'path' => '/a-propos',
                )),
            ));
        }
    }

    /**
     * 7. Page d'options dans le tableau de bord WordPress
     */
    public function register_admin_menu() {
        add_menu_page(
            __('Réglages MIDH Headless', 'midh-headless'),
            __('MIDH Headless', 'midh-headless'),
            'manage_options',
            'midh-headless-settings',
            array($this, 'render_admin_settings_page'),
            'dashicons-shield',
            25
        );
    }

    public function register_settings() {
        register_setting('midh_settings_group', 'midh_org_name');
        register_setting('midh_settings_group', 'midh_creation_date');
        register_setting('midh_settings_group', 'midh_members_count');
        register_setting('midh_settings_group', 'midh_sections_count');
        register_setting('midh_settings_group', 'midh_address');
        register_setting('midh_settings_group', 'midh_phone');
        register_setting('midh_settings_group', 'midh_whatsapp');
        register_setting('midh_settings_group', 'midh_email');
        register_setting('midh_settings_group', 'midh_frontend_url');
        register_setting('midh_settings_group', 'midh_revalidate_token');

        // Réglages des textes institutionnels (Page À propos & Présentation)
        register_setting('midh_settings_group', 'midh_about_hero_tag');
        register_setting('midh_settings_group', 'midh_about_hero_title');
        register_setting('midh_settings_group', 'midh_about_hero_subtitle');
        register_setting('midh_settings_group', 'midh_about_history_p1');
        register_setting('midh_settings_group', 'midh_about_history_p2');
        register_setting('midh_settings_group', 'midh_about_mission');
        register_setting('midh_settings_group', 'midh_about_vision');
        register_setting('midh_settings_group', 'midh_about_values');
        register_setting('midh_settings_group', 'midh_about_team_photo');
    }

    public function render_admin_settings_page() {
        ?>
        <div class="wrap" style="max-width: 900px;">
            <h1><span class="dashicons dashicons-shield" style="font-size: 32px; width: 32px; height: 32px; vertical-align: middle;"></span> <?php _e('Configuration MIDH Headless & Synchronisation Next.js', 'midh-headless'); ?></h1>
            <p><?php _e('Gérez les coordonnées officielles, les textes institutionnels et la liaison technique avec le frontend Next.js déployé sur Vercel.', 'midh-headless'); ?></p>

            <form method="post" action="options.php">
                <?php settings_fields('midh_settings_group'); ?>
                
                <h2 class="title"><?php _e('Liaison Frontend Next.js (Vercel)', 'midh-headless'); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('URL du Frontend Next.js', 'midh-headless'); ?></th>
                        <td>
                            <input type="url" name="midh_frontend_url" value="<?php echo esc_attr(get_option('midh_frontend_url', 'http://localhost:3000')); ?>" class="regular-text" placeholder="https://midh-ci.org ou https://mon-site.vercel.app" />
                            <p class="description"><?php _e('URL publique du frontend pour le CORS et les webhooks.', 'midh-headless'); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Jeton Secret de Revalidation', 'midh-headless'); ?></th>
                        <td>
                            <input type="text" name="midh_revalidate_token" value="<?php echo esc_attr(get_option('midh_revalidate_token', '')); ?>" class="regular-text" placeholder="Ex. midh_secret_token_12345" />
                            <p class="description"><?php _e('Doit correspondre à la variable d\'environnement REVALIDATE_SECRET_TOKEN du frontend.', 'midh-headless'); ?></p>
                        </td>
                    </tr>
                </table>

                <h2 class="title"><?php _e('Coordonnées & Informations Officielles', 'midh-headless'); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('Nom de l\'organisation', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_org_name" value="<?php echo esc_attr(get_option('midh_org_name', 'Mouvement Ivoirien des Droits Humains (MIDH)')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Date de création', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_creation_date" value="<?php echo esc_attr(get_option('midh_creation_date', '08 octobre 2000')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Nombre de membres', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_members_count" value="<?php echo esc_attr(get_option('midh_members_count', '300+')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Nombre de sections', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_sections_count" value="<?php echo esc_attr(get_option('midh_sections_count', 'Environ 20')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Adresse physique du siège', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_address" value="<?php echo esc_attr(get_option('midh_address', 'Abidjan, Cocody Angré, Carrefour les Oscars')); ?>" class="large-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Téléphone officiel', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_phone" value="<?php echo esc_attr(get_option('midh_phone', '+225 01 01 49 87 39')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Ligne WhatsApp', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_whatsapp" value="<?php echo esc_attr(get_option('midh_whatsapp', '+225 01 01 49 87 39')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Email officiel', 'midh-headless'); ?></th>
                        <td><input type="email" name="midh_email" value="<?php echo esc_attr(get_option('midh_email', 'contact@midh-ci.org')); ?>" class="regular-text" /></td>
                    </tr>
                </table>

                <h2 class="title" style="margin-top: 30px;"><span class="dashicons dashicons-id-alt" style="font-size: 24px; vertical-align: middle; margin-right: 4px;"></span> <?php _e('Présentation Institutionnelle & Page « À Propos »', 'midh-headless'); ?></h2>
                <p class="description"><?php _e('Modifiez librement les textes officiels de la page À propos. Vos modifications sont transmises en temps réel à Next.js.', 'midh-headless'); ?></p>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php _e('Surtitre d\'en-tête (Tag)', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_about_hero_tag" value="<?php echo esc_attr(get_option('midh_about_hero_tag', 'Présentation Institutionnelle')); ?>" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Titre principal d\'accroche', 'midh-headless'); ?></th>
                        <td><input type="text" name="midh_about_hero_title" value="<?php echo esc_attr(get_option('midh_about_hero_title', 'Fidèle aux valeurs de justice et de dignité depuis 2000.')); ?>" class="large-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Sous-titre introductif', 'midh-headless'); ?></th>
                        <td><textarea name="midh_about_hero_subtitle" rows="3" class="large-text"><?php echo esc_textarea(get_option('midh_about_hero_subtitle', 'Le Mouvement Ivoirien des Droits Humains (MIDH) est une organisation non gouvernementale laïque, indépendante et à but non lucratif, régie par la loi ivoirienne.')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Notre Histoire (Paragraphe 1)', 'midh-headless'); ?></th>
                        <td><textarea name="midh_about_history_p1" rows="4" class="large-text"><?php echo esc_textarea(get_option('midh_about_history_p1', 'Le Mouvement Ivoirien des Droits Humains (MIDH) a été fondé le 8 octobre 2000 en Côte d\'Ivoire par un collectif de juristes, d\'universitaires, de syndicalistes et de citoyens engagés, face aux défis majeurs de protection des libertés fondamentales et aux crises sociopolitiques de l\'époque.')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Notre Histoire (Paragraphe 2)', 'midh-headless'); ?></th>
                        <td><textarea name="midh_about_history_p2" rows="4" class="large-text"><?php echo esc_textarea(get_option('midh_about_history_p2', 'Dès sa création, le MIDH s\'est distingué par sa rigueur documentaire, son impartialité et son courage civique. L\'organisation a constamment maintenu une présence active de veille, d\'assistance judiciaire aux victimes et d\'interpellation des pouvoirs publics, sans jamais transiger sur son indépendance politique ou confessionnelle.')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Notre Mission', 'midh-headless'); ?></th>
                        <td><textarea name="midh_about_mission" rows="3" class="large-text"><?php echo esc_textarea(get_option('midh_about_mission', 'Assurer la promotion, la protection et la défense des droits de l\'Homme reconnus, et œuvrer pour l\'effectivité des droits économiques, sociaux et culturels de chaque citoyen en Côte d\'Ivoire.')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Notre Vision', 'midh-headless'); ?></th>
                        <td><textarea name="midh_about_vision" rows="3" class="large-text"><?php echo esc_textarea(get_option('midh_about_vision', 'Une société ivoirienne démocratique, équitable et pacifiée, où la dignité inhérente à toute personne humaine est garantie et protégée par un État de droit exemplaire.')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Nos Valeurs', 'midh-headless'); ?></th>
                        <td><textarea name="midh_about_values" rows="3" class="large-text"><?php echo esc_textarea(get_option('midh_about_values', 'Indépendance, intégrité, solidarité, non-discrimination, vérité factuelle et engagement désintéressé au service des populations les plus vulnérables.')); ?></textarea></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php _e('Photo de groupe de toute l\'équipe', 'midh-headless'); ?></th>
                        <td>
                            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                                <input type="text" id="midh_about_team_photo" name="midh_about_team_photo" value="<?php echo esc_attr(get_option('midh_about_team_photo', '/images/midh-team-group.jpg')); ?>" class="large-text" placeholder="https://... ou /images/midh-team-group.jpg" style="flex: 1;" />
                                <button type="button" id="midh_upload_team_photo_btn" class="button button-secondary" style="white-space: nowrap;">📷 <?php _e('Choisir dans la médiathèque', 'midh-headless'); ?></button>
                            </div>
                            <p class="description"><?php _e('Sélectionnez ou collez l\'URL de la photo panoramique de groupe (Assemblée générale, membres et équipe) affichée en haut de la page À propos.', 'midh-headless'); ?></p>
                        </td>
                    </tr>
                </table>

                <?php submit_button(__('Enregistrer les réglages', 'midh-headless')); ?>
            </form>

            <script>
            jQuery(document).ready(function($) {
                var teamPhotoUploader;
                $('#midh_upload_team_photo_btn').on('click', function(e) {
                    e.preventDefault();
                    if (teamPhotoUploader) {
                        teamPhotoUploader.open();
                        return;
                    }
                    teamPhotoUploader = wp.media({
                        title: 'Choisir la photo officielle de l\'équipe / Assemblée générale',
                        button: { text: 'Utiliser cette photo pour la page À propos' },
                        multiple: false,
                        library: { type: 'image' }
                    });
                    teamPhotoUploader.on('select', function() {
                        var attachment = teamPhotoUploader.state().get('selection').first().toJSON();
                        var url = attachment.sizes && attachment.sizes.large ? attachment.sizes.large.url : attachment.url;
                        $('#midh_about_team_photo').val(url);
                    });
                    teamPhotoUploader.open();
                });
            });
            </script>
        </div>
        <?php
    }

    /**
     * 6. PERSONNALISATION COMPLÈTE DE L'INTERFACE ADMIN (MIDH Studio)
     */
    public function enqueue_admin_theme($hook) {
        wp_enqueue_style(
            'midh-admin-theme',
            plugin_dir_url(__FILE__) . 'assets/admin-theme.css',
            array(),
            '1.5.0'
        );

        global $post;
        if ($hook === 'toplevel_page_midh-headless-settings' || (($hook === 'post.php' || $hook === 'post-new.php') && isset($post) && ($post->post_type === 'midh_team' || $post->post_type === 'midh_slide' || $post->post_type === 'midh_document'))) {
            wp_enqueue_media();
        }
    }

    public function enqueue_login_theme() {
        wp_enqueue_style(
            'midh-login-theme',
            plugin_dir_url(__FILE__) . 'assets/login-theme.css',
            array(),
            '1.1.0'
        );
    }

    public function custom_login_logo_url() {
        return get_option('midh_frontend_url', 'http://localhost:3000');
    }

    public function custom_login_logo_title() {
        return 'MIDH - Mouvement Ivoirien des Droits Humains';
    }

    public function customize_admin_bar($wp_admin_bar) {
        // Nettoyer la barre supérieure : retirer les nœuds WordPress superflus ou encombrants
        $wp_admin_bar->remove_node('wp-logo');
        $wp_admin_bar->remove_node('updates');
        $wp_admin_bar->remove_node('comments');
        $wp_admin_bar->remove_node('new-content');
        $wp_admin_bar->remove_node('search');

        // Remplacer le nœud "site-name" par un bouton d'accueil clair qui ramène toujours au tableau de bord
        $wp_admin_bar->remove_node('site-name');
        $wp_admin_bar->add_node(array(
            'id'    => 'midh-dashboard-home',
            'title' => '🏛️ MIDH Studio · Tableau de bord',
            'href'  => admin_url('index.php'),
            'meta'  => array(
                'title' => 'Retourner au tableau de bord d\'administration'
            )
        ));

        // Bouton d'accès direct au site frontend Next.js
        $frontend_url = get_option('midh_frontend_url', 'http://localhost:3000');
        $wp_admin_bar->add_node(array(
            'id'    => 'midh-live-site',
            'title' => '🌐 Voir le site public (Next.js)',
            'href'  => esc_url($frontend_url),
            'meta'  => array(
                'target' => '_blank',
                'title'  => 'Ouvrir le site Next.js du MIDH dans un nouvel onglet'
            )
        ));
    }

    public function custom_admin_footer_text() {
        return '<span style="font-weight: 600; color: #006b1f;">MIDH Studio</span> — Portail de gestion de contenu du <strong>Mouvement Ivoirien des Droits Humains</strong> &copy; 2026. Tous droits réservés.';
    }

    public function setup_midh_dashboard_hub() {
        global $wp_meta_boxes;

        // Retirer tous les widgets WordPress par défaut encombrants
        unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_activity']);
        unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_recent_comments']);
        unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_site_health']);
        unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_right_now']);
        unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_incoming_links']);
        unset($wp_meta_boxes['dashboard']['normal']['core']['dashboard_plugins']);
        unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_quick_press']);
        unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_primary']);
        unset($wp_meta_boxes['dashboard']['side']['core']['dashboard_secondary']);

        // Ajouter notre Hub Exclusif MIDH
        wp_add_dashboard_widget(
            'midh_dashboard_hub_widget',
            '🏛️ MIDH Studio — Vue Générale du Contenu',
            array($this, 'render_midh_dashboard_hub')
        );
    }

    public function render_midh_dashboard_hub() {
        $count_posts     = wp_count_posts('post')->publish;
        $count_projects  = wp_count_posts('midh_project')->publish;
        $count_docs      = wp_count_posts('midh_document')->publish;
        $count_team      = wp_count_posts('midh_team')->publish;
        $frontend_url    = get_option('midh_frontend_url', 'http://localhost:3000');

        ?>
        <div class="midh-hub-banner">
            <h2>Bienvenue sur le portail d'administration du MIDH</h2>
            <p>Ce tableau de bord vous permet d'administrer en toute simplicité les actualités, projets d'impact, rapports d'enquête et membres de l'organisation. Toutes vos publications sont synchronisées en temps réel avec le site public institutionnel.</p>
            <div class="midh-hub-actions">
                <a href="<?php echo admin_url('post-new.php'); ?>" class="midh-hub-btn-primary">+ Rédiger une actualité</a>
                <a href="<?php echo admin_url('post-new.php?post_type=midh_document'); ?>" class="midh-hub-btn-primary">+ Ajouter un document PDF</a>
                <a href="<?php echo esc_url($frontend_url); ?>" target="_blank" class="midh-hub-btn-outline">🌐 Ouvrir le site public</a>
            </div>
        </div>

        <div class="midh-stats-grid">
            <div class="midh-stat-card">
                <div class="midh-stat-label">Actualités publiées</div>
                <div class="midh-stat-value"><?php echo esc_html($count_posts); ?></div>
                <a href="<?php echo admin_url('edit.php'); ?>" class="midh-stat-link">Gérer les articles &rarr;</a>
            </div>
            <div class="midh-stat-card">
                <div class="midh-stat-label">Projets &amp; Actions</div>
                <div class="midh-stat-value"><?php echo esc_html($count_projects); ?></div>
                <a href="<?php echo admin_url('edit.php?post_type=midh_project'); ?>" class="midh-stat-link">Voir les projets &rarr;</a>
            </div>
            <div class="midh-stat-card">
                <div class="midh-stat-label">Rapports &amp; Guides</div>
                <div class="midh-stat-value"><?php echo esc_html($count_docs); ?></div>
                <a href="<?php echo admin_url('edit.php?post_type=midh_document'); ?>" class="midh-stat-link">Gérer les documents &rarr;</a>
            </div>
            <div class="midh-stat-card">
                <div class="midh-stat-label">Équipe &amp; Gouvernance</div>
                <div class="midh-stat-value"><?php echo esc_html($count_team); ?></div>
                <a href="<?php echo admin_url('edit.php?post_type=midh_team'); ?>" class="midh-stat-link">Voir l'équipe &rarr;</a>
            </div>
        </div>
        <?php
    }

    /**
     * 7. OPTIMISATION & CONVERSION AUTOMATIQUE DES IMAGES EN WEBP
     */
    public function force_webp_output_format($formats) {
        $formats['image/jpeg'] = 'image/webp';
        $formats['image/jpg']  = 'image/webp';
        $formats['image/png']  = 'image/webp';
        return $formats;
    }

    public function optimize_webp_quality($quality, $mime_type) {
        if ($mime_type === 'image/webp') {
            return 85; // Compression WebP optimale (haute fidélité visuelle, poids divisé par 4)
        }
        return $quality;
    }

    public function convert_uploaded_image_to_webp($upload) {
        if (isset($upload['type']) && in_array($upload['type'], array('image/jpeg', 'image/jpg', 'image/png'), true)) {
            $file_path = $upload['file'];

            // Vérifier que l'éditeur d'image WordPress supporte la conversion WebP
            $editor = wp_get_image_editor($file_path);
            if (!is_wp_error($editor) && $editor->supports_mime_type('image/webp')) {
                $file_info = pathinfo($file_path);
                $webp_path = $file_info['dirname'] . '/' . $file_info['filename'] . '.webp';

                // Sauvegarder directement au format WebP
                $saved = $editor->save($webp_path, 'image/webp');
                if (!is_wp_error($saved)) {
                    // Supprimer l'original non optimisé de manière sécurisée
                    $upload_dir = wp_upload_dir();
                    if ($file_path !== $webp_path && strpos(realpath($file_path), realpath($upload_dir['basedir'])) === 0) {
                        wp_delete_file($file_path);
                    }

                    $upload['file'] = $webp_path;
                    $upload['url']  = str_replace('/' . $file_info['basename'], '/' . $file_info['filename'] . '.webp', $upload['url']);
                    $upload['type'] = 'image/webp';
                }
            }
        }
        return $upload;
    }

    /**
     * Boîtes de métadonnées personnalisées pour l'administration MIDH Studio
     */
    public function register_midh_meta_boxes() {
        add_meta_box(
            'midh_project_details',
            __('📌 Paramètres du Projet & Affichage Carrousel', 'midh-headless'),
            array($this, 'render_project_meta_box'),
            'midh_project',
            'normal',
            'high'
        );

        add_meta_box(
            'midh_document_details',
            __('📄 Paramètres du Document / Rapport PDF', 'midh-headless'),
            array($this, 'render_document_meta_box'),
            'midh_document',
            'normal',
            'high'
        );

        add_meta_box(
            'midh_team_details',
            __('👤 Profil & Fonction Officielle du Responsable (Organigramme MIDH)', 'midh-headless'),
            array($this, 'render_team_meta_box'),
            'midh_team',
            'normal',
            'high'
        );

        add_meta_box(
            'midh_slide_details',
            __('🖼️ Paramètres de la Diapositive (Carrousel Accueil)', 'midh-headless'),
            array($this, 'render_slide_meta_box'),
            'midh_slide',
            'normal',
            'high'
        );
    }

    public function render_project_meta_box($post) {
        wp_nonce_field('midh_project_meta_save', 'midh_project_nonce');
        $status = get_post_meta($post->ID, 'status', true) ?: 'actif';
        $period = get_post_meta($post->ID, 'period', true) ?: '';
        $location = get_post_meta($post->ID, 'location', true) ?: '';
        ?>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 12px 0;">
            <div>
                <label for="midh_project_status" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                    Statut du projet :
                </label>
                <select name="midh_project_status" id="midh_project_status" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7;">
                    <option value="actif" <?php selected($status, 'actif'); ?>>🟢 Projet actif</option>
                    <option value="cloture" <?php selected($status, 'cloture'); ?>>⚪ Projet clôturé</option>
                    <option value="terrain" <?php selected($status, 'terrain'); ?>>📣 Action de terrain</option>
                    <option value="plaidoyer" <?php selected($status, 'plaidoyer'); ?>>⚖️ Plaidoyer actif</option>
                </select>
                <p style="font-size: 12px; color: #666; margin-top: 4px;">Badge affiché sur la carte du carrousel.</p>
            </div>
            <div>
                <label for="midh_project_period" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                    Période d'exécution :
                </label>
                <input type="text" name="midh_project_period" id="midh_project_period" value="<?php echo esc_attr($period); ?>" placeholder="ex: 2025 - 2026 ou En cours" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7; padding: 0 8px;" />
                <p style="font-size: 12px; color: #666; margin-top: 4px;">Année(s) ou durée d'exercice.</p>
            </div>
            <div>
                <label for="midh_project_location" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                    Zone géographique :
                </label>
                <input type="text" name="midh_project_location" id="midh_project_location" value="<?php echo esc_attr($location); ?>" placeholder="ex: Abidjan, Bouaké, Daloa" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7; padding: 0 8px;" />
                <p style="font-size: 12px; color: #666; margin-top: 4px;">Localités ou zone d'impact terrain.</p>
            </div>
        </div>
        <div style="background: #f6faf5; border-left: 4px solid #006b1f; padding: 10px 14px; border-radius: 4px; margin-top: 8px;">
            <p style="margin: 0; font-size: 13px; color: #2d4336;">
                💡 <strong>Image de couverture :</strong> Utilisez la case <em>« Image mise en avant »</em> dans la colonne de droite de WordPress pour ajouter la photo officielle du projet.
            </p>
        </div>
        <?php
    }

    /**
     * Schéma de validation et de typage strict des requêtes entrantes (Input Schema Boundary Validation)
     */
    private static function validate_request_payload(array $payload, array $schema): array {
        $validated = array();
        foreach ($schema as $field => $rules) {
            if (!isset($payload[$field])) {
                if (array_key_exists('default', $rules)) {
                    $validated[$field] = $rules['default'];
                }
                continue;
            }

            $raw = $payload[$field];
            $type = isset($rules['type']) ? $rules['type'] : 'string';

            if ($type === 'string') {
                if (!is_string($raw)) {
                    continue;
                }
                $sanitized = isset($rules['sanitize']) && $rules['sanitize'] === 'url'
                    ? esc_url_raw(wp_unslash($raw))
                    : sanitize_text_field(wp_unslash($raw));

                if (isset($rules['validate']) && $rules['validate'] === 'url') {
                    if (!filter_var($sanitized, FILTER_VALIDATE_URL)) {
                        $sanitized = '';
                    }
                }

                if (isset($rules['enum']) && is_array($rules['enum'])) {
                    if (!in_array($sanitized, $rules['enum'], true)) {
                        $sanitized = isset($rules['default']) ? $rules['default'] : '';
                    }
                }

                if (isset($rules['max_length']) && is_int($rules['max_length'])) {
                    if (mb_strlen($sanitized) > $rules['max_length']) {
                        $sanitized = mb_substr($sanitized, 0, $rules['max_length']);
                    }
                }

                $validated[$field] = $sanitized;
            } elseif ($type === 'int') {
                if (is_numeric($raw)) {
                    $val = absint($raw);
                    if (isset($rules['min']) && $val < $rules['min']) {
                        $val = $rules['min'];
                    }
                    if (isset($rules['max']) && $val > $rules['max']) {
                        $val = $rules['max'];
                    }
                    $validated[$field] = $val;
                }
            }
        }
        return $validated;
    }

    public function save_midh_project_meta_box($post_id, $post) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Définition explicite du schéma d'entrée à la frontière de l'API
        $schema = array(
            'midh_project_nonce'    => array('type' => 'string', 'max_length' => 100),
            'midh_project_status'   => array('type' => 'string', 'enum' => array('actif', 'cloture', 'terrain', 'plaidoyer'), 'default' => 'actif'),
            'midh_project_period'   => array('type' => 'string', 'max_length' => 100),
            'midh_project_location' => array('type' => 'string', 'max_length' => 255),
        );
        $clean = self::validate_request_payload($_POST, $schema);

        $nonce = isset($clean['midh_project_nonce']) ? $clean['midh_project_nonce'] : '';
        if (empty($nonce) || !wp_verify_nonce($nonce, 'midh_project_meta_save')) {
            return;
        }

        $allowed_statuses = array(
            'actif'     => 'Projet actif',
            'cloture'   => 'Projet clôturé',
            'terrain'   => 'Action de terrain',
            'plaidoyer' => 'Plaidoyer actif',
        );

        if (isset($clean['midh_project_status'])) {
            $status = $clean['midh_project_status'];
            update_post_meta($post_id, 'status', $status);
            update_post_meta($post_id, 'status_label', isset($allowed_statuses[$status]) ? $allowed_statuses[$status] : 'Projet actif');
        }

        if (isset($clean['midh_project_period'])) {
            update_post_meta($post_id, 'period', $clean['midh_project_period']);
        }

        if (isset($clean['midh_project_location'])) {
            update_post_meta($post_id, 'location', $clean['midh_project_location']);
        }
    }

    public function render_document_meta_box($post) {
        wp_nonce_field('midh_document_meta_save', 'midh_document_nonce');
        $file_url = get_post_meta($post->ID, 'file_url', true) ?: '';
        $file_size = get_post_meta($post->ID, 'file_size', true) ?: '';
        $file_format = get_post_meta($post->ID, 'file_format', true) ?: 'PDF';
        $category = get_post_meta($post->ID, 'category', true) ?: 'rapport_annuel';
        $pub_date = get_post_meta($post->ID, 'publication_date', true) ?: date_i18n('F Y');
        $file_name = $file_url ? basename(parse_url($file_url, PHP_URL_PATH)) : '';
        ?>
        <div style="background: #ffffff; padding: 6px 0;">
            <!-- Zone de téléversement Media Library PDF -->
            <div style="background: #f8faf9; border: 2px dashed #006b1f; border-radius: 12px; padding: 22px; text-align: center; margin-bottom: 20px;">
                <div style="font-size: 38px; margin-bottom: 8px;">📄</div>
                <h4 style="margin: 0 0 6px 0; font-size: 15px; color: #0B3827; font-weight: 700;">
                    Fichier PDF du Rapport ou Document Officiel
                </h4>
                <p style="margin: 0 0 14px 0; font-size: 13px; color: #555;">
                    Téléversez le document PDF directement ou choisissez un fichier existant depuis la médiathèque WordPress.
                </p>

                <div id="midh_doc_preview_box" style="<?php echo $file_url ? 'display: inline-flex;' : 'display: none;'; ?> margin-bottom: 14px; background: #eef7f0; border: 1px solid #c2e2c9; border-radius: 8px; padding: 10px 16px; align-items: center; gap: 10px; max-width: 90%;">
                    <span class="dashicons dashicons-pdf" style="color: #c92a2a; font-size: 22px; width: 22px; height: 22px;"></span>
                    <span id="midh_doc_preview_name" style="font-weight: 600; color: #0B3827; font-size: 13px; word-break: break-all;">
                        <?php echo esc_html($file_name ?: 'Document PDF sélectionné'); ?>
                    </span>
                    <a id="midh_doc_preview_link" href="<?php echo esc_url($file_url); ?>" target="_blank" rel="noopener noreferrer" style="color: #006b1f; font-size: 12px; text-decoration: underline; margin-left: 6px;">
                        Tester l'ouverture du PDF &nearr;
                    </a>
                </div>

                <div>
                    <button type="button" id="midh_upload_doc_btn" class="button button-primary" style="background: #006b1f; border-color: #005217; padding: 6px 18px; font-weight: 600; font-size: 13px;">
                        <?php echo $file_url ? '📄 Remplacer le fichier PDF' : '📄 Téléverser / Choisir le fichier PDF'; ?>
                    </button>
                    <button type="button" id="midh_remove_doc_btn" class="button" style="<?php echo $file_url ? '' : 'display:none;'; ?> color: #b32d2e; border-color: #e0a3a3; margin-left: 8px;">
                        Supprimer le fichier
                    </button>
                </div>
            </div>

            <!-- Grille de métadonnées -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div style="grid-column: span 2;">
                    <label for="midh_doc_file_url" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                        URL directe du fichier PDF :
                    </label>
                    <input type="url" name="midh_doc_file_url" id="midh_doc_file_url" value="<?php echo esc_url($file_url); ?>" placeholder="https://.../document.pdf" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7; padding: 0 10px;" />
                    <p style="font-size: 11px; color: #666; margin: 4px 0 0 0;">Ce champ est automatiquement rempli lorsque vous sélectionnez un fichier ci-dessus.</p>
                </div>

                <div>
                    <label for="midh_doc_category" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                        Catégorie / Badge du document :
                    </label>
                    <select name="midh_doc_category" id="midh_doc_category" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7;">
                        <option value="rapport_annuel" <?php selected($category, 'rapport_annuel'); ?>>📊 Rapport annuel d'activités</option>
                        <option value="declaration" <?php selected($category, 'declaration'); ?>>⚖️ Déclaration &amp; Communiqué officiel</option>
                        <option value="guide" <?php selected($category, 'guide'); ?>>📘 Guide juridique &amp; Manuel citoyen</option>
                        <option value="etude" <?php selected($category, 'etude'); ?>>📑 Étude thématique &amp; Enquête</option>
                    </select>
                </div>

                <div>
                    <label for="midh_doc_file_size" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                        Taille du document (ex: 2.4 Mo) :
                    </label>
                    <input type="text" name="midh_doc_file_size" id="midh_doc_file_size" value="<?php echo esc_attr($file_size); ?>" placeholder="ex: 2.4 Mo" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7; padding: 0 10px;" />
                    <p style="font-size: 11px; color: #666; margin: 4px 0 0 0;">Calculée automatiquement lors de la sélection du fichier.</p>
                </div>

                <div>
                    <label for="midh_doc_pub_date" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                        Date de publication (ex: Octobre 2026) :
                    </label>
                    <input type="text" name="midh_doc_pub_date" id="midh_doc_pub_date" value="<?php echo esc_attr($pub_date); ?>" placeholder="ex: Octobre 2026" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7; padding: 0 10px;" />
                </div>

                <div>
                    <label for="midh_doc_file_format" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                        Format de fichier (ex: PDF) :
                    </label>
                    <input type="text" name="midh_doc_file_format" id="midh_doc_file_format" value="<?php echo esc_attr($file_format); ?>" placeholder="PDF" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7; padding: 0 10px;" />
                </div>
            </div>

            <div style="background: #f6faf5; border-left: 4px solid #006b1f; padding: 12px 14px; border-radius: 4px; margin-top: 16px;">
                <p style="margin: 0; font-size: 13px; color: #2d4336;">
                    💡 <strong>Description du document :</strong> Renseignez le champ <em>« Extrait »</em> ou rédigez une courte présentation dans le corps principal de l'article pour résumer les conclusions ou le sujet du document. Ce texte apparaîtra sur la carte de téléchargement.
                </p>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            var docUploader;
            $('#midh_upload_doc_btn').on('click', function(e) {
                e.preventDefault();
                if (docUploader) {
                    docUploader.open();
                    return;
                }
                docUploader = wp.media({
                    title: 'Sélectionner ou téléverser le document PDF',
                    button: { text: 'Insérer ce document PDF' },
                    multiple: false
                });
                docUploader.on('select', function() {
                    var attachment = docUploader.state().get('selection').first().toJSON();
                    var url = attachment.url || '';
                    $('#midh_doc_file_url').val(url);

                    // Calcul de la taille lisible
                    if (attachment.filesizeHumanReadable) {
                        $('#midh_doc_file_size').val(attachment.filesizeHumanReadable);
                    } else if (attachment.filesizeInBytes) {
                        var bytes = attachment.filesizeInBytes;
                        var sizeStr = bytes > 1048576 ? (bytes / 1048576).toFixed(1) + ' Mo' : Math.round(bytes / 1024) + ' Ko';
                        $('#midh_doc_file_size').val(sizeStr);
                    }

                    // Format de fichier
                    if (attachment.filename && attachment.filename.toLowerCase().endsWith('.docx')) {
                        $('#midh_doc_file_format').val('DOCX');
                    } else {
                        $('#midh_doc_file_format').val('PDF');
                    }

                    // Auto-remplissage du titre si vide
                    var titleInput = $('#title');
                    if (titleInput.length && !titleInput.val().trim() && attachment.title) {
                        titleInput.val(attachment.title);
                    }

                    // Aperçu du document
                    $('#midh_doc_preview_name').text(attachment.filename || attachment.title || 'Fichier PDF');
                    $('#midh_doc_preview_link').attr('href', url);
                    $('#midh_doc_preview_box').css('display', 'inline-flex');
                    $('#midh_remove_doc_btn').show();
                    $('#midh_upload_doc_btn').html('📄 Remplacer le fichier PDF');
                });
                docUploader.open();
            });

            $('#midh_remove_doc_btn').on('click', function(e) {
                e.preventDefault();
                $('#midh_doc_file_url').val('');
                $('#midh_doc_file_size').val('');
                $('#midh_doc_preview_box').hide();
                $(this).hide();
                $('#midh_upload_doc_btn').html('📄 Téléverser / Choisir le fichier PDF');
            });
        });
        </script>
        <?php
    }

    public function save_midh_document_meta_box($post_id, $post) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Définition explicite du schéma d'entrée à la frontière de l'API
        $schema = array(
            'midh_document_nonce'  => array('type' => 'string', 'max_length' => 100),
            'midh_doc_file_url'    => array('type' => 'string', 'sanitize' => 'url', 'validate' => 'url'),
            'midh_doc_category'    => array('type' => 'string', 'enum' => array('rapport_annuel', 'declaration', 'guide', 'etude'), 'default' => 'rapport_annuel'),
            'midh_doc_file_size'   => array('type' => 'string', 'max_length' => 50),
            'midh_doc_file_format' => array('type' => 'string', 'max_length' => 20),
            'midh_doc_pub_date'    => array('type' => 'string', 'max_length' => 100),
        );
        $clean = self::validate_request_payload($_POST, $schema);

        $nonce = isset($clean['midh_document_nonce']) ? $clean['midh_document_nonce'] : '';
        if (empty($nonce) || !wp_verify_nonce($nonce, 'midh_document_meta_save')) {
            return;
        }

        if (isset($clean['midh_doc_file_url'])) {
            update_post_meta($post_id, 'file_url', $clean['midh_doc_file_url']);
        }

        if (isset($clean['midh_doc_category'])) {
            $cat = $clean['midh_doc_category'];
            update_post_meta($post_id, 'category', $cat);
            $cat_labels = array(
                'rapport_annuel' => 'Rapport annuel',
                'declaration'    => 'Déclaration officielle',
                'guide'          => 'Guide & Manuel',
                'etude'          => 'Étude thématique',
            );
            $cat_label = isset($cat_labels[$cat]) ? $cat_labels[$cat] : 'Rapport annuel';
            update_post_meta($post_id, 'category_label', $cat_label);
        }

        if (isset($clean['midh_doc_file_size'])) {
            update_post_meta($post_id, 'file_size', $clean['midh_doc_file_size']);
        }

        if (isset($clean['midh_doc_file_format'])) {
            update_post_meta($post_id, 'file_format', $clean['midh_doc_file_format']);
        }

        if (isset($clean['midh_doc_pub_date'])) {
            update_post_meta($post_id, 'publication_date', $clean['midh_doc_pub_date']);
        }
    }

    public function render_team_meta_box($post) {
        wp_nonce_field('midh_team_meta_save', 'midh_team_nonce');
        $role = get_post_meta($post->ID, 'role', true) ?: '';
        $photo_url = get_post_meta($post->ID, 'photo_url', true) ?: '';
        if (!$photo_url && has_post_thumbnail($post->ID)) {
            $photo_url = get_the_post_thumbnail_url($post->ID, 'large');
        }
        $biography = get_post_meta($post->ID, 'biography', true) ?: '';
        $email = get_post_meta($post->ID, 'email', true) ?: '';
        $linkedin = get_post_meta($post->ID, 'linkedin', true) ?: '';
        $twitter = get_post_meta($post->ID, 'twitter', true) ?: '';
        ?>
        <style>
            .midh-profile-app {
                display: grid;
                grid-template-columns: 240px 1fr;
                gap: 24px;
                padding: 14px 0;
            }
            @media (max-width: 820px) {
                .midh-profile-app {
                    grid-template-columns: 1fr;
                }
            }
            .midh-photo-box {
                background: #f8fafc;
                border: 2px dashed #cbd5e1;
                border-radius: 12px;
                padding: 16px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
            }
            .midh-photo-preview {
                width: 170px;
                height: 220px;
                border-radius: 10px;
                object-fit: cover;
                border: 3px solid #006b1f;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                margin-bottom: 12px;
                background: #e2e8f0;
            }
            .midh-photo-placeholder {
                width: 170px;
                height: 220px;
                border-radius: 10px;
                background: #f1f5f9;
                border: 2px dashed #94a3b8;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #64748b;
                margin-bottom: 12px;
            }
            .midh-field-group {
                margin-bottom: 16px;
            }
            .midh-label {
                display: block;
                font-weight: 700;
                color: #0B3827;
                font-size: 13px;
                margin-bottom: 6px;
            }
            .midh-input {
                width: 100%;
                height: 38px;
                border-radius: 6px;
                border: 1px solid #cbd5e1;
                padding: 0 10px;
                font-size: 14px;
                box-sizing: border-box;
            }
            .midh-input:focus, .midh-textarea:focus {
                border-color: #006b1f !important;
                outline: 2px solid rgba(0,107,31,0.2) !important;
            }
            .midh-textarea {
                width: 100%;
                border-radius: 6px;
                border: 1px solid #cbd5e1;
                padding: 8px 10px;
                font-size: 13px;
                box-sizing: border-box;
                resize: vertical;
            }
            .midh-social-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 12px;
            }
            @media (max-width: 900px) {
                .midh-social-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>

        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-left: 4px solid #006b1f; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: #0B3827; font-size: 14px;">
                <span class="dashicons dashicons-id-alt" style="color: #006b1f; font-size: 20px;"></span>
                <?php _e('Fiche Profil du Responsable — Organigramme Officiel MIDH', 'midh-headless'); ?>
            </div>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #166534;">
                <?php _e('Renseignez les détails ci-dessous. Le résultat s\'affiche automatiquement sous forme de Carte Portrait moderne sur le site public Next.js (section Gouvernance).', 'midh-headless'); ?>
            </p>
        </div>

        <div class="midh-profile-app">
            <!-- Colonne Gauche : Photo de portrait -->
            <div class="midh-photo-box">
                <span class="midh-label"><?php _e('Photo de portrait officielle', 'midh-headless'); ?></span>
                
                <img id="midh_team_photo_img" src="<?php echo esc_url($photo_url); ?>" class="midh-photo-preview" style="<?php echo empty($photo_url) ? 'display:none;' : ''; ?>" alt="Aperçu photo" />
                
                <div id="midh_team_photo_empty" class="midh-photo-placeholder" style="<?php echo !empty($photo_url) ? 'display:none;' : ''; ?>">
                    <span class="dashicons dashicons-format-image" style="font-size: 40px; height: 40px; width: 40px; margin-bottom: 8px; color: #94a3b8;"></span>
                    <span style="font-size: 12px;"><?php _e('Aucune photo', 'midh-headless'); ?></span>
                </div>

                <input type="hidden" name="midh_team_photo_url" id="midh_team_photo_url" value="<?php echo esc_url($photo_url); ?>" />
                
                <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
                    <button type="button" id="midh_upload_photo_btn" class="button button-primary" style="background: #006b1f; border-color: #006b1f; font-weight: 600;">
                        📸 <?php echo !empty($photo_url) ? __('Changer la photo', 'midh-headless') : __('Choisir une photo', 'midh-headless'); ?>
                    </button>
                    <button type="button" id="midh_remove_photo_btn" class="button" style="color: #b91c1c; <?php echo empty($photo_url) ? 'display:none;' : ''; ?>">
                        <?php _e('Retirer la photo', 'midh-headless'); ?>
                    </button>
                </div>
                <p style="font-size: 11px; color: #64748b; margin-top: 8px; line-height: 1.4;">
                    <?php _e('Format portrait recommandé (JPG/PNG/WebP).', 'midh-headless'); ?>
                </p>
            </div>

            <!-- Colonne Droite : Formulaire complet du profil -->
            <div>
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
                    <div class="midh-field-group">
                        <label for="midh_team_role" class="midh-label">
                            <?php _e('Fonction / Poste officiel au sein du MIDH', 'midh-headless'); ?> <span style="color: #dc2626;">*</span>
                        </label>
                        <input type="text" name="midh_team_role" id="midh_team_role" value="<?php echo esc_attr($role); ?>" class="midh-input" placeholder="ex: Secrétaire Général, Président du CA..." required />
                        <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">
                            <?php _e('Ce titre s\'affiche dans le badge vert émeraude sur la carte.', 'midh-headless'); ?>
                        </p>
                    </div>

                    <div class="midh-field-group">
                        <label for="menu_order" class="midh-label">
                            <?php _e('Ordre hiérarchique', 'midh-headless'); ?>
                        </label>
                        <input type="number" name="menu_order" id="menu_order" value="<?php echo esc_attr($post->menu_order); ?>" class="midh-input" min="0" placeholder="1, 2, 3..." />
                        <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">
                            <?php _e('1 = Président, 2 = Secrétaire Général...', 'midh-headless'); ?>
                        </p>
                    </div>
                </div>

                <div class="midh-field-group">
                    <label for="midh_team_biography" class="midh-label">
                        <?php _e('Biographie courte / Présentation du parcours', 'midh-headless'); ?>
                    </label>
                    <textarea name="midh_team_biography" id="midh_team_biography" rows="3" class="midh-textarea" placeholder="ex: Juriste de formation, engagé depuis plus de 15 ans au sein du MIDH pour la défense des libertés fondamentales et l'assistance juridique de proximité..."><?php echo esc_textarea($biography); ?></textarea>
                    <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">
                        <?php _e('Résumé synthétique affiché sous le nom sur la carte.', 'midh-headless'); ?>
                    </p>
                </div>

                <div class="midh-field-group">
                    <label class="midh-label"><?php _e('Coordonnées & Réseaux Professionnels (optionnel)', 'midh-headless'); ?></label>
                    <div class="midh-social-grid">
                        <div>
                            <input type="email" name="midh_team_email" id="midh_team_email" value="<?php echo esc_attr($email); ?>" class="midh-input" placeholder="✉️ Email professionnel" />
                        </div>
                        <div>
                            <input type="url" name="midh_team_linkedin" id="midh_team_linkedin" value="<?php echo esc_url($linkedin); ?>" class="midh-input" placeholder="🔗 LinkedIn (https://...)" />
                        </div>
                        <div>
                            <input type="url" name="midh_team_twitter" id="midh_team_twitter" value="<?php echo esc_url($twitter); ?>" class="midh-input" placeholder="✖️ Twitter / X (https://...)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
        jQuery(document).ready(function($) {
            var mediaUploader;
            $('#midh_upload_photo_btn').on('click', function(e) {
                e.preventDefault();
                if (mediaUploader) {
                    mediaUploader.open();
                    return;
                }
                mediaUploader = wp.media({
                    title: 'Choisir la photo officielle du membre',
                    button: { text: 'Sélectionner cette photo' },
                    multiple: false,
                    library: { type: 'image' }
                });
                mediaUploader.on('select', function() {
                    var attachment = mediaUploader.state().get('selection').first().toJSON();
                    var url = attachment.sizes && attachment.sizes.large ? attachment.sizes.large.url : attachment.url;
                    $('#midh_team_photo_url').val(url);
                    $('#midh_team_photo_img').attr('src', url).show();
                    $('#midh_team_photo_empty').hide();
                    $('#midh_remove_photo_btn').show();
                    $('#midh_upload_photo_btn').html('📸 Changer la photo');
                });
                mediaUploader.open();
            });

            $('#midh_remove_photo_btn').on('click', function(e) {
                e.preventDefault();
                $('#midh_team_photo_url').val('');
                $('#midh_team_photo_img').attr('src', '').hide();
                $('#midh_team_photo_empty').show();
                $(this).hide();
                $('#midh_upload_photo_btn').html('📸 Choisir une photo');
            });
        });
        </script>
        <?php
    }

    public function save_midh_team_meta_box($post_id, $post) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Définition explicite du schéma d'entrée à la frontière de l'API
        $schema = array(
            'midh_team_nonce'     => array('type' => 'string', 'max_length' => 100),
            'midh_team_role'      => array('type' => 'string', 'max_length' => 150),
            'midh_team_photo_url' => array('type' => 'string', 'sanitize' => 'url', 'validate' => 'url'),
            'midh_team_biography' => array('type' => 'string', 'max_length' => 1000),
            'midh_team_email'     => array('type' => 'string', 'max_length' => 120),
            'midh_team_linkedin'  => array('type' => 'string', 'sanitize' => 'url', 'validate' => 'url'),
            'midh_team_twitter'   => array('type' => 'string', 'sanitize' => 'url', 'validate' => 'url'),
            'menu_order'          => array('type' => 'int', 'min' => 0),
        );
        $clean = self::validate_request_payload($_POST, $schema);

        $nonce = isset($clean['midh_team_nonce']) ? $clean['midh_team_nonce'] : '';
        if (empty($nonce) || !wp_verify_nonce($nonce, 'midh_team_meta_save')) {
            return;
        }

        if (isset($clean['midh_team_role'])) {
            update_post_meta($post_id, 'role', $clean['midh_team_role']);
        }

        if (isset($clean['midh_team_photo_url'])) {
            update_post_meta($post_id, 'photo_url', $clean['midh_team_photo_url']);
            if (!empty($clean['midh_team_photo_url'])) {
                $attachment_id = attachment_url_to_postid($clean['midh_team_photo_url']);
                if ($attachment_id) {
                    set_post_thumbnail($post_id, $attachment_id);
                }
            }
        }

        if (isset($clean['midh_team_biography'])) {
            update_post_meta($post_id, 'biography', $clean['midh_team_biography']);
        }

        if (isset($clean['midh_team_email'])) {
            update_post_meta($post_id, 'email', $clean['midh_team_email']);
        }

        if (isset($clean['midh_team_linkedin'])) {
            update_post_meta($post_id, 'linkedin', $clean['midh_team_linkedin']);
        }

        if (isset($clean['midh_team_twitter'])) {
            update_post_meta($post_id, 'twitter', $clean['midh_team_twitter']);
        }

        if (isset($clean['menu_order'])) {
            remove_action('save_post_midh_team', array($this, 'save_midh_team_meta_box'));
            wp_update_post(array(
                'ID'         => $post_id,
                'menu_order' => $clean['menu_order'],
            ));
            add_action('save_post_midh_team', array($this, 'save_midh_team_meta_box'), 10, 2);
        }
    }

    public function custom_enter_title_placeholder($title, $post) {
        if (is_object($post)) {
            if ($post->post_type === 'midh_team') {
                return __('Nom & Prénoms du responsable (ex: Me Drissa Bamba)', 'midh-headless');
            } elseif ($post->post_type === 'midh_project') {
                return __('Titre officiel du projet ou programme de terrain', 'midh-headless');
            } elseif ($post->post_type === 'midh_document') {
                return __('Titre officiel du rapport ou document PDF', 'midh-headless');
            } elseif ($post->post_type === 'midh_slide') {
                return __('Titre de la diapositive (ex: Dialogue citoyen de terrain)', 'midh-headless');
            }
        }
        return $title;
    }

    public function disable_gutenberg_for_team($use_block_editor, $post_type) {
        if ($post_type === 'midh_team' || $post_type === 'midh_document' || $post_type === 'midh_slide') {
            return false;
        }
        return $use_block_editor;
    }

    /**
     * 14. Modernisation de l'interface du Newsroom Studio (Articles & Publications)
     */
    public function customize_article_columns($columns) {
        global $typenow;
        if ($typenow !== 'post') {
            return $columns;
        }

        $new_columns = array();
        if (isset($columns['cb'])) {
            $new_columns['cb'] = $columns['cb'];
        }
        $new_columns['midh_thumbnail']     = __('Visuel', 'midh-headless');
        $new_columns['title']              = __('Article & Titre', 'midh-headless');
        if (isset($columns['categories'])) {
            $new_columns['categories']     = __('Rubriques', 'midh-headless');
        }
        $new_columns['midh_action_domain'] = __('Axe Thématique', 'midh-headless');
        if (isset($columns['author'])) {
            $new_columns['author']         = __('Auteur', 'midh-headless');
        }
        if (isset($columns['date'])) {
            $new_columns['date']           = __('Date de publication', 'midh-headless');
        }

        return $new_columns;
    }

    public function render_article_custom_column($column, $post_id) {
        if ($column === 'midh_thumbnail') {
            if (has_post_thumbnail($post_id)) {
                $thumb_url = get_the_post_thumbnail_url($post_id, 'medium');
                echo '<div class="midh-table-thumb-wrap"><img src="' . esc_url($thumb_url) . '" alt="" class="midh-table-thumb" loading="lazy" /></div>';
            } else {
                echo '<div class="midh-table-thumb-wrap midh-table-thumb-empty"><span class="dashicons dashicons-format-image"></span></div>';
            }
        } elseif ($column === 'midh_action_domain') {
            $terms = get_the_terms($post_id, 'midh_domain');
            if (!empty($terms) && !is_wp_error($terms)) {
                $out = array();
                foreach ($terms as $term) {
                    $link = esc_url(add_query_arg(array('post_type' => 'post', 'midh_domain' => $term->slug), 'edit.php'));
                    $out[] = '<a href="' . $link . '" class="midh-domain-badge"><span class="midh-badge-dot"></span>' . esc_html($term->name) . '</a>';
                }
                echo implode(' ', $out);
            } else {
                echo '<span class="midh-empty-badge">—</span>';
            }
        }
    }

    public function customize_article_row_actions($actions, $post) {
        if ($post->post_type === 'post') {
            $frontend_base = rtrim(get_option('midh_frontend_url', 'http://localhost:3000'), '/');
            $preview_url = esc_url($frontend_base . '/actualites/' . $post->post_name);
            
            $actions['midh_nextjs_preview'] = '<a href="' . $preview_url . '" target="_blank" rel="noopener noreferrer" class="midh-row-action-nextjs"><span class="dashicons dashicons-external"></span> ' . __('Voir sur Next.js', 'midh-headless') . '</a>';
        }
        return $actions;
    }

    public function render_newsroom_header_banner() {
        global $pagenow, $typenow;
        if ($pagenow === 'edit.php' && $typenow === 'post') {
            $counts = wp_count_posts('post');
            $published = isset($counts->publish) ? intval($counts->publish) : 0;
            $drafts = isset($counts->draft) ? intval($counts->draft) : 0;
            $frontend_url = esc_url(rtrim(get_option('midh_frontend_url', 'http://localhost:3000'), '/') . '/actualites');
            ?>
            <div class="midh-newsroom-banner">
                <div class="midh-newsroom-banner-left">
                    <div class="midh-newsroom-icon">
                        <span class="dashicons dashicons-media-document"></span>
                    </div>
                    <div class="midh-newsroom-info">
                        <div class="midh-newsroom-tag"><?php esc_html_e('Espace Rédaction & Médias', 'midh-headless'); ?></div>
                        <h2><?php esc_html_e('Newsroom Studio • Actualités & Plaidoyers MIDH', 'midh-headless'); ?></h2>
                        <p><?php esc_html_e('Gérez, illustrez et publiez vos alertes, enquêtes et communiqués officiels synchronisés en temps réel avec le portail public Next.js.', 'midh-headless'); ?></p>
                    </div>
                </div>
                <div class="midh-newsroom-banner-right">
                    <div class="midh-newsroom-kpis">
                        <div class="midh-newsroom-kpi">
                            <span class="midh-kpi-val"><?php echo esc_html($published); ?></span>
                            <span class="midh-kpi-lbl"><?php esc_html_e('En ligne', 'midh-headless'); ?></span>
                        </div>
                        <div class="midh-newsroom-kpi">
                            <span class="midh-kpi-val"><?php echo esc_html($drafts); ?></span>
                            <span class="midh-kpi-lbl"><?php esc_html_e('Brouillons', 'midh-headless'); ?></span>
                        </div>
                    </div>
                    <div class="midh-newsroom-actions">
                        <a href="<?php echo esc_url(admin_url('post-new.php')); ?>" class="midh-banner-btn midh-banner-btn-primary">
                            <span class="dashicons dashicons-plus-alt2"></span>
                            <?php esc_html_e('Nouvel Article', 'midh-headless'); ?>
                        </a>
                        <a href="<?php echo $frontend_url; ?>" target="_blank" rel="noopener noreferrer" class="midh-banner-btn midh-banner-btn-secondary">
                            <span class="dashicons dashicons-external"></span>
                            <?php esc_html_e('Portail Actualités', 'midh-headless'); ?>
                        </a>
                    </div>
                </div>
            </div>
            <?php
        }
    }

    /**
     * 15. Gestion des Diapositives du Carrousel d'Accueil (midh_slide)
     */
    public function render_slide_meta_box($post) {
        wp_nonce_field('midh_slide_meta_save', 'midh_slide_nonce');
        $desc = get_post_meta($post->ID, '_midh_slide_desc', true) ?: '';
        $tag  = get_post_meta($post->ID, '_midh_slide_tag', true) ?: 'Présence active';
        $icon = get_post_meta($post->ID, '_midh_slide_icon', true) ?: 'diversity_3';
        ?>
        <div style="display: flex; flex-direction: column; gap: 16px; padding: 12px 0;">
            <div>
                <label for="midh_slide_desc" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                    <?php _e('Sous-titre / Description de la diapositive :', 'midh-headless'); ?>
                </label>
                <textarea name="midh_slide_desc" id="midh_slide_desc" rows="2" style="width: 100%; border-radius: 6px; border: 1px solid #c3d0c7;" placeholder="Ex: Sensibilisation civique et écoute des populations locales"><?php echo esc_textarea($desc); ?></textarea>
                <p class="description"><?php _e('Texte descriptif affiché sous le grand titre dans le badge flottant du carrousel.', 'midh-headless'); ?></p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                    <label for="midh_slide_tag" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                        <?php _e('Badge / Statut affiché à droite :', 'midh-headless'); ?>
                    </label>
                    <input type="text" name="midh_slide_tag" id="midh_slide_tag" value="<?php echo esc_attr($tag); ?>" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7;" placeholder="Ex: Présence active, Éducation civique, Défense & Conseil..." />
                </div>
                <div>
                    <label for="midh_slide_icon" style="display: block; font-weight: 600; margin-bottom: 6px; color: #0B3827;">
                        <?php _e('Icône Material Symbols :', 'midh-headless'); ?>
                    </label>
                    <select name="midh_slide_icon" id="midh_slide_icon" style="width: 100%; height: 38px; border-radius: 6px; border: 1px solid #c3d0c7;">
                        <option value="diversity_3" <?php selected($icon, 'diversity_3'); ?>>👥 diversity_3 (Communauté / Dialogue)</option>
                        <option value="school" <?php selected($icon, 'school'); ?>>🎓 school (Formation / Éducation)</option>
                        <option value="gavel" <?php selected($icon, 'gavel'); ?>>⚖️ gavel (Justice / Juridique)</option>
                        <option value="campaign" <?php selected($icon, 'campaign'); ?>>📢 campaign (Plaidoyer / Alerte)</option>
                        <option value="handshake" <?php selected($icon, 'handshake'); ?>>🤝 handshake (Partenariat / Paix)</option>
                        <option value="security" <?php selected($icon, 'security'); ?>>🛡️ security (Protection des droits)</option>
                    </select>
                </div>
            </div>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; color: #166534; font-size: 13px;">
                💡 <strong>Image de la diapositive :</strong> Définissez la photo dans le bloc <strong>« Image mise en avant »</strong> à droite. Elle sera automatiquement optimisée au format WebP et affichée dans le carrousel Next.js.
            </div>
        </div>
        <?php
    }

    public function save_midh_slide_meta_box($post_id, $post) {
        if (!isset($_POST['midh_slide_nonce'])) {
            return;
        }

        $schema = array(
            'midh_slide_nonce' => array('type' => 'string', 'max_length' => 128),
            'midh_slide_desc'  => array('type' => 'string', 'max_length' => 500),
            'midh_slide_tag'   => array('type' => 'string', 'max_length' => 80),
            'midh_slide_icon'  => array('type' => 'string', 'max_length' => 60),
            'menu_order'       => array('type' => 'int', 'min' => 0),
        );
        $clean = self::validate_request_payload($_POST, $schema);

        $nonce = isset($clean['midh_slide_nonce']) ? $clean['midh_slide_nonce'] : '';
        if (empty($nonce) || !wp_verify_nonce($nonce, 'midh_slide_meta_save')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        if (isset($clean['midh_slide_desc'])) {
            update_post_meta($post_id, '_midh_slide_desc', $clean['midh_slide_desc']);
        }
        if (isset($clean['midh_slide_tag'])) {
            update_post_meta($post_id, '_midh_slide_tag', $clean['midh_slide_tag']);
        }
        if (isset($clean['midh_slide_icon'])) {
            update_post_meta($post_id, '_midh_slide_icon', $clean['midh_slide_icon']);
        }
    }

    public function customize_slide_columns($columns) {
        $new_columns = array();
        if (isset($columns['cb'])) {
            $new_columns['cb'] = $columns['cb'];
        }
        $new_columns['midh_thumbnail']   = __('Visuel', 'midh-headless');
        $new_columns['title']            = __('Titre de la diapositive', 'midh-headless');
        $new_columns['midh_slide_desc']  = __('Sous-titre / Description', 'midh-headless');
        $new_columns['midh_slide_tag']   = __('Badge / Statut', 'midh-headless');
        $new_columns['midh_slide_order'] = __('Ordre', 'midh-headless');
        if (isset($columns['date'])) {
            $new_columns['date']         = __('Date', 'midh-headless');
        }
        return $new_columns;
    }

    public function render_slide_custom_column($column, $post_id) {
        if ($column === 'midh_thumbnail') {
            if (has_post_thumbnail($post_id)) {
                $thumb_url = get_the_post_thumbnail_url($post_id, 'medium');
                echo '<div class="midh-table-thumb-wrap"><img src="' . esc_url($thumb_url) . '" alt="" class="midh-table-thumb" loading="lazy" /></div>';
            } else {
                echo '<div class="midh-table-thumb-wrap midh-table-thumb-empty"><span class="dashicons dashicons-format-image"></span></div>';
            }
        } elseif ($column === 'midh_slide_desc') {
            $desc = get_post_meta($post_id, '_midh_slide_desc', true);
            echo esc_html($desc ?: '—');
        } elseif ($column === 'midh_slide_tag') {
            $tag = get_post_meta($post_id, '_midh_slide_tag', true);
            if ($tag) {
                echo '<span class="midh-domain-badge"><span class="midh-badge-dot"></span>' . esc_html($tag) . '</span>';
            } else {
                echo '—';
            }
        } elseif ($column === 'midh_slide_order') {
            echo intval(get_post_field('menu_order', $post_id));
        }
    }

    public function get_slides_endpoint() {
        $query = new WP_Query(array(
            'post_type'      => 'midh_slide',
            'post_status'    => 'publish',
            'posts_per_page' => 10,
            'orderby'        => 'menu_order title',
            'order'          => 'ASC',
        ));

        $slides = array();
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $id = get_the_ID();
                $img_url = get_the_post_thumbnail_url($id, 'full') ?: '';

                $slides[] = array(
                    'id'    => $id,
                    'title' => get_the_title(),
                    'desc'  => get_post_meta($id, '_midh_slide_desc', true) ?: '',
                    'tag'   => get_post_meta($id, '_midh_slide_tag', true) ?: 'Présence active',
                    'icon'  => get_post_meta($id, '_midh_slide_icon', true) ?: 'diversity_3',
                    'image' => $img_url,
                    'alt'   => get_the_title() . ' - MIDH Côte d\'Ivoire',
                    'order' => intval(get_post_field('menu_order', $id)),
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($slides, 200);
    }

    public function get_documents_endpoint() {
        $query = new WP_Query(array(
            'post_type'      => 'midh_document',
            'post_status'    => 'publish',
            'posts_per_page' => 100,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ));

        $documents = array();
        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $id = get_the_ID();
                $file_url = get_post_meta($id, 'file_url', true) ?: '';
                $file_size = get_post_meta($id, 'file_size', true) ?: 'PDF';
                $file_format = get_post_meta($id, 'file_format', true) ?: 'PDF';
                $category = get_post_meta($id, 'category', true) ?: 'rapport_annuel';
                $category_label = get_post_meta($id, 'category_label', true);
                if (!$category_label) {
                    $cat_labels = array(
                        'rapport_annuel' => 'Rapport annuel',
                        'declaration'    => 'Déclaration officielle',
                        'guide'          => 'Guide & Manuel',
                        'etude'          => 'Étude thématique',
                    );
                    $category_label = isset($cat_labels[$category]) ? $cat_labels[$category] : 'Document officiel';
                }
                $pub_date = get_post_meta($id, 'publication_date', true) ?: get_the_date('F Y');

                $documents[] = array(
                    'id'              => $id,
                    'title'           => get_the_title(),
                    'slug'            => get_post_field('post_name', $id),
                    'excerpt'         => get_the_excerpt() ?: wp_trim_words(strip_shortcodes(get_the_content()), 30, '...'),
                    'fileUrl'         => $file_url,
                    'fileSize'        => $file_size,
                    'fileFormat'      => $file_format,
                    'category'        => $category,
                    'categoryLabel'   => $category_label,
                    'publicationDate' => $pub_date,
                );
            }
            wp_reset_postdata();
        }

        return new WP_REST_Response($documents, 200);
    }
}

new MIDH_Headless_Core();


