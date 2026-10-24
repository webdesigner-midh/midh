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
  MessageCircle,
  Coins,
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
    subtitle: 'Côte d’Ivoire (0% de frais)',
    badge: 'Recommandé',
    logo: '/images/payments/wave.png',
    color: '#00B2FE',
    bgLight: '#f0f9ff',
    borderColor: '#bae6fd',
    type: 'mobile_money',
    instructions: {
      steps: [
        'Ouvrez votre application mobile Wave',
        'Appuyez sur « Transférer » vers le numéro officiel : 01 01 49 87 39',
        'Vérifiez le titulaire officiel : MIDH / Mouvement Ivoirien des Droits Humains',
        'Saisissez le montant de votre choix et confirmez avec votre code secret',
      ],
      tips: 'Aucun frais de transfert pour le donateur ni pour l’ONG.',
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
        'Composez le #144# ou ouvrez l’application Orange Money Max',
        'Sélectionnez « Transfert d’argent » vers le numéro : 01 01 49 87 39',
        'Vérifiez le nom officiel du destinataire : MIDH',
        'Confirmez avec votre code secret personnel',
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
        'Composez le *133# ou ouvrez l’application MoMo CI',
        'Choisissez « Envoi d’argent » vers le numéro : 01 01 49 87 39',
        'Confirmez le compte certifié : MIDH',
        'Validez avec votre code PIN confidentiel',
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
        'Composez le *155# ou utilisez l’application Moov Money Flooz',
        'Effectuez un transfert direct au : 01 01 49 87 39',
        'Confirmez l’identité du bénéficiaire officiel : MIDH',
        'Validez votre transfert en toute sécurité',
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
        'Ouvrez votre application mobile Djamo',
        'Transférez vers le compte officiel MIDH : 01 01 49 87 39',
        'Indiquez en libellé : « Don MIDH »',
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
        'Pour les dons par Carte Bancaire Visa (Afrique, Europe, Amériques, Monde), contactez directement la Trésorerie du MIDH',
        'Un lien de paiement 3D-Secure crypté SSL vous est immédiatement transmis',
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
        'Rapprochez-vous de la Trésorerie Générale du MIDH par WhatsApp ou E-mail',
        'Un lien sécurisé conforme aux standards 3D-Secure vous est généré pour le montant de votre don',
        'Possibilité de virement bancaire institutionnel via RIB/IBAN officiel',
      ],
      tips: 'Accompagnement dédié pour les particuliers et mécènes internationaux.',
    },
  },
];

export default function DonationModule() {
  const [selectedOperator, setSelectedOperator] = useState<PaymentOperator>(PAYMENT_OPERATORS[0]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  const officialNumberDisplay = '01 01 49 87 39';
  const cleanNumber = '2250101498739';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('0101498739');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const amountText = customAmount ? ` de ${Number(customAmount).toLocaleString('fr-FR')} FCFA` : '';
  const whatsappMessage = encodeURIComponent(
    `Bonjour Trésorerie du MIDH,\n\nJe souhaite effectuer un don libre${amountText} via ${selectedOperator.name} pour soutenir vos actions de défense des droits humains.\n\nPourriez-vous m'accompagner et m'éditer mon reçu fiscal officiel ? Merci.`
  );

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Grille Principale : Opérateurs (Gauche) + Volet d'Instructions (Droite) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne Gauche : Sélection de l'opérateur Mobile Money (7 colonnes) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-2xl bg-[#0B3827] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                  1
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0B3827]">
                    Choisissez votre moyen de paiement
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sélectionnez votre opérateur Mobile Money ou carte bancaire
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 w-fit">
                Don 100% Libre
              </span>
            </div>

            {/* Grille des Logos Déposés */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
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

            {/* Champ Optionnel : Montant Libre Indicatif */}
            <div className="mt-2 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0B3827] flex items-center justify-center flex-shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <label htmlFor="custom-amount-input" className="text-xs sm:text-sm font-bold text-[#0B3827] block">
                    Montant de votre don (Optionnel)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Vous êtes libre de donner la somme de votre choix en FCFA
                  </span>
                </div>
              </div>

              <div className="relative w-full sm:w-48">
                <input
                  id="custom-amount-input"
                  type="number"
                  min="500"
                  step="500"
                  placeholder="Ex: 10 000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-bold text-[#0B3827] focus:outline-none focus:ring-2 focus:ring-[#0B3827]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  FCFA
                </span>
              </div>
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
                  Opérateur sélectionné
                </span>
                <h3 className="text-lg font-bold text-[#0B3827]">
                  {selectedOperator.name}
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedOperator.subtitle}
                </span>
              </div>
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
                  {officialNumberDisplay}
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
                Comment faire votre don :
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
                <span>Informer la Trésorerie par WhatsApp</span>
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
