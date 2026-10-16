import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales | MIDH',
  description: 'Mentions légales et informations administratives relatives au site institutionnel du MIDH.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="w-full bg-background py-space-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-space-xl">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] text-[#0B3827] font-extrabold leading-tight">
          Mentions Légales
        </h1>

        <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-title-lg text-[#0B3827] font-bold mb-2">1. Éditeur de la plateforme</h2>
            <p>
              Le présent site internet institutionnel est édité par le <strong>Mouvement Ivoirien des Droits Humains (MIDH)</strong>, Organisation Non Gouvernementale régie par les lois en vigueur en République de Côte d&apos;Ivoire.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Date de fondation :</strong> 08 octobre 2000 à Abidjan</li>
              <li><strong>Siège national :</strong> Abidjan, Cocody Angré, Carrefour les Oscars, République de Côte d&apos;Ivoire</li>
              <li><strong>Téléphone / WhatsApp :</strong> +225 01 01 49 87 39</li>
              <li><strong>Email de contact :</strong> contact@midh-ci.org</li>
            </ul>
          </section>

          <section>
            <h2 className="font-title-lg text-[#0B3827] font-bold mb-2">2. Direction de la publication</h2>
            <p>
              La direction de la publication est assurée par le Bureau Exécutif National du MIDH.
            </p>
          </section>

          <section>
            <h2 className="font-title-lg text-[#0B3827] font-bold mb-2">3. Hébergement de l&apos;application</h2>
            <p>
              Le frontend applicatif Next.js est conçu pour un déploiement sécurisé sur infrastructure cloud haute disponibilité (ex. Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723).
            </p>
            <p className="mt-1">
              Le back-office WordPress Headless est hébergé sur infrastructure dédiée PHP/MySQL avec chiffrement SSL/TLS continu.
            </p>
          </section>

          <section>
            <h2 className="font-title-lg text-[#0B3827] font-bold mb-2">4. Propriété intellectuelle</h2>
            <p>
              Tous les textes, communiqués, rapports officiels, photographies et éléments graphiques publiés sur ce site sont la propriété exclusive du MIDH ou font l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute reproduction partielle ou totale à des fins d&apos;information civique ou de recherche est autorisée sous réserve de la mention explicite de la source « Mouvement Ivoirien des Droits Humains (MIDH) ».
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
