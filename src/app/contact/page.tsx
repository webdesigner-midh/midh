'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'general',
    subject: '',
    message: '',
    website_trap: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setFieldErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ text: data.message, isError: false });
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: 'general',
          subject: '',
          message: '',
          website_trap: '',
        });
      } else {
        setStatus({
          text: data.message || "Une erreur est survenue lors de l'envoi.",
          isError: true,
        });
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      }
    } catch {
      setStatus({
        text: 'Erreur réseau. Impossible de contacter le serveur actuellement.',
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-background pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-28">
      <div className="site-container flex flex-col gap-10 sm:gap-14">
        {/* En-tête */}
        <div className="max-w-3xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Coordination Nationale</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] text-[#0B3827] font-bold tracking-tight leading-snug">
            Contact &amp; Assistance Juridique
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
            Pour tout signalement de violation de droits humains, demande d&apos;assistance judiciaire, proposition de partenariat ou requête institutionnelle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Colonne gauche : Siège National + Pôles & Services Directs (5 colonnes) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Siège National */}
            <div className="flex flex-col gap-6 bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm">
              <h2 className="font-title-lg text-lg sm:text-xl text-[#0B3827] font-bold">
                Siège National du MIDH
              </h2>

              <div className="flex flex-col gap-4 font-body-sm text-on-surface-variant">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    location_on
                  </span>
                  <div>
                    <strong className="block text-on-surface">Adresse physique :</strong>
                    <span>Abidjan, Cocody Angré, Carrefour les Oscars</span>
                    <span className="block text-caption text-tertiary">République de Côte d&apos;Ivoire</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    call
                  </span>
                  <div>
                    <strong className="block text-on-surface">Téléphone &amp; Ligne d&apos;urgence :</strong>
                    <a
                      href="https://wa.me/2250101498739"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      +225 01 01 49 87 39
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    mail
                  </span>
                  <div>
                    <strong className="block text-on-surface">Messagerie générale :</strong>
                    <a
                      href="mailto:info@midh-ci.org"
                      className="text-primary hover:underline break-all font-semibold"
                    >
                      info@midh-ci.org
                    </a>
                    <span className="block text-caption text-tertiary mt-0.5">
                      (Copie automatique transmise à la Direction &amp; Présidence)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    schedule
                  </span>
                  <div>
                    <strong className="block text-on-surface">Horaires d&apos;ouverture au public :</strong>
                    <span>Lundi au Vendredi : 08h30 – 17h00</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container">
                <a
                  href="https://wa.me/2250101498739"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] text-white py-3 px-4 rounded-xl font-label-lg transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Ouvrir une discussion WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Pôles & Services Spécifiques du MIDH (Exclusivement sur cette page) */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                </span>
                <div>
                  <h3 className="font-title-lg text-base sm:text-lg text-[#0B3827] font-bold">
                    Pôles &amp; Lignes Dédiées
                  </h3>
                  <p className="text-caption text-tertiary">
                    Coordonnées officielles des instances
                  </p>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-outline-variant/20 text-body-sm">
                {/* Direction Exécutive */}
                <div className="py-3 first:pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Direction Exécutive</span>
                    <span className="text-[10.5px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Coordination</span>
                  </div>
                  <p className="text-caption text-tertiary mt-0.5">Programmes, partenariats opérationnels &amp; alertes terrain</p>
                  <a
                    href="mailto:direx@midh-ci.org"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs font-semibold mt-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">mail</span>
                    <span>direx@midh-ci.org</span>
                  </a>
                </div>

                {/* Présidence */}
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Présidence du MIDH</span>
                    <span className="text-[10.5px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Gouvernance</span>
                  </div>
                  <p className="text-caption text-tertiary mt-0.5">Représentation légale, relations institutionnelles &amp; stratégie</p>
                  <a
                    href="mailto:president@midh-ci.org"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs font-semibold mt-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">mail</span>
                    <span>president@midh-ci.org</span>
                  </a>
                </div>

                {/* Secrétariat Général */}
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Secrétariat Général</span>
                    <span className="text-[10.5px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Administration</span>
                  </div>
                  <p className="text-caption text-tertiary mt-0.5">Courriers officiels, procès-verbaux &amp; vie associative</p>
                  <a
                    href="mailto:secretaire@midh-ci.org"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs font-semibold mt-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">mail</span>
                    <span>secretaire@midh-ci.org</span>
                  </a>
                </div>

                {/* Trésorerie Générale */}
                <div className="py-3 last:pb-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Trésorerie Générale</span>
                    <span className="text-[10.5px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Finances</span>
                  </div>
                  <p className="text-caption text-tertiary mt-0.5">Gestion comptable, conformité financière &amp; audits</p>
                  <a
                    href="mailto:tresorier@midh-ci.org"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs font-semibold mt-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">mail</span>
                    <span>tresorier@midh-ci.org</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact fonctionnel (7 colonnes) */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm">
            <h2 className="font-headline-sm text-lg sm:text-xl text-[#0B3827] font-bold mb-6">
              Envoyer un message à la coordination
            </h2>

            {status && (
              <div
                className={`p-4 rounded-xl mb-6 text-body-sm font-medium ${
                  status.isError
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}
                role="alert"
              >
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Piège anti-spam invisible */}
              <input
                type="text"
                name="website_trap"
                value={formData.website_trap}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="font-label-md text-label-md text-on-surface font-semibold">
                    Nom et Prénom <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex. Kouamé Jean"
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {fieldErrors.name && (
                    <span className="text-caption text-red-600">{fieldErrors.name[0]}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-label-md text-label-md text-on-surface font-semibold">
                    Adresse e-mail <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.kouame@exemple.ci"
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {fieldErrors.email && (
                    <span className="text-caption text-red-600">{fieldErrors.email[0]}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="font-label-md text-label-md text-on-surface font-semibold">
                    Téléphone (optionnel)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

              {/* Choix du service destinataire */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="department" className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between">
                  <span>Pôle ou Service destinataire</span>
                  <span className="text-caption text-tertiary font-normal">Aiguillage du message</span>
                </label>
                <div className="relative">
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="general">Coordination Générale (info@midh-ci.org) — Par défaut</option>
                    <option value="direx">Direction Exécutive (direx@midh-ci.org)</option>
                    <option value="president">Présidence du MIDH (president@midh-ci.org)</option>
                    <option value="secretaire">Secrétariat Général (secretaire@midh-ci.org)</option>
                    <option value="tresorier">Trésorerie Générale (tresorier@midh-ci.org)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none text-[20px]">
                    arrow_drop_down
                  </span>
                </div>
                {formData.department === 'general' ? (
                  <span className="text-caption text-emerald-800">
                    💡 Les messages adressés à la coordination sont automatiquement notifiés à la Direction Exécutive, la Présidence et le Secrétariat Général en copie certifiée.
                  </span>
                ) : (
                  <span className="text-caption text-slate-500">
                    Votre message sera directement adressé au pôle sélectionné.
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="font-label-md text-label-md text-on-surface font-semibold">
                  Objet de votre demande <span className="text-red-600">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex. Demande d'assistance juridique"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                  {fieldErrors.subject && (
                    <span className="text-caption text-red-600">{fieldErrors.subject[0]}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="font-label-md text-label-md text-on-surface font-semibold">
                  Votre message ou exposé de la situation <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez précisément votre demande, les faits constatés ou la nature de votre sollicitation..."
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
                {fieldErrors.message && (
                  <span className="text-caption text-red-600">{fieldErrors.message[0]}</span>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] disabled:opacity-50 text-white font-label-lg text-label-lg px-8 py-3.5 rounded-xl shadow-sm transition-all"
                >
                  <span>{loading ? 'Transmission en cours...' : 'Envoyer mon message'}</span>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>

              <span className="text-caption text-tertiary">
                Les données transmises sont strictement confidentielles et traitées conformément aux garanties du MIDH.
              </span>
            </form>
          </div>
        </div>

        {/* Section Carte Géographique Google Maps */}
        <section className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md overflow-hidden flex flex-col">
          {/* En-tête de la carte */}
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 bg-gradient-to-r from-emerald-950/5 via-transparent to-transparent">
            <div className="flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-2xl bg-emerald-100/70 text-emerald-900 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[26px]">pin_drop</span>
              </span>
              <div>
                <h2 className="text-lg sm:text-xl text-[#0B3827] font-bold">
                  Localisation du Siège National
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Abidjan, Cocody Angré, Carrefour les Oscars — République de Côte d&apos;Ivoire
                </p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=MIDH+Abidjan+Cocody+Angre"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 text-xs sm:text-sm font-semibold transition-all self-start sm:self-auto border border-slate-200/80 hover:border-emerald-300"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-700">directions</span>
              <span>Ouvrir dans Google Maps</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400">open_in_new</span>
            </a>
          </div>

          {/* Conteneur interactif 100% responsive */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/7] md:aspect-[21/8] min-h-[380px] sm:min-h-[440px] bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d409.78549716484656!2d-3.9921052767620955!3d5.394666954736396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1950ca083f5af%3A0xded8add4a9c5baa8!2sMIDH!5e1!3m2!1sfr!2sci!4v1792157796383!5m2!1sfr!2sci"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Carte Google Maps - Siège National du MIDH"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
