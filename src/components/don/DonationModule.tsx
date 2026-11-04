'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Heart,
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Building2,
  User,
  ArrowRight,
  X,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface CountryCode {
  country: string;
  flag: string;
  code: string;
  iso: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { country: 'Côte d’Ivoire', flag: '🇨🇮', code: '+225', iso: 'CI' },
  { country: 'France', flag: '🇫🇷', code: '+33', iso: 'FR' },
  { country: 'Sénégal', flag: '🇸🇳', code: '+221', iso: 'SN' },
  { country: 'Mali', flag: '🇲🇱', code: '+223', iso: 'ML' },
  { country: 'Burkina Faso', flag: '🇧🇫', code: '+226', iso: 'BF' },
  { country: 'Guinée', flag: '🇬🇳', code: '+224', iso: 'GN' },
  { country: 'Togo', flag: '🇹🇬', code: '+228', iso: 'TG' },
  { country: 'Bénin', flag: '🇧🇯', code: '+229', iso: 'BJ' },
  { country: 'Cameroun', flag: '🇨🇲', code: '+237', iso: 'CM' },
  { country: 'Ghana', flag: '🇬🇭', code: '+233', iso: 'GH' },
  { country: 'États-Unis / Canada', flag: '🇺🇸', code: '+1', iso: 'US' },
  { country: 'Belgique', flag: '🇧🇪', code: '+32', iso: 'BE' },
  { country: 'Suisse', flag: '🇨🇭', code: '+41', iso: 'CH' },
  { country: 'Royaume-Uni', flag: '🇬🇧', code: '+44', iso: 'GB' },
];

const ACCEPTED_PAYMENT_LOGOS = [
  { name: 'Wave', logo: '/images/payments/wave.png' },
  { name: 'Orange Money', logo: '/images/payments/orange-money.png' },
  { name: 'MTN MoMo', logo: '/images/payments/mtn-money.png' },
  { name: 'Moov Money', logo: '/images/payments/moov-money.png' },
  { name: 'Djamo', logo: '/images/payments/djamo.png' },
  { name: 'Visa', logo: '/images/payments/visa.svg' },
  { name: 'Mastercard', logo: '/images/payments/mastercard.svg' },
];

export default function DonationModule() {
  const searchParams = useSearchParams();

  // Type de donateur : Particulier ou Organisation / Entité
  const [donorType, setDonorType] = useState<'particulier' | 'organisation'>('particulier');

  // Champs de saisie
  const [amount, setAmount] = useState<string>('10000');
  const [donorName, setDonorName] = useState<string>(''); // Nom & Prénom OU Raison Sociale
  const [representativeName, setRepresentativeName] = useState<string>(''); // Si organisation
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // États de l'interface
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cancelledAlert, setCancelledAlert] = useState<boolean>(false);

  useEffect(() => {
    if (searchParams?.get('status') === 'cancelled') {
      setCancelledAlert(true);
    }
  }, [searchParams]);

  // Affiche un toast temporaire
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const parsedAmount = Number(amount.replace(/[^0-9]/g, '')) || 0;

  // Validation préliminaire avant d'ouvrir la modale de confirmation
  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (parsedAmount < 100) {
      setErrorMessage('Veuillez indiquer un montant de don d’au moins 100 FCFA.');
      return;
    }

    if (!donorName.trim() || donorName.trim().length < 2) {
      setErrorMessage(
        donorType === 'particulier'
          ? 'Veuillez saisir votre nom et prénom.'
          : 'Veuillez saisir le nom ou la raison sociale de votre organisation.'
      );
      return;
    }

    if (!donorEmail.trim() || !donorEmail.includes('@')) {
      setErrorMessage('Veuillez renseigner une adresse e-mail valide pour recevoir votre facture et reçu officiel.');
      return;
    }

    setShowConfirmModal(true);
  };

  // Envoi effectif vers l'API après confirmation par le donateur
  const handleFinalDonationSubmit = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    showToast('Initialisation de votre paiement sécurisé WiniPayer...');

    const fullPhone = phoneNumber.trim() ? `${selectedCountry.code} ${phoneNumber.trim()}` : '';

    try {
      const res = await fetch('/api/don/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          donorType,
          donorName: donorName.trim(),
          representativeName: donorType === 'organisation' ? representativeName.trim() : undefined,
          donorEmail: donorEmail.trim(),
          donorPhone: fullPhone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.error || 'Erreur lors de l’initialisation de votre don.');
      }

      showToast('Redirection vers la passerelle WiniPayer...');
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error('[Donation Submit Error]', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Impossible de joindre la passerelle WiniPayer. Veuillez vérifier votre connexion et réessayer.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B3827] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold border border-emerald-500/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Alerte si annulation depuis WiniPayer */}
      {cancelledAlert && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Votre démarche de don a été interrompue. Vous pouvez la reprendre à tout moment.</span>
          </div>
          <button
            type="button"
            onClick={() => setCancelledAlert(false)}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {/* FORMULAIRE UNIQUE ET ÉPURÉ */}
      <form
        onSubmit={handleOpenConfirmation}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-lg flex flex-col gap-7"
      >
        {/* En-tête sobre */}
        <div className="text-center flex flex-col items-center gap-1.5 border-b border-slate-100 pb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#138A2E]">
            Mouvement Ivoirien des Droits Humains (MIDH)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3827] font-display">
            Faire un don en ligne
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Paiement 100% sécurisé via Mobile Money (Wave, Orange, MTN, Moov) et Carte Bancaire.
          </p>
        </div>

        {/* 1. MONTANT UNIQUE ÉPURÉ */}
        <div className="flex flex-col gap-2">
          <label htmlFor="donation-amount" className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Montant de votre don (FCFA) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="donation-amount"
              type="text"
              required
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setAmount(val);
                setErrorMessage(null);
              }}
              placeholder="Ex: 10000"
              className="w-full text-2xl sm:text-3xl font-bold font-mono text-[#0B3827] px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-[#0B3827] focus:ring-0 focus:outline-none transition-all placeholder:text-slate-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm sm:text-base font-extrabold text-slate-400">
              FCFA
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Montant libre (ex: 2 000, 5 000, 10 000, 25 000, 50 000 ou plus selon votre convenance).
          </span>
        </div>

        {/* 2. SÉLECTEUR DE TYPE DE DONATEUR (PARTICULIER OU ORGANISATION) */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Qualité du donateur
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-slate-100">
            <button
              type="button"
              onClick={() => {
                setDonorType('particulier');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                donorType === 'particulier'
                  ? 'bg-white text-[#0B3827] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-[#138A2E]" />
              <span>Particulier</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDonorType('organisation');
                setErrorMessage(null);
              }}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                donorType === 'organisation'
                  ? 'bg-white text-[#0B3827] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#138A2E]" />
              <span>Organisation / Partenaire</span>
            </button>
          </div>
        </div>

        {/* 3. COORDONNÉES SELON LE TYPE */}
        <div className="flex flex-col gap-4">
          {donorType === 'particulier' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom &amp; Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Kouamé Konan Jean"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0B3827] focus:outline-none transition-colors"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom de l’organisation / Partenaire <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fondation Solidarité / Société ABC"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0B3827] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom du représentant légal ou contact
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Touré Moussa"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0B3827] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* E-mail pour la facture PDF */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Adresse E-mail <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                Facture &amp; Reçu PDF délivrés ici
              </span>
            </div>
            <input
              type="email"
              required
              placeholder="votre-adresse@domaine.com"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0B3827] focus:outline-none transition-colors"
            />
          </div>

          {/* Numéro de téléphone avec sélecteur international */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Numéro de téléphone
            </label>
            <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#0B3827] transition-colors">
              {/* Sélecteur de pays avec drapeaux */}
              <select
                value={selectedCountry.code}
                onChange={(e) => {
                  const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                  if (found) setSelectedCountry(found);
                }}
                className="bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 px-3 py-2.5 border-r border-slate-200 focus:outline-none cursor-pointer"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={`${c.iso}-${c.code}`} value={c.code}>
                    {c.flag} {c.country} ({c.code})
                  </option>
                ))}
              </select>

              {/* Saisie du numéro local */}
              <input
                type="tel"
                placeholder="01 02 03 04 05"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. BANNIÈRE PASSIVE DES MOYENS DE PAIEMENT ACCEPTÉS */}
        <div className="pt-2 flex flex-col items-center gap-2.5 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Moyens de paiement acceptés via WiniPayer :
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 opacity-90">
            {ACCEPTED_PAYMENT_LOGOS.map((pm) => (
              <div
                key={pm.name}
                className="h-8 px-2.5 py-1 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-2xs"
                title={pm.name}
              >
                <Image
                  src={pm.logo}
                  alt={pm.name}
                  width={28}
                  height={20}
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Message d'erreur éventuel */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 5. BOUTON D'ACTION PRINCIPAL SOBRE (SANS ÉTOILES AI) */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-[#138A2E] hover:bg-[#0F7326] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl text-base sm:text-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Initialisation de votre don...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 fill-white/20" />
                <span>
                  Faire un don {parsedAmount > 0 ? `de ${parsedAmount.toLocaleString('fr-FR')} FCFA` : ''}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#138A2E]" />
            <span>Paiement crypté SSL 256 bits conforme aux standards de sécurité bancaire</span>
          </div>
        </div>
      </form>

      {/* MODALE POPUP DE CONFIRMATION DE DON */}
      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermeture */}
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* En-tête de la modale */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#138A2E] flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0B3827]">
                  Confirmation de votre contribution
                </h3>
                <p className="text-xs text-slate-500">
                  Vérifiez les informations avant d’accéder au paiement WiniPayer
                </p>
              </div>
            </div>

            {/* Récapitulatif clair */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Bénéficiaire :</span>
                <span className="font-bold text-[#0B3827]">MIDH (Côte d’Ivoire)</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Qualité :</span>
                <span className="font-semibold text-slate-800">
                  {donorType === 'particulier' ? 'Particulier' : 'Organisation / Institution'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">
                  {donorType === 'particulier' ? 'Donateur :' : 'Raison sociale :'}
                </span>
                <span className="font-bold text-slate-900">{donorName}</span>
              </div>

              {donorType === 'organisation' && representativeName && (
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Représentant(e) :</span>
                  <span className="font-medium text-slate-800">{representativeName}</span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">E-mail de facturation :</span>
                <span className="font-medium text-slate-800">{donorEmail}</span>
              </div>

              {phoneNumber.trim() && (
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Téléphone :</span>
                  <span className="font-medium text-slate-800">
                    {selectedCountry.code} {phoneNumber}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-600 font-bold">Montant total :</span>
                <span className="text-xl font-extrabold text-[#138A2E]">
                  {parsedAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed text-center">
              En cliquant sur « Confirmer et Payer », vous serez redirigé vers la page sécurisée WiniPayer pour valider la transaction par Mobile Money ou Carte Bancaire.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleFinalDonationSubmit}
                disabled={isLoading}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-[#0B3827] hover:bg-[#0A2F21] text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Confirmer et Payer</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto py-3.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
