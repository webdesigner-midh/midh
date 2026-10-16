import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | MIDH',
  description: 'Politique de protection des données personnelles et de traitement des requêtes des justiciables par le MIDH.',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="w-full bg-background py-space-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-space-xl">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-[#0B3827] font-extrabold leading-tight">
          Politique de Confidentialité &amp; Protection des Données
        </h1>

        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-title-lg text-[#0B3827] font-bold mb-2">1. Engagement éthique du MIDH</h2>
            <p>
              En tant qu&apos;organisation de défense des droits humains, le MIDH place la confidentialité, la sécurité et la discrétion au cœur de son action. Aucune information collectée lors d&apos;un signalement ou d&apos;une demande d&apos;assistance juridique n&apos;est divulguée à des tiers sans le consentement préalable, libre et éclairé de la personne concernée.
            </p>
          </section>

          <section>
            <h2 className="font-title-lg text-[#0B3827] font-bold mb-2">2. Données collectées</h2>
            <p>
              Nous collectons uniquement les informations strictement nécessaires aux finalités suivantes :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Formulaire de contact :</strong> Nom, prénom, e-mail, téléphone (facultatif), objet et contenu du message pour assurer le traitement de votre demande.</li>
              <li><strong>Formulaire de bénévolat :</strong> Coordonnées et motivations pour l&apos;intégration dans nos sections locales.</li>
              <li><strong>Lettre d&apos;information (Newsletter) :</strong> Adresse e-mail avec confirmation de consentement.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-title-lg text-[#0B3827] font-bold mb-2">3. Durée de conservation &amp; Sécurité</h2>
            <p>
              Les données sont chiffrées en transit (protocole HTTPS / TLS) et conservées sur des serveurs sécurisés. Elles ne sont conservées que pendant la durée nécessaire à l&apos;instruction du dossier ou jusqu&apos;à demande expresse de suppression.
            </p>
          </section>

          <section>
            <h2 className="font-title-lg text-[#0B3827] font-bold mb-2">4. Exercice de vos droits</h2>
            <p>
              Conformément aux principes de protection des données, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour toute demande, écrivez-nous à : <a href="mailto:contact@midh-ci.org" className="text-primary font-bold hover:underline">contact@midh-ci.org</a>.
            </p>
          </section>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-primary font-semibold">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>
    </div>
  );
}
