'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CountryCode {
  code: string;
  name: string;
  dial: string;
  flag: string;
}

const COUNTRIES: CountryCode[] = [
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225', flag: '🇨🇮' },
  { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
  { code: 'US', name: 'États-Unis', dial: '+1', flag: '🇺🇸' },
  { code: 'SN', name: 'Sénégal', dial: '+221', flag: '🇸🇳' },
  { code: 'BF', name: 'Burkina Faso', dial: '+226', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', dial: '+223', flag: '🇲🇱' },
  { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
  { code: 'GN', name: 'Guinée', dial: '+224', flag: '🇬🇳' },
  { code: 'BJ', name: 'Bénin', dial: '+229', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', dial: '+228', flag: '🇹🇬' },
  { code: 'NE', name: 'Niger', dial: '+227', flag: '🇳🇪' },
  { code: 'CM', name: 'Cameroun', dial: '+237', flag: '🇨🇲' },
  { code: 'CG', name: 'Congo-Brazzaville', dial: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'RD Congo', dial: '+243', flag: '🇨🇩' },
  { code: 'GA', name: 'Gabon', dial: '+241', flag: '🇬🇦' },
  { code: 'BE', name: 'Belgique', dial: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dial: '+41', flag: '🇨🇭' },
  { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
  { code: 'GB', name: 'Royaume-Uni', dial: '+44', flag: '🇬🇧' },
  { code: 'DE', name: 'Allemagne', dial: '+49', flag: '🇩🇪' },
  { code: 'MA', name: 'Maroc', dial: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisie', dial: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algérie', dial: '+213', flag: '🇩🇿' },
  { code: 'ZA', name: 'Afrique du Sud', dial: '+27', flag: '🇿🇦' },
];

const DOMAINS = [
  'Plaidoyer & Défense des droits humains',
  'Clinique juridique & Assistance aux victimes',
  'Sensibilisation & Mobilisation communautaire',
  'Communication, Médias & Création de contenu',
  'Organisation d’événements & Logistique terrain',
  'Recherche, Documentation & Enquêtes',
  'Autre / Soutien général',
];

const AVAILABILITIES = [
  'Quelques heures par semaine (flexible)',
  'Fins de semaine / Week-ends',
  'Missions ponctuelles et campagnes spécifiques',
  'Régulièrement en semaine',
];

export default function VolunteerForm() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    location: '',
    phoneNumber: '',
    domain: DOMAINS[0],
    availability: AVAILABILITIES[0],
    message: '',
    website_trap: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Fermeture au clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dial.includes(countrySearch) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const fullPhone = `${selectedCountry.dial} ${formData.phoneNumber.trim()}`;

    try {
      const response = await fetch('/api/benevole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          location: formData.location,
          phone: fullPhone,
          domain: formData.domain,
          availability: formData.availability,
          message: formData.message,
          website_trap: formData.website_trap,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: data.message || "Félicitations ! Votre demande d'adhésion a été reçue avec succès.",
        });
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          location: '',
          phoneNumber: '',
          domain: DOMAINS[0],
          availability: AVAILABILITIES[0],
          message: '',
          website_trap: '',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.message || "Une erreur est survenue lors de l'envoi de votre candidature.",
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: "Connexion impossible avec le serveur. Veuillez vérifier votre connexion ou nous contacter directement.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10 md:p-12">
      {statusMessage && (
        <div
          role="alert"
          className={`mb-8 p-5 rounded-2xl flex items-start gap-3.5 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
              : 'bg-red-50/90 border-red-200 text-red-900'
          }`}
        >
          <span className="material-symbols-outlined text-2xl shrink-0 mt-0.5">
            {statusMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <div className="flex flex-col gap-1">
            <strong className="font-semibold text-base">
              {statusMessage.type === 'success' ? 'Candidature enregistrée !' : 'Attention'}
            </strong>
            <p className="text-sm leading-relaxed">{statusMessage.text}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-7">
        {/* Champ anti-spam Honeypot invisible */}
        <input
          type="text"
          name="website_trap"
          value={formData.website_trap}
          onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Ligne 1 : Nom et Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="volunteer-nom" className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Nom de famille <span className="text-emerald-700">*</span>
            </label>
            <input
              id="volunteer-nom"
              type="text"
              required
              placeholder="Ex: Kouamé"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm sm:text-base bg-slate-50/50 hover:bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="volunteer-prenom" className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Prénom(s) <span className="text-emerald-700">*</span>
            </label>
            <input
              id="volunteer-prenom"
              type="text"
              required
              placeholder="Ex: Aïcha ou Jean-Marc"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm sm:text-base bg-slate-50/50 hover:bg-white"
            />
          </div>
        </div>

        {/* Ligne 2 : Email et Lieu d'habitation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="volunteer-email" className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Adresse email <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                mail
              </span>
              <input
                id="volunteer-email"
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm sm:text-base bg-slate-50/50 hover:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="volunteer-location" className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Lieu d&apos;habitation (Ville, commune, quartier) <span className="text-emerald-700">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
                location_on
              </span>
              <input
                id="volunteer-location"
                type="text"
                required
                placeholder="Ex: Abidjan, Cocody Angré"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm sm:text-base bg-slate-50/50 hover:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Ligne 3 : Numéro de téléphone au format international avec sélecteur de drapeaux */}
        <div className="flex flex-col gap-2">
          <label htmlFor="volunteer-phone" className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
            Numéro de téléphone WhatsApp / Appel <span className="text-emerald-700">*</span>
          </label>
          <div className="flex items-stretch rounded-xl border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 bg-slate-50/50 transition-all">
            {/* Sélecteur de drapeau / indicatif */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="h-full px-3.5 py-3 flex items-center gap-2 border-r border-slate-300 hover:bg-slate-100 rounded-l-xl transition-colors text-sm font-semibold text-slate-800 focus:outline-none"
                aria-label="Sélectionner le code pays"
                aria-expanded={dropdownOpen}
              >
                <span className="text-xl leading-none">{selectedCountry.flag}</span>
                <span className="font-mono text-slate-700">{selectedCountry.dial}</span>
                <span className="material-symbols-outlined text-slate-400 text-sm">
                  {dropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Menu déroulant des pays */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2.5 border-b border-slate-100 bg-slate-50">
                    <input
                      type="text"
                      placeholder="Rechercher un pays ou code..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 bg-white"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 text-xs sm:text-sm">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((c) => (
                        <button
                          key={`${c.code}-${c.dial}`}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setDropdownOpen(false);
                            setCountrySearch('');
                          }}
                          className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-emerald-50/60 transition-colors ${
                            selectedCountry.code === c.code ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2.5 truncate">
                            <span className="text-lg">{c.flag}</span>
                            <span className="truncate">{c.name}</span>
                          </span>
                          <span className="font-mono text-slate-500 font-medium shrink-0 ml-2">{c.dial}</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400">Aucun pays trouvé</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Champ de saisie du numéro */}
            <input
              id="volunteer-phone"
              type="tel"
              required
              placeholder="01 02 03 04 05"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-sm sm:text-base rounded-r-xl"
            />
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Format international standard : le code pays <strong className="text-slate-700">{selectedCountry.flag} {selectedCountry.dial}</strong> s&apos;associe automatiquement à votre numéro.
          </p>
        </div>

        {/* Ligne 4 : Domaine d'intérêt & Disponibilité */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="volunteer-domain" className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Domaine d&apos;engagement souhaité
            </label>
            <div className="relative">
              <select
                id="volunteer-domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 outline-none transition-all text-sm sm:text-base bg-slate-50/50 hover:bg-white appearance-none cursor-pointer"
              >
                {DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                unfold_more
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="volunteer-availability" className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
              Disponibilité indicative
            </label>
            <div className="relative">
              <select
                id="volunteer-availability"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 outline-none transition-all text-sm sm:text-base bg-slate-50/50 hover:bg-white appearance-none cursor-pointer"
              >
                {AVAILABILITIES.map((avail) => (
                  <option key={avail} value={avail}>
                    {avail}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                unfold_more
              </span>
            </div>
          </div>
        </div>

        {/* Ligne 5 : Motivation ou Message libre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="volunteer-message" className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
            Votre motivation ou compétences particulières (optionnel)
          </label>
          <textarea
            id="volunteer-message"
            rows={4}
            placeholder="Parlez-nous de vous, de vos études, de votre parcours ou de ce qui vous pousse à rejoindre les défenseur·es des droits de l'Homme du MIDH..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm sm:text-base bg-slate-50/50 hover:bg-white resize-y"
          />
        </div>

        {/* Bouton de soumission */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#0B3827] hover:bg-[#07261a] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Transmission de votre candidature...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl text-emerald-300">how_to_reg</span>
                <span>Soumettre mon adhésion bénévole</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
