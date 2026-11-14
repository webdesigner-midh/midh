'use client';

import React, { useState } from 'react';
import { MIDHTeamMember } from '@/types/wordpress';

interface TeamTabsProps {
  team: MIDHTeamMember[];
}

export default function TeamTabs({ team }: TeamTabsProps) {
  const [activeTab, setActiveTab] = useState<'actuel' | 'ancien'>('actuel');

  const currentTeam = team.filter((m) => m.mandateStatus !== 'ancien');
  const formerTeam = team.filter((m) => m.mandateStatus === 'ancien');

  const displayedMembers = activeTab === 'actuel' ? currentTeam : formerTeam;

  return (
    <div className="flex flex-col gap-8">
      {/* En-tête avec Titre à gauche et Sélecteur d'onglets à droite */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200/60">
        <div className="max-w-2xl flex flex-col gap-2">
          <span className="font-label-lg text-xs sm:text-sm text-primary uppercase tracking-wider font-semibold">
            Gouvernance &amp; Direction
          </span>
          <h2 className="font-headline-lg text-xl sm:text-2xl md:text-3xl text-[#0B3827] font-bold">
            {activeTab === 'actuel'
              ? "L'Équipe dirigeante du MIDH"
              : 'Anciennes équipes dirigeantes & Mandats passés'}
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-slate-600 leading-relaxed">
            {activeTab === 'actuel'
              ? "Organigramme en exercice administré depuis le back-office WordPress après validation statutaire."
              : 'Historique des responsables ayant présidé et administré les instances du MIDH depuis l’an 2000.'}
          </p>
        </div>

        {/* Onglets interactifs (Positionnés dans le rectangle rouge) */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-xs self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('actuel')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'actuel'
                ? 'bg-[#0B3827] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                activeTab === 'actuel' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>Direction actuelle</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                activeTab === 'actuel'
                  ? 'bg-white/20 text-emerald-100'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {currentTeam.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ancien')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
              activeTab === 'ancien'
                ? 'bg-[#0B3827] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-base">history</span>
            <span>Anciennes équipes</span>
            {formerTeam.length > 0 && (
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  activeTab === 'ancien'
                    ? 'bg-white/20 text-emerald-100'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {formerTeam.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Grille des membres */}
      {displayedMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in-50 duration-300">
          {displayedMembers.map((member) => (
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
                      <span className="material-symbols-outlined text-5xl text-emerald-800">
                        {activeTab === 'actuel' ? 'person' : 'history_edu'}
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-emerald-900/60 text-center">
                      {activeTab === 'actuel'
                        ? 'Portrait officiel en cours'
                        : 'Archives photographiques du mandat'}
                    </span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

                {/* Role Floating Badge */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md ${
                      activeTab === 'actuel'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-800/90 text-emerald-200 border border-emerald-500/30'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activeTab === 'actuel' ? 'bg-emerald-300 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {member.mandatePeriod
                      ? `Mandat ${member.mandatePeriod}`
                      : member.role || (activeTab === 'actuel' ? "Membre de l'équipe" : "Ancien dirigeant")}
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
                      {activeTab === 'actuel'
                        ? 'Membre statutaire engagé au sein des instances dirigeantes du MIDH.'
                        : 'Responsable ayant exercé des fonctions de gouvernance et de direction au sein du MIDH.'}
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
      ) : (
        /* État vide élégant pour les anciennes équipes si WordPress n'en a pas encore */
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-4 max-w-2xl mx-auto animate-in fade-in-50 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100/70 text-[#0B3827] flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">history_edu</span>
          </div>
          <h3 className="font-bold text-xl text-[#0B3827]">
            Archives des mandats précédents
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
            Les fiches des anciens responsables et bureaux exécutifs ayant servi le MIDH depuis l’an 2000 sont en cours d’intégration et de numérisation par le secrétariat.
          </p>
          <div className="pt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200/60">
            🏛️ Consultable dès publication par les administrateurs dans le back-office WordPress.
          </div>
        </div>
      )}
    </div>
  );
}
