import sanitizeHtml from 'sanitize-html';

const ALLOWED_VIDEO_IFRAME_HOSTS = [
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'www.dailymotion.com',
];

/**
 * Échappement HTML strict pour l'interpolation sûre de données utilisateur dans des modèles e-mail HTML.
 */
export function escapeHtml(value: unknown): string {
  const str = String(value ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Nettoie un contenu HTML éditorial issu de WordPress avec une liste blanche stricte de balises et attributs.
 */
export function sanitizeRichHtml(html: string): string {
  if (!html) return '';

  const normalized = html.replace(/http:\/\/midh-cms\.local/g, 'https://cms.midh-ci.org');

  return sanitizeHtml(normalized, {
    allowedTags: [
      'p',
      'br',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'blockquote',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
      'code',
      'hr',
      'span',
      'div',
      'sub',
      'sup',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title', 'class'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
      figure: ['class'],
      figcaption: ['class'],
      table: ['class'],
      td: ['colspan', 'rowspan', 'class'],
      th: ['colspan', 'rowspan', 'scope', 'class'],
      span: ['class'],
      div: ['class'],
      p: ['class'],
      h1: ['class'],
      h2: ['class'],
      h3: ['class'],
      h4: ['class'],
      ul: ['class'],
      ol: ['class'],
      blockquote: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}

/**
 * Filtre strictement les codes d'intégration vidéo (iframes YouTube, Vimeo, Dailymotion uniquement).
 */
export function sanitizeVideoEmbed(html: string): string {
  if (!html) return '';

  return sanitizeHtml(html, {
    allowedTags: ['iframe'],
    allowedAttributes: {
      iframe: [
        'src',
        'width',
        'height',
        'title',
        'allow',
        'allowfullscreen',
        'frameborder',
        'referrerpolicy',
        'loading',
      ],
    },
    allowedSchemes: ['https'],
    allowProtocolRelative: false,
    allowedIframeHostnames: ALLOWED_VIDEO_IFRAME_HOSTS,
    transformTags: {
      iframe: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          referrerpolicy: attribs.referrerpolicy || 'strict-origin-when-cross-origin',
          loading: attribs.loading || 'lazy',
        },
      }),
    },
  });
}

