'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  Copy,
  Check,
  Lock,
  FileCheck2,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Info,
  Building2,
  BadgeCheck,
  Send,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

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

const PAYMENT_OPERATORS: PaymentOperator[] = [
  {
    id: 'wave',
    name: 'Wave',
    subtitle: 'Côte d’Ivoire (0% frais)',
    badge: 'Très populaire',
    logo: '/images/payments/wave.png',
    color: '#00B2FE',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Ouvrez votre application Wave sur votre téléphone',
        'Sélectionnez « Transférer » vers le numéro officiel du MIDH : 01 01 49 87 39',
        'Vérifiez le nom du destinataire : MIDH / Mouvement Ivoirien des Droits Humains',
        'Confirmez le montant de votre don avec votre code secret Wave',
      ],
      tips: 'Zéro frais de transfert pour vous et pour le MIDH.',
    },
  },
  {
    id: 'orange',
    name: 'Orange Money',
    subtitle: 'Réseau Orange CI',
    badge: 'Disponible partout',
    logo: '/images/payments/orange-money.png',
    color: '#FF6600',
    bgLight: '#fff7ed',
    borderColor: '#fed7aa',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Composez le #144# ou ouvrez l’application Orange Money Max',
        'Sélectionnez « Transfert d’argent » vers le numéro : 01 01 49 87 39',
        'Confirmez l’identité du titulaire officiel : MIDH',
        'Saisissez votre code secret Orange Money pour valider',
      ],
      tips: 'Réception instantanée sur le compte trésorerie du MIDH.',
    },
  },
  {
    id: 'mtn',
    name: 'MTN MoMo',
    subtitle: 'MTN Mobile Money CI',
    badge: 'Instantané',
    logo: '/images/payments/mtn-money.png',
    color: '#FFCC00',
    bgLight: '#fefce8',
    borderColor: '#fef08a',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Composez le *133# ou ouvrez l’application MoMo CI',
        'Choisissez l’option « Envoi d’argent » vers le numéro : 01 01 49 87 39',
        'Confirmez le destinataire officiel : MIDH',
        'Validez avec votre code PIN personnel',
      ],
      tips: 'Validation sécurisée immédiate par notification SMS.',
    },
  },
  {
    id: 'moov',
    name: 'Moov Money',
    subtitle: 'Moov Africa CI',
    logo: '/images/payments/moov-money.png',
    color: '#0066B3',
    bgLight: '#eff6ff',
    borderColor: '#bfdbfe',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Composez le *155# ou ouvrez l’application Moov Money Flooz',
        'Effectuez un transfert direct au : 01 01 49 87 39',
        'Vérifiez le nom du bénéficiaire : MIDH',
        'Confirmez votre transaction en toute sécurité',
      ],
    },
  },
  {
    id: 'djamo',
    name: 'Djamo',
    subtitle: 'Application & Compte UEMOA',
    badge: '100% digital',
    logo: '/images/payments/djamo.png',
    color: '#0F172A',
    bgLight: '#f8fafc',
    borderColor: '#e2e8f0',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Ouvrez votre application mobile Djamo',
        'Effectuez un virement instantané ou transfert vers le numéro : 01 01 49 87 39',
        'Indiquez en motif : « Don MIDH - [Votre Nom] »',
        'Téléchargez le reçu pour demander votre attestation fiscale',
      ],
    },
  },
  {
    id: 'visa',
    name: 'Carte Visa',
    subtitle: 'Cartes nationales & internationales',
    badge: 'International',
    logo: '/images/payments/visa.svg',
    color: '#1434CB',
    bgLight: '#f0f4ff',
    borderColor: '#c7d2fe',
    type: 'card',
    instructions: {
      steps: [
        'Pour les dons par Carte Bancaire Visa (nationale ou internationale / diaspora), rapprochez-vous de la Trésorerie du MIDH',
        'Un lien de paiement sécurisé 3D-Secure certifié vous est envoyé sur demande',
        'Votre reçu fiscal est émis immédiatement après confirmation de la transaction',
      ],
      tips: 'Idéal pour les donateurs de la diaspora (Europe, Amérique, Afrique).',
    },
  },
  {
    id: 'mastercard',
    name: 'Mastercard',
    subtitle: 'Cartes bancaires universelles',
    badge: 'International',
    logo: '/images/payments/mastercard.svg',
    color: '#EB001B',
    bgLight: '#fff1f2',
    borderColor: '#fecdd3',
    type: 'card',
    instructions: {
      steps: [
        'Rapprochez-vous de la Trésorerie Générale du MIDH par WhatsApp ou E-mail',
        'Un lien sécurisé crypté SSL vous est transmis directement pour votre don',
        'Possibilité de virement bancaire institutionnel via RIB/IBAN officiel',
      ],
      tips: 'Conforme aux standards de sécurité bancaire 3D-Secure.',
    },
  },
];

const PRESET_AMOUNTS = [
  {
    value: 5000,
    label: '5 000 FCFA',
    impact: 'Édition et distribution de guides de sensibilisation aux droits civiques.',
    badge: 'Indispensable',
  },
  {
    value: 10000,
    label: '10 000 FCFA',
    impact: 'Consultation juridique gratuite et accueil d’un citoyen vulnérable.',
    badge: 'Le plus choisi',
    popular: true,
  },
  {
    value: 25000,
    label: '25 000 FCFA',
    impact: 'Constitution de dossier judiciaire et assistance d’une victime d’injustice.',
    badge: 'Impact fort',
  },
  {
    value: 50000,
    label: '50 000 FCFA',
    impact: 'Mission d’observation indépendante et monitoring de terrain sur 24h.',
    badge: 'Majeur',
  },
  {
    value: 100000,
    label: '100 000 FCFA',
    impact: 'Soutien au fonctionnement d’une clinique juridique de proximité pendant un mois.',
    badge: 'Pôle Juridique',
  },
];

export default function DonationModule() {
  const [donationFrequency, setDonationFrequency] = useState<'once' | 'monthly'>('once');
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedOperator, setSelectedOperator] = useState<PaymentOperator>(PAYMENT_OPERATORS[0]);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const officialNumber = '+225 01 01 49 87 39';
  const cleanNumber = '2250101498739';

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const currentImpact = isCustom
    ? currentAmount >= 50000
      ? 'Contribution majeure au déploiement des missions d’assistance et d’enquête sur le terrain.'
      : 'Soutien direct aux actions de défense des libertés et d’assistance aux démunis.'
    : PRESET_AMOUNTS.find((a) => a.value === selectedAmount)?.impact || '';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('0101498739');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour Trésorerie du MIDH,\n\nJe viens de préparer un don de ${currentAmount.toLocaleString(
      'fr-FR'
    )} FCFA (${donationFrequency === 'monthly' ? 'Don mensuel' : 'Don ponctuel'}) via ${
      selectedOperator.name
    }.\n\nPourriez-vous m'accompagner et m'éditer mon reçu fiscal officiel ? Merci.`
  );

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Sélecteur de Fréquence (Ponctuel vs Mensuel) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-surface-container-low rounded-2xl border border-outline-variant/40 shadow-inner">
          <button
            type="button"
            onClick={() => setDonationFrequency('once')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              donationFrequency === 'once'
                ? 'bg-[#0B3827] text-white shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Don ponctuel</span>
          </button>
          <button
            type="button"
            onClick={() => setDonationFrequency('monthly')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              donationFrequency === 'monthly'
                ? 'bg-[#0B3827] text-white shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Soutien mensuel régulier</span>
          </button>
        </div>
      </div>

      {/* Grille Principale en 2 Colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne Gauche : Montant & Piliers (7 colonnes) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Card 1 : Choix du montant */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B3827] font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B3827]">
                  Choisissez le montant de votre don
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                100% Déductible
              </span>
            </div>

            {/* Boutons Montants Prédéfinis */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = !isCustom && selectedAmount === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedAmount(preset.value);
                    }}
                    className={`relative p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0B3827] bg-[#f0fdf4] shadow-sm ring-2 ring-[#0B3827]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {preset.popular && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#138A2E] text-white shadow-xs">
                        {preset.badge}
                      </span>
                    )}
                    <span className="text-base sm:text-lg font-extrabold text-[#0B3827]">
                      {preset.label}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {preset.badge}
                    </span>
                  </button>
                );
              })}

              {/* Option Montant Libre */}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-center ${
                  isCustom
                    ? 'border-[#0B3827] bg-[#f0fdf4] shadow-sm ring-2 ring-[#0B3827]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <span className="text-sm font-extrabold text-[#0B3827]">Montant libre</span>
                <span className="text-[11px] text-slate-500 mt-1">Saisie personnalisée</span>
              </button>
            </div>

            {/* Champ de saisie personnalisée si sélectionné */}
            {isCustom && (
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
                <label htmlFor="custom-amount-input" className="text-xs font-bold text-[#0B3827] whitespace-nowrap">
                  Montant en FCFA :
                </label>
                <div className="relative w-full">
                  <input
                    id="custom-amount-input"
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="Ex: 15000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-bold text-[#0B3827] focus:outline-none focus:ring-2 focus:ring-[#0B3827]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-500">
                    FCFA
                  </span>
                </div>
              </div>
            )}

            {/* Badge d'impact dynamique */}
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Impact direct de votre don de {currentAmount.toLocaleString('fr-FR')} FCFA
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentImpact}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 : Choix du moyen de paiement avec logos officiels */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B3827] font-bold flex items-center justify-center text-sm">
                  2
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B3827]">
                  Choisissez votre moyen de paiement
                </h2>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">
                7 options officielles
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600">
              Sélectionnez ci-dessous votre opérateur Mobile Money ou carte bancaire pour afficher les instructions officielles de transfert :
            </p>

            {/* Grille des Logos Déposés */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {PAYMENT_OPERATORS.map((operator) => {
                const isSelected = selectedOperator.id === operator.id;
                return (
                  <button
                    key={operator.id}
                    type="button"
                    onClick={() => setSelectedOperator(operator)}
                    className={`relative p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center gap-2.5 ${
                      isSelected
                        ? 'border-[#0B3827] bg-[#f0fdf4] shadow-md ring-2 ring-[#0B3827]/25 -translate-y-0.5'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 hover:-translate-y-0.5'
                    }`}
                  >
                    {operator.badge && (
                      <span className="absolute -top-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0B3827] text-white shadow-xs">
                        {operator.badge}
                      </span>
                    )}

                    {/* Logo Conteneur Blanc avec Ombre Subtile */}
                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shadow-xs overflow-hidden">
                      <Image
                        src={operator.logo}
                        alt={`Logo ${operator.name}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                        {operator.name}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {operator.subtitle}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-[#138A2E] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne Droite : Instructions & Validation Sécurisée (5 colonnes) */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-28">
          {/* Fiche d'Instructions de l'Opérateur Sélectionné */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#0B3827]/20 shadow-md flex flex-col gap-6 relative overflow-hidden">
            {/* Liseré supérieur décoratif */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0B3827] via-[#138A2E] to-[#0B3827]" />

            {/* En-tête de l'opérateur sélectionné */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs flex-shrink-0">
                <Image
                  src={selectedOperator.logo}
                  alt={`Logo ${selectedOperator.name}`}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Mode de règlement choisi
                </span>
                <h3 className="text-lg font-bold text-[#0B3827]">
                  {selectedOperator.name}
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedOperator.subtitle}
                </span>
              </div>
            </div>

            {/* Récapitulatif du Don */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Montant du soutien :</span>
                <span className="text-xl font-extrabold text-[#0B3827]">
                  {currentAmount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#0B3827]">
                {donationFrequency === 'monthly' ? 'Mensuel' : 'Don unique'}
              </span>
            </div>

            {/* Bloc Numéro Officiel Certifié MIDH */}
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
                  01 01 49 87 39
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
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

            {/* Étapes de validation pas-à-pas */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Comment procéder :
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

            {/* Boutons d'Action Directs */}
            <div className="flex flex-col gap-3 pt-2">
              <a
                href={`https://wa.me/${cleanNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm hover:shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmer mon don sur WhatsApp</span>
              </a>

              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-xs transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Demander un virement bancaire ou convention</span>
              </Link>
            </div>

            {/* Avertissement de Sécurité Strict */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed">
              <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Sécurité absolue :</strong> Le MIDH ne vous demandera <u>JAMAIS</u> votre code secret ou code PIN Mobile Money.
              </span>
            </div>
          </div>

          {/* Badge Reçu Fiscal & Certification */}
          <div className="bg-emerald-950 text-emerald-50 rounded-3xl p-6 border border-emerald-900 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Reçu fiscal &amp; Attestation officielle</h4>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Délivré systématiquement par la Trésorerie Générale pour chaque don reçu. L’attestation porte le cachet officiel de l’ONG et permet de justifier de vos actions caritatives et mécénats.
            </p>
            <div className="text-[11px] text-emerald-300 font-medium pt-1 border-t border-emerald-900 flex items-center justify-between">
              <span>Organisation agréée depuis 2000</span>
              <span>Abidjan, Côte d’Ivoire</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
