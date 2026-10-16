import type { Metadata } from 'next';
import { getTeamMembers, getSiteOptions } from '@/services/wordpress';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'À propos du MIDH | Histoire, Missions et Gouvernance',
  description: 'Découvrez l’histoire du Mouvement Ivoirien des Droits Humains depuis sa fondation le 8 octobre 2000, ses missions, sa vision et sa gouvernance.',
};

export default async function AProposPage() {
  const [team, siteOptions] = await Promise.all([
    getTeamMembers(),
    getSiteOptions(),
  ]);

  const institutional = siteOptions.institutional || {};
  const heroTag = institutional.heroTag || 'Présentation Institutionnelle';
  const heroTitle = institutional.heroTitle || 'Fidèle aux valeurs de justice et de dignité depuis 2000.';
  const heroSubtitle = institutional.heroSubtitle || 'Le Mouvement Ivoirien des Droits Humains (MIDH) est une organisation non gouvernementale laïque, indépendante et à but non lucratif, régie par la loi ivoirienne.';
  const historyP1 = institutional.historyP1 || "Le Mouvement Ivoirien des Droits Humains (MIDH) a été fondé le 8 octobre 2000 en Côte d'Ivoire par un collectif de juristes, d'universitaires, de syndicalistes et de citoyens engagés, face aux défis majeurs de protection des libertés fondamentales et aux crises sociopolitiques de l'époque.";
  const historyP2 = institutional.historyP2 || "Dès sa création, le MIDH s'est distingué par sa rigueur documentaire, son impartialité et son courage civique. L'organisation a constamment maintenu une présence active de veille, d'assistance judiciaire aux victimes et d'interpellation des pouvoirs publics, sans jamais transiger sur son indépendance politique ou confessionnelle.";
  const mission = institutional.mission || "Assurer la promotion, la protection et la défense des droits de l'Homme reconnus, et œuvrer pour l'effectivité des droits économiques, sociaux et culturels de chaque citoyen en Côte d'Ivoire.";
  const vision = institutional.vision || "Une société ivoirienne démocratique, équitable et pacifiée, où la dignité inhérente à toute personne humaine est garantie et protégée par un État de droit exemplaire.";
  const values = institutional.values || "Indépendance, intégrité, solidarité, non-discrimination, vérité factuelle et engagement désintéressé au service des populations les plus vulnérables.";

  const teamPhotoUrl = institutional.teamPhotoUrl || '/images/midh-team-group.jpg';

  return (
    <div className="w-full bg-background pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-28">
      <div className="site-container flex flex-col gap-10 sm:gap-14">
        {/* En-tête de page institutionnelle */}
        <div className="max-w-3xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {heroTag}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] text-[#0B3827] font-bold tracking-tight leading-snug">
            {heroTitle}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
            {heroSubtitle}
          </p>
        </div>

        {/* Bloc Panoramique : Photo de groupe de toute l'équipe du MIDH */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 shadow-md group bg-slate-900">
          <div className="relative aspect-[16/10] sm:aspect-[21/9] md:aspect-[2.4/1] w-full overflow-hidden">
            <img
              src={teamPhotoUrl}
              alt="Membres du MIDH réunis en assemblée générale"
              className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            {/* Dégradé subtil bas pour mise en valeur des informations */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Badges institutionnels superposés en bas */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium shadow-sm">
                <span className="material-symbols-outlined text-base sm:text-lg text-emerald-400">group</span>
                <span>Collectif &amp; Membres du MIDH</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-base sm:text-lg text-emerald-400">location_on</span>
                <span>Siège National • Abidjan, Côte d&apos;Ivoire</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Historique */}
        <section className="bg-surface-container-lowest p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-outline-variant/30 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-secondary-container/60 text-primary flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">history_edu</span>
            </span>
            <h2 className="font-headline-sm text-lg sm:text-xl text-[#0B3827] font-bold">
              Notre Histoire
            </h2>
          </div>
          <div className="space-y-4 font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-4xl">
            <p>{historyP1}</p>
            {historyP2 && <p>{historyP2}</p>}
          </div>
        </section>

        {/* Section Missions, Vision & Valeurs */}
        <section id="missions" className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px] sm:text-[36px]">flag</span>
            <h3 className="font-title-lg text-base sm:text-lg text-[#0B3827] font-bold">Notre Mission</h3>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {mission}
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px] sm:text-[36px]">visibility</span>
            <h3 className="font-title-lg text-base sm:text-lg text-[#0B3827] font-bold">Notre Vision</h3>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {vision}
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px] sm:text-[36px]">balance</span>
            <h3 className="font-title-lg text-base sm:text-lg text-[#0B3827] font-bold">Nos Valeurs</h3>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              {values}
            </p>
          </div>
        </section>

        {/* Gouvernance & Équipe */}
        <section id="equipe" className="flex flex-col gap-space-lg pt-space-md">
          <div className="max-w-2xl flex flex-col gap-2">
            <span className="font-label-lg text-xs sm:text-sm text-primary uppercase tracking-wider font-semibold">
              Gouvernance &amp; Direction
            </span>
            <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-[#0B3827] font-bold">
              L&apos;Équipe dirigeante du MIDH
            </h2>
            <p className="font-body-md text-body-md text-tertiary">
              Données administrées depuis le back-office WordPress (organigramme en cours d&apos;actualisation après validation statutaire).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="group bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-700/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1.5"
              >
                {/* Photo Portrait Card Header */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-slate-100 to-slate-200">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900/5 via-slate-100 to-emerald-800/10 text-emerald-800 p-6">
                      <div className="w-24 h-24 rounded-full bg-emerald-700/10 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-5xl text-emerald-800">person</span>
                      </div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-emerald-900/60">
                        Portrait officiel en cours
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                  {/* Role Floating Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-md backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                      {member.role || "Membre de l'équipe"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl sm:text-2xl text-[#0B3827] tracking-tight group-hover:text-emerald-700 transition-colors">
                      {member.fullName}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mt-1">
                      {member.role}
                    </p>

                    {member.biography ? (
                      <p className="mt-4 text-sm text-slate-600 leading-relaxed font-normal line-clamp-4">
                        {member.biography}
                      </p>
                    ) : (
                      <p className="mt-4 text-sm text-slate-400 italic">
                        Membre statutaire engagé au sein des instances dirigeantes du MIDH.
                      </p>
                    )}
                  </div>

                  {/* Contact & Social Links */}
                  {(member.email || member.linkedin || member.twitter) && (
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-600 flex items-center justify-center transition-all"
                          title="Envoyer un courriel"
                        >
                          <span className="material-symbols-outlined text-[18px]">mail</span>
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-[#0077b5] hover:text-white text-slate-600 flex items-center justify-center transition-all font-bold text-xs"
                          title="Profil LinkedIn"
                        >
                          in
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-black hover:text-white text-slate-600 flex items-center justify-center transition-all font-bold text-xs"
                          title="Profil X (Twitter)"
                        >
                          𝕏
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Contact */}
        <div className="bg-[#0B3827] text-white p-8 sm:p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-headline-sm text-headline-sm font-bold">Vous souhaitez échanger avec notre équipe ?</h3>
            <p className="font-body-sm text-surface-variant max-w-xl">
              Notre siège à Abidjan Cocody Angré est ouvert pour toute requête d&apos;assistance juridique ou proposition de partenariat civique.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-[#138A2E] hover:bg-[#0F7326] text-white font-label-lg px-6 py-3 rounded-lg transition-colors"
          >
            Contacter le secrétariat
          </Link>
        </div>
      </div>
    </div>
  );
}
