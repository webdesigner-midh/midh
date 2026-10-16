'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [honeyPot, setHoneyPot] = useState('');
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consent,
          website_trap: honeyPot,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({ text: data.message, isError: false });
        setEmail('');
      } else {
        setStatusMessage({
          text: data.message || "Une erreur est survenue lors de l'inscription.",
          isError: true,
        });
      }
    } catch {
      setStatusMessage({
        text: 'Erreur réseau. Veuillez réessayer ultérieurement.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-background py-space-xl sm:py-space-2xl border-t border-outline-variant/30">
      <div className="site-container">
        <div className="bg-surface-container-lowest p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row items-center justify-between gap-space-lg lg:gap-space-xl">
          {/* Texte explicatif */}
          <div className="flex flex-col gap-2 max-w-xl text-center lg:text-left">
            <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
              Lettre d&apos;information
            </span>
            <h2 className="font-display text-xl sm:text-2xl md:text-headline-sm text-[#0B3827] font-bold">
              Restez informés de nos actions.
            </h2>
            <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
              Recevez les alertes, actualités, rapports et publications du MIDH directement dans votre boîte e-mail. Nous protégeons rigoureusement vos données personnelles.
            </p>
          </div>

          {/* Formulaire fonctionnel */}
          <div className="w-full lg:w-auto flex-grow max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Champ Honeypot invisible pour les robots */}
                <input
                  type="text"
                  name="website_trap"
                  value={honeyPot}
                  onChange={(e) => setHoneyPot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <input
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-outline-variant/40"
                  placeholder="votre.email@domaine.ci"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="shrink-0 bg-[#138A2E] hover:bg-[#0F7326] disabled:opacity-50 text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Envoi...' : "S'abonner"}</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>

              {/* Statut de la requête */}
              {statusMessage && (
                <div
                  className={`p-3 rounded-lg text-body-sm ${
                    statusMessage.isError
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-800 border border-green-200'
                  }`}
                  role="alert"
                >
                  {statusMessage.text}
                </div>
              )}

              <span className="block font-caption text-caption text-tertiary mt-1">
                Les informations recueillies sont destinées exclusivement aux communications du MIDH. Désinscription en 1 clic.
              </span>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
