'use client';

import { OFFICIAL_DOMAINS, OFFICIAL_SECTIONS } from '@/data/fallbackData';
import { useState } from 'react';

export default function BenevolatPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    motivation: '',
    domainInterests: [] as string[],
    website_trap: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const handleCheckboxChange = (domainId: string) => {
    setFormData((prev) => {
      const exists = prev.domainInterests.includes(domainId);
      return {
        ...prev,
        domainInterests: exists
          ? prev.domainInterests.filter((id) => id !== domainId)
          : [...prev.domainInterests, domainId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.domainInterests.length === 0) {
      setStatus({ text: "Veuillez cocher au moins un domaine d'action qui vous intéresse.", isError: true });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/benevole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ text: data.message, isError: false });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          city: '',
          motivation: '',
          domainInterests: [],
          website_trap: '',
        });
      } else {
        setStatus({ text: data.message || "Erreur lors de l'enregistrement.", isError: true });
      }
    } catch {
      setStatus({ text: 'Erreur réseau. Veuillez réessayer.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-background py-space-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-space-2xl">
        {/* En-tête */}
        <div className="flex flex-col gap-space-xs text-center sm:text-left">
          <span className="font-label-lg text-xs sm:text-sm text-primary uppercase tracking-wider font-semibold">
            Engagement Citoyen
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-[#0B3827] font-extrabold leading-tight">
            Devenir Bénévole au MIDH
          </h1>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Rejoignez l&apos;une de nos 20 sections et sous-sections en Côte d&apos;Ivoire et participez concrètement à la veille, à l&apos;assistance communautaire et à l&apos;éducation civique.
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm">
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              name="website_trap"
              value={formData.website_trap}
              onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  Nom et Prénom <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  placeholder="Ex. Kouassi Marc"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  Adresse e-mail <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre.email@domaine.ci"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  Numéro de téléphone <span className="text-red-600">*</span>
                </label>
                <input
                  required
                  placeholder="+225 01 02 03 04 05"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface">
                  Localité ou Section souhaitée <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionnez votre ville / section</option>
                  {OFFICIAL_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.city}>
                      {sec.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                Domaines d&apos;intervention qui vous intéressent <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {OFFICIAL_DOMAINS.map((dom) => (
                  <label
                    key={dom.id}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer text-body-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.domainInterests.includes(dom.id)}
                      onChange={() => handleCheckboxChange(dom.id)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span>{dom.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                Vos motivations et disponibilités <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Indiquez brièvement votre formation, votre expérience et vos disponibilités..."
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm border border-outline-variant/40 focus:ring-2 focus:ring-primary resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] disabled:opacity-50 text-white font-label-lg px-8 py-3.5 rounded-xl shadow-sm transition-all"
            >
              <span>{loading ? 'Enregistrement...' : 'Soumettre ma candidature bénévole'}</span>
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
