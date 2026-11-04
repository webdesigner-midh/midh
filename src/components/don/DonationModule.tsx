'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Heart,
  Copy,
  Check,
  BadgeCheck,
  Info,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface PaymentOperator {
  id: string;
  name: string;
  subtitle: string;
  badge?: string;
  logo: string;
  color: string;
  bgLight: string;
  borderColor: string;
  type: 'mobile_money' | 'card' | 'bank';
  instructions: {
    steps: string[];
    tips?: string;
  };
}

const PRESET_AMOUNTS = [2000, 5000, 10000, 25000, 50000];

const PAYMENT_OPERATORS: PaymentOperator[] = [
  {
    id: 'wave',
    name: 'Wave',
    subtitle: 'Côte d’Ivoire (0% de frais)',
    badge: 'Recommandé',
    logo: '/images/payments/wave.png',
    color: '#00B2FE',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Cliquez sur « Donner avec WiniPayer » ci-dessous',
        'Validez l’invite instantanée sur votre application mobile Wave',
        'Vérifiez le titulaire officiel : MIDH / Mouvement Ivoirien des Droits Humains',
        'Votre reçu officiel vous est directement transmis par e-mail',
      ],
      tips: 'Zéro frais pour le donateur, validation instantanée.',
    },
  },
  {
    id: 'orange',
    name: 'Orange Money',
    subtitle: 'Réseau Orange CI (#144#)',
    badge: 'Disponible partout',
    logo: '/images/payments/orange-money.png',
    color: '#FF6600',
    bgLight: '#fff7ed',
    borderColor: '#fed7aa',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Cliquez sur « Donner avec WiniPayer »',
        'Saisissez votre code secret Orange Money via le push USSD sur votre téléphone',
        'Vérifiez le nom officiel du destinataire : MIDH',
        'Confirmation immédiate par SMS',
      ],
      tips: 'Réception instantanée sur le compte officiel de la Trésorerie du MIDH.',
    },
  },
  {
    id: 'mtn',
    name: 'MTN MoMo',
    subtitle: 'MTN Mobile Money (*133#)',
    badge: 'Instantané',
    logo: '/images/payments/mtn-money.png',
    color: '#FFCC00',
    bgLight: '#fefce8',
    borderColor: '#fef08a',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Cliquez sur « Donner avec WiniPayer »',
        'Approuvez la demande de débit sur votre mobile avec votre code PIN MoMo',
        'Confirmez le compte certifié : MIDH',
        'Reçu de don émis immédiatement',
      ],
      tips: 'Confirmation immédiate par SMS sécurisé.',
    },
  },
  {
    id: 'moov',
    name: 'Moov Money',
    subtitle: 'Moov Africa CI (*155#)',
    logo: '/images/payments/moov-money.png',
    color: '#0066B3',
    bgLight: '#eff6ff',
    borderColor: '#bfdbfe',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Cliquez sur « Donner avec WiniPayer »',
        'Validez avec votre code secret MoMo Flooz',
        'Confirmez l’identité du bénéficiaire officiel : MIDH',
        'Attestation transmise par email',
      ],
    },
  },
  {
    id: 'djamo',
    name: 'Djamo',
    subtitle: 'Compte & Carte UEMOA',
    badge: '100% digital',
    logo: '/images/payments/djamo.png',
    color: '#0F172A',
    bgLight: '#f8fafc',
    borderColor: '#e2e8f0',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Payez directement avec votre carte virtuelle ou compte Djamo via WiniPayer',
        'Validation par notification instantanée in-app',
        'Conservez la notification pour l’émission de votre attestation fiscale',
      ],
    },
  },
  {
    id: 'visa',
    name: 'Carte Visa',
    subtitle: 'Paiement national & international',
    badge: 'International / Diaspora',
    logo: '/images/payments/visa.svg',
    color: '#1434CB',
    bgLight: '#f0f4ff',
    borderColor: '#c7d2fe',
    type: 'card',
    instructions: {
      steps: [
        'Sécurisé par le protocole 3D-Secure universel',
        'Compatible avec les cartes bancaires de Côte d’Ivoire, d’Afrique et du monde entier',
        'Votre reçu fiscal officiel vous est transmis par e-mail après validation',
      ],
      tips: 'Idéal pour les membres de la diaspora et les partenaires internationaux.',
    },
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    subtitle: 'Cartes bancaires universelles',
    badge: 'International / Diaspora',
    logo: '/images/payments/mastercard.svg',
    color: '#EB001B',
    bgLight: '#fff1f2',
    borderColor: '#fecdd3',
    type: 'card',
    instructions: {
      steps: [
        'Paiement international par carte bancaire Mastercard via WiniPayer',
        'Validation 3D-Secure avec code SMS envoyé par votre banque',
        'Reçu déductible des impôts envoyé immédiatement',
      ],
      tips: 'Accompagnement dédié pour les particuliers et mécènes internationaux.',
    },
  },
];

export default function DonationModule() {
  const searchParams = useSearchParams();

  // État du montant
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  // État de l'opérateur
  const [selectedOperator, setSelectedOperator] = useState<PaymentOperator>(PAYMENT_OPERATORS[0]);

  // Coordonnées du donateur
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donationType, setDonationType] = useState<'once' | 'monthly'>('once');

  // États UI
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cancelledAlert, setCancelledAlert] = useState<boolean>(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const officialNumberDisplay = '01 01 49 87 39';

  useEffect(() => {
    if (searchParams?.get('status') === 'cancelled') {
      setCancelledAlert(true);
    }
  }, [searchParams]);

  const activeAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const handleSelectPreset = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
    setErrorMessage(null);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    setIsCustom(true);
    setErrorMessage(null);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('0101498739');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation des champs
    if (activeAmount < 100) {
      setErrorMessage('Veuillez indiquer un montant de don d’au moins 100 FCFA.');
      return;
    }

    if (!donorName.trim() || donorName.trim().length < 2) {
      setErrorMessage('Veuillez renseigner votre nom et prénom pour l’émission du reçu fiscal.');
      return;
    }

    if (!donorEmail.trim() || !donorEmail.includes('@')) {
      setErrorMessage('Veuillez renseigner une adresse e-mail valide pour recevoir votre reçu officiel.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/don/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeAmount,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorPhone: donorPhone.trim() || undefined,
          operator: selectedOperator.id,
          donationType,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.error || 'Erreur lors de l’initialisation de votre don.');
      }

      // Redirection instantanée vers le portail de paiement sécurisé WiniPayer
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
    <div className="w-full flex flex-col gap-8">
      {/* Alerte si annulation depuis WiniPayer */}
      {cancelledAlert && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Votre tentative de don a été interrompue. Vous pouvez réessayer à tout moment.</span>
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

      {/* Grille Principale : Formulaire (Gauche) + Volet Sécurité & Instructions (Droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne Gauche : Configuration du Don & Paiement WiniPayer (7 colonnes) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <form
            onSubmit={handleDonationSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6"
          >
            {/* 1. CHOIX DU MONTANT */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#0B3827] text-white font-bold flex items-center justify-center text-xs">
                    1
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B3827]">
                    Montant de votre don
                  </h3>
                </div>
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setDonationType('once')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      donationType === 'once'
                        ? 'bg-white text-[#0B3827] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Don ponctuel
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('monthly')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      donationType === 'monthly'
                        ? 'bg-white text-[#0B3827] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Don mensuel
                  </button>
                </div>
              </div>

              {/* Boutons de montants prédéfinis */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {PRESET_AMOUNTS.map((amt) => {
                  const isCurrent = !isCustom && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                        isCurrent
                          ? 'border-[#0B3827] bg-[#f0fdf4] text-[#0B3827] ring-2 ring-[#0B3827]/20 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {amt.toLocaleString('fr-FR')} F
                    </button>
                  );
                })}
              </div>

              {/* Champ Montant Libre */}
              <div className="relative">
                <label htmlFor="custom-amount" className="sr-only">Montant libre</label>
                <input
                  id="custom-amount"
                  type="text"
                  placeholder="Ou saisissez un montant libre (ex: 15000)"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                    isCustom
                      ? 'border-[#0B3827] bg-[#f0fdf4] text-[#0B3827] font-bold ring-1 ring-[#0B3827]'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                />
                <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">
                  FCFA
                </span>
              </div>
            </div>

            {/* 2. SÉLECTION DU MOYEN DE PAIEMENT */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-full bg-[#0B3827] text-white font-bold flex items-center justify-center text-xs">
                  2
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#0B3827]">
                  Opérateur Mobile Money ou Carte Bancaire
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PAYMENT_OPERATORS.map((operator) => {
                  const isSelected = selectedOperator.id === operator.id;
                  return (
                    <button
                      key={operator.id}
                      type="button"
                      onClick={() => setSelectedOperator(operator)}
                      className={`relative p-2.5 rounded-xl border transition-all flex flex-col items-center text-center gap-1.5 ${
                        isSelected
                          ? 'border-[#0B3827] bg-[#f0fdf4] shadow-xs ring-2 ring-[#0B3827]/25'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center overflow-hidden">
                        <Image
                          src={operator.logo}
                          alt={operator.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {operator.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. COORDONNÉES DU DONATEUR (POUR LE REÇU FISCAL) */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#0B3827] text-white font-bold flex items-center justify-center text-xs">
                    3
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0B3827]">
                    Coordonnées du donateur
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Reçu fiscal certifié
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="votre-email@domaine.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro de téléphone (optionnel pour Mobile Money)
                </label>
                <input
                  type="tel"
                  placeholder="Ex: 01 02 03 04 05"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* MESSAGE D'ERREUR ÉVENTUEL */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* BOUTON D'ACTION PRINCIPAL : PAYER AVEC WINIPAYER */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-3 bg-[#138A2E] hover:bg-[#0F7326] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl text-base sm:text-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Redirection sécurisée vers WiniPayer...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 fill-white/20" />
                    <span>
                      Donner {activeAmount > 0 ? `${activeAmount.toLocaleString('fr-FR')} FCFA` : ''} avec WiniPayer
                    </span>
                    <Sparkles className="w-4 h-4 opacity-80" />
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#138A2E]" />
                <span>Paiement crypté SSL 256 bits conforme aux normes bancaires UEMOA</span>
              </div>
            </div>
          </form>
        </div>

        {/* Colonne Droite : Fiche Opérateur & Numéro Officiel (5 colonnes) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#0B3827]/20 shadow-md flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0B3827] via-[#138A2E] to-[#0B3827]" />

            <div className="flex items-center gap-3.5 pt-1">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-xs flex-shrink-0">
                <Image
                  src={selectedOperator.logo}
                  alt={`Logo ${selectedOperator.name}`}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Mode sélectionné
                </span>
                <h4 className="text-base font-bold text-[#0B3827]">
                  {selectedOperator.name}
                </h4>
                <span className="text-xs text-slate-500">
                  {selectedOperator.subtitle}
                </span>
              </div>
            </div>

            {/* Bloc Numéro Officiel Certifié MIDH pour virement direct alternatif */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-[#138A2E]" />
                  Numéro Officiel MIDH :
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Trésorerie Générale
                </span>
              </div>

              <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-emerald-300">
                <span className="text-base sm:text-lg font-extrabold text-[#0B3827] tracking-wider font-mono">
                  {officialNumberDisplay}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                >
                  {copiedNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-600">
                <strong>Titulaire certifié :</strong> Mouvement Ivoirien des Droits Humains (MIDH)
              </div>
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Déroulement du paiement :
              </span>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedOperator.instructions.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
              {selectedOperator.instructions.tips && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-1.5 mt-1">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{selectedOperator.instructions.tips}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
