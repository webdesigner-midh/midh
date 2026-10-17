'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

/**
 * Fonction globale exportée pour basculer la langue entre Français et Anglais Américain
 */
export function switchLanguage(target: 'FR' | 'EN') {
  if (typeof window === 'undefined') return;

  if (target === 'FR') {
    // Rétablissement du Français d'origine
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    document.cookie = 'googtrans=/fr/fr; path=/; SameSite=Lax';
    localStorage.setItem('midh_lang', 'FR');

    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = 'fr';
      select.dispatchEvent(new Event('change'));
    }
    // Rechargement fluide pour restaurer le DOM original sans artefacts
    window.location.reload();
  } else {
    // Traduction instantanée vers l'Anglais Américain
    document.cookie = `googtrans=/fr/en; path=/; domain=${window.location.hostname}; SameSite=Lax`;
    document.cookie = 'googtrans=/fr/en; path=/; SameSite=Lax';
    localStorage.setItem('midh_lang', 'EN');

    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = 'en';
      select.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // 1. Définition de l'initialiseur global attendu par Google
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'fr',
            includedLanguages: 'en,fr',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // 2. Injection du script officiel Google Translate s'il n'est pas déjà présent
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
