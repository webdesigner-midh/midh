import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Soutenir le MIDH | Faire un don pour la défense des droits humains',
  description: 'Soutenez les cliniques juridiques, l’assistance aux victimes et la veille citoyenne du Mouvement Ivoirien des Droits Humains en Côte d’Ivoire.',
};

export default function DonPage() {
  return (
    <div className="w-full bg-background py-space-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-space-2xl">
        {/* En-tête */}
        <div className="flex flex-col gap-space-xs text-center sm:text-left">
          <span className="font-label-lg text-xs sm:text-sm text-primary uppercase tracking-wider font-semibold">
            Solidarité Civique &amp; Financement
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-[#0B3827] font-extrabold leading-tight">
            Soutenir l&apos;action du MIDH
          </h1>
          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Vos dons garantissent l&apos;indépendance de notre veille, financent les cliniques juridiques gratuites et permettent d&apos;assister en justice les justiciables les plus vulnérables.
          </p>
        </div>

        {/* Pourquoi donner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px]">gavel</span>
            <h3 className="font-title-lg text-title-lg text-[#0B3827] font-bold">Assistance juridique</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Prise en charge des frais de procédure et de conseil pour les personnes démunies victimes d&apos;injustices.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px]">campaign</span>
            <h3 className="font-title-lg text-title-lg text-[#0B3827] font-bold">Veille &amp; Enquêtes</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Déploiement d&apos;observateurs indépendants lors des crises et des scrutins sur l&apos;ensemble du territoire.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px]">school</span>
            <h3 className="font-title-lg text-title-lg text-[#0B3827] font-bold">Éducation civique</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Organisation de sessions de formation aux droits fondamentaux dans les lycées et universités.
            </p>
          </div>
        </div>

        {/* Module de don Mobile Money (Transparence & Statut provisoire) */}
        <div className="bg-surface-container-lowest p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-secondary-container/50 text-secondary font-label-md text-label-md font-bold w-fit">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Intégration Passerelle Mobile Money</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-[#0B3827] font-bold">
              Faire un don par Mobile Money
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Conformément aux directives de sécurité, la passerelle de paiement en ligne (Orange Money, MTN MoMo, Wave ou Moov Money) est en cours de configuration officielle avec le prestataire bancaire agréé du MIDH.
            </p>
          </div>

          {/* Encart explicatif officiel */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-4">
            <h3 className="font-title-lg text-title-lg text-on-surface font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <span>Comment faire un don dès aujourd&apos;hui ?</span>
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Pour réaliser un don officiel sécurisé ou convenir d&apos;une convention de mécénat institutionnel, veuillez vous rapprocher directement de la Trésorerie Générale du MIDH :
            </p>
            <div className="bg-white p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-2 font-body-sm">
              <div>
                <strong>Bénéficiaire officiel :</strong> Mouvement Ivoirien des Droits Humains (MIDH)
              </div>
              <div>
                <strong>Ligne de contact dédiée :</strong>{' '}
                <a href="https://wa.me/2250101498739" className="text-primary font-bold hover:underline">
                  +225 01 01 49 87 39
                </a>
              </div>
              <div>
                <strong>Email officiel :</strong>{' '}
                <a href="mailto:info@midh-ci.org" className="text-primary hover:underline">
                  info@midh-ci.org
                </a>
              </div>
              <div>
                <strong>Reçu fiscal / Attestation de don :</strong> Délivré systématiquement sur demande auprès de la coordination à Abidjan Cocody Angré.
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-caption text-amber-900 leading-relaxed">
              <strong>Règle de sécurité stricte :</strong> Le MIDH ne vous demandera JAMAIS votre code secret ou code PIN Mobile Money. Tout paiement en ligne sera directement opéré via une page de redirection bancaire chiffrée SSL dès sa mise en service.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#138A2E] hover:bg-[#0F7326] text-white font-label-lg px-8 py-3.5 rounded-xl transition-colors shadow-xs"
            >
              <span>Contacter la trésorerie du MIDH</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>

            <Link
              href="/"
              className="text-body-sm text-tertiary hover:text-on-surface transition-colors"
            >
              Retour à la page d&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
