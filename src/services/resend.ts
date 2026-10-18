import { Resend } from 'resend';

// Initialisation du client Resend avec la variable d'environnement sécurisée
const resendApiKey = process.env.RESEND_API_KEY;
export const resend = new Resend(resendApiKey);

// Expéditeur officiel vérifié dans Resend
export const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'MIDH <contact@midh-ci.org>';

// URL du logo officiel du MIDH (hébergé sur CDN global haute disponibilité)
export const LOGO_MIDH_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDqleL8xzGZSLZrm2GJ1CkOLa3XtfT-YB-qju_J3cgaA7uVqvANt-B6jBuOtXUvm3yFvyb03jR7ahcjyvlLOZEpRfv0bNvT7SNgtz-lguwRFFE9hFySm4XIkh67F3xF4EZodlXLuBhLjXS00O1IcyEXBpdDKkQNx8da-SITyDTmbfgXfQD7uv3cGb3IEew3hoQXcaXCdv7J5wUJWBfeVCsRzWifeF4jh7ldsz4l74QWSxnSTY_Iz9vjMSu9ojWTkBmGmA';

// Destinataires par défaut de l'équipe MIDH
export function getRecipients(): string[] {
  const envRecipients = process.env.CONTACT_FORM_RECIPIENT;
  if (!envRecipients) {
    return ['contact@midh-ci.org', 'brahimacoulibaly7777@gmail.com'];
  }
  return envRecipients.split(',').map((e) => e.trim()).filter(Boolean);
}

/**
 * Nettoyage et formatage du numéro pour lien WhatsApp
 */
function cleanPhoneForWhatsApp(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Envoi d'un e-mail institutionnel pour le formulaire de contact
 */
export async function sendContactNotification({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const recipients = getRecipients();
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Abidjan',
  });
  const waNumber = cleanPhoneForWhatsApp(phone);

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>[MIDH] Nouveau message : ${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f4f1; padding: 30px 10px;">
        <tr>
          <td align="center">
            
            <!-- Carte principale -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(11, 56, 39, 0.1), 0 8px 10px -6px rgba(11, 56, 39, 0.05); border: 1px solid #e2e8f0;">
              
              <!-- En-tête prestige avec dégradé vert institutionnel -->
              <tr>
                <td style="background: linear-gradient(135deg, #07261a 0%, #0B3827 50%, #12573c 100%); padding: 36px 30px 28px 30px; text-align: center;">
                  
                  <!-- Conteneur Logo avec fond blanc pur -->
                  <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 16px auto;">
                    <tr>
                      <td style="background-color: #ffffff; padding: 10px 22px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                        <img src="${LOGO_MIDH_URL}" alt="Logo MIDH" width="130" style="display: block; max-height: 48px; width: auto; margin: 0 auto;" />
                      </td>
                    </tr>
                  </table>

                  <!-- Titre officiel -->
                  <h1 style="margin: 0 0 6px 0; font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                    Mouvement Ivoirien des Droits Humains
                  </h1>
                  
                  <!-- Devise / Slogan -->
                  <p style="margin: 0 0 16px 0; font-size: 12.5px; color: #a7f3d0; font-style: italic; letter-spacing: 0.3px;">
                    « Agir pour la Dignité Humaine, la Justice et la Démocratie »
                  </p>

                  <!-- Badge Notification Type -->
                  <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 20px; padding: 6px 16px; font-size: 11.5px; font-weight: 700; color: #ffffff; letter-spacing: 0.8px; text-transform: uppercase;">
                        ✉️ Nouveau message via le site web
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Corps du message -->
              <tr>
                <td style="padding: 32px 30px 24px 30px;">
                  
                  <!-- Fiche Expéditeur -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 20px;">
                        
                        <!-- Nom et Email -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px;">
                          <tr>
                            <td width="30" valign="top" style="padding-top: 2px;">
                              <span style="font-size: 16px;">👤</span>
                            </td>
                            <td>
                              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Expéditeur</div>
                              <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                                ${name}
                              </div>
                              <div style="font-size: 13.5px; color: #0284c7; margin-top: 2px;">
                                <a href="mailto:${email}" style="color: #0284c7; text-decoration: none; font-weight: 500;">${email}</a>
                              </div>
                            </td>
                          </tr>
                        </table>

                        ${phone ? `
                        <!-- Téléphone / WhatsApp -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                          <tr>
                            <td width="30" valign="top" style="padding-top: 2px;">
                              <span style="font-size: 16px;">📞</span>
                            </td>
                            <td>
                              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Téléphone / WhatsApp</div>
                              <div style="font-size: 14.5px; font-weight: 600; color: #0f172a; margin-top: 2px;">
                                <a href="tel:${phone}" style="color: #0f172a; text-decoration: none;">${phone}</a>
                              </div>
                            </td>
                          </tr>
                        </table>` : ''}

                        <!-- Date et Heure -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #f1f5f9; padding-top: 12px;">
                          <tr>
                            <td width="30" valign="top" style="padding-top: 2px;">
                              <span style="font-size: 16px;">🗓️</span>
                            </td>
                            <td>
                              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Date de transmission</div>
                              <div style="font-size: 13.5px; font-weight: 500; color: #475569; margin-top: 2px;">
                                ${dateStr} (Heure d'Abidjan)
                              </div>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>

                  <!-- Objet du message -->
                  <div style="margin-bottom: 10px;">
                    <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px;">
                      Objet de la demande
                    </span>
                  </div>
                  <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 800; color: #0B3827; line-height: 1.4;">
                    ${subject}
                  </h2>

                  <!-- Boîte du contenu du message -->
                  <div style="background-color: #fcfdfc; border-left: 4px solid #0B3827; border-top: 1px solid #eef2ef; border-right: 1px solid #eef2ef; border-bottom: 1px solid #eef2ef; border-radius: 8px; padding: 20px 22px; margin-bottom: 28px;">
                    <div style="font-size: 14.5px; line-height: 1.7; color: #334155; white-space: pre-wrap;">${message}</div>
                  </div>

                  <!-- Boutons d'action rapide -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 0 8px 10px 8px;">
                              <a href="mailto:${email}?subject=Re: [MIDH] ${encodeURIComponent(subject)}" 
                                 style="display: inline-block; background: linear-gradient(135deg, #0B3827 0%, #12573c 100%); color: #ffffff !important; text-decoration: none; padding: 13px 26px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 10px rgba(11, 56, 39, 0.25);">
                                ✉️ Répondre à ${name}
                              </a>
                            </td>
                            ${waNumber ? `
                            <td style="padding: 0 8px 10px 8px;">
                              <a href="https://wa.me/${waNumber}" 
                                 target="_blank"
                                 style="display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; padding: 13px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.25);">
                                💬 Écrire sur WhatsApp
                              </a>
                            </td>` : ''}
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Signature officielle & Contacts institutionnels -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 26px 30px;">
                  
                  <!-- Titre signature -->
                  <div style="font-size: 13px; font-weight: 800; color: #0B3827; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; text-align: center;">
                    Mouvement Ivoirien des Droits Humains (MIDH)
                  </div>
                  
                  <div style="font-size: 11.5px; color: #64748b; text-align: center; margin-bottom: 16px;">
                    Organisation Non Gouvernementale régie par la loi N° 60-315 du 21 septembre 1960 • Fondée le 08 Octobre 2000
                  </div>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px dashed #cbd5e1; padding-top: 16px;">
                    <tr>
                      <td style="font-size: 12px; color: #475569; line-height: 1.7; text-align: center;">
                        📍 <strong>Siège social :</strong> Abidjan, Cocody Angré, Carrefour Duncan, Côte d'Ivoire<br>
                        📞 <strong>Ligne directe / WhatsApp :</strong> +225 01 01 49 87 39 &nbsp;|&nbsp; ☎️ +225 27 22 52 35 15<br>
                        ✉️ <strong>Courriel officiel :</strong> <a href="mailto:contact@midh-ci.org" style="color: #0B3827; text-decoration: none; font-weight: 600;">contact@midh-ci.org</a> &nbsp;|&nbsp; 🌐 <strong>Site web :</strong> <a href="https://www.midh-ci.org" style="color: #0B3827; text-decoration: none; font-weight: 600;">www.midh-ci.org</a>
                      </td>
                    </tr>
                  </table>

                  <!-- Mention d'accréditation CADHP -->
                  <div style="margin-top: 16px; text-align: center;">
                    <span style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 10.5px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; border: 1px solid #fde68a;">
                      🏛️ Statut d'observateur auprès de la Commission Africaine des Droits de l'Homme et des Peuples (CADHP)
                    </span>
                  </div>

                  <!-- Copyright bas -->
                  <div style="margin-top: 18px; font-size: 10.5px; color: #94a3b8; text-align: center;">
                    Ce message a été généré automatiquement par le portail officiel www.midh-ci.org via le système certifié Resend.
                  </div>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  return await resend.emails.send({
    from: DEFAULT_FROM,
    to: recipients,
    replyTo: email,
    subject: `[Contact MIDH] ${subject} - de ${name}`,
    html: htmlContent,
  });
}

/**
 * Envoi d'un e-mail institutionnel pour une nouvelle candidature bénévole
 */
export async function sendVolunteerNotification({
  nom,
  prenom,
  email,
  phone,
  location,
  domain,
  availability,
  message,
}: {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  location: string;
  domain?: string;
  availability?: string;
  message?: string;
}) {
  const recipients = getRecipients();
  const fullName = `${prenom} ${nom}`;
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Abidjan',
  });
  const waNumber = cleanPhoneForWhatsApp(phone);

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>[MIDH Bénévolat] Candidature de ${fullName}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0f4f1; padding: 30px 10px;">
        <tr>
          <td align="center">
            
            <!-- Carte principale -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(11, 56, 39, 0.1), 0 8px 10px -6px rgba(11, 56, 39, 0.05); border: 1px solid #e2e8f0;">
              
              <!-- En-tête prestige avec dégradé vert institutionnel -->
              <tr>
                <td style="background: linear-gradient(135deg, #07261a 0%, #0B3827 50%, #12573c 100%); padding: 36px 30px 28px 30px; text-align: center;">
                  
                  <!-- Conteneur Logo avec fond blanc pur -->
                  <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 16px auto;">
                    <tr>
                      <td style="background-color: #ffffff; padding: 10px 22px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                        <img src="${LOGO_MIDH_URL}" alt="Logo MIDH" width="130" style="display: block; max-height: 48px; width: auto; margin: 0 auto;" />
                      </td>
                    </tr>
                  </table>

                  <!-- Titre officiel -->
                  <h1 style="margin: 0 0 6px 0; font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                    Mouvement Ivoirien des Droits Humains
                  </h1>
                  
                  <!-- Devise / Slogan -->
                  <p style="margin: 0 0 16px 0; font-size: 12.5px; color: #a7f3d0; font-style: italic; letter-spacing: 0.3px;">
                    « Agir pour la Dignité Humaine, la Justice et la Démocratie »
                  </p>

                  <!-- Badge Notification Type -->
                  <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 20px; padding: 6px 16px; font-size: 11.5px; font-weight: 700; color: #ffffff; letter-spacing: 0.8px; text-transform: uppercase;">
                        🤝 Nouvelle candidature bénévole
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Corps du message -->
              <tr>
                <td style="padding: 32px 30px 24px 30px;">
                  
                  <!-- En-tête profil candidat -->
                  <div style="margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #166534; letter-spacing: 0.8px; margin-bottom: 4px;">Fiche Candidat(e)</div>
                    <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #0B3827;">${fullName}</h2>
                    <div style="font-size: 13px; color: #64748b; margin-top: 4px;">📍 Résidence : <strong>${location}</strong></div>
                  </div>

                  <!-- Fiche Bénévole détaillée -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 20px;">
                        
                        <!-- Contact direct -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                          <tr>
                            <td width="30" valign="top" style="padding-top: 2px;">
                              <span style="font-size: 16px;">✉️</span>
                            </td>
                            <td>
                              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Email</div>
                              <div style="font-size: 14.5px; font-weight: 600; color: #0284c7; margin-top: 2px;">
                                <a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                          <tr>
                            <td width="30" valign="top" style="padding-top: 2px;">
                              <span style="font-size: 16px;">📞</span>
                            </td>
                            <td>
                              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Téléphone / WhatsApp</div>
                              <div style="font-size: 14.5px; font-weight: 700; color: #0f172a; margin-top: 2px;">
                                <a href="tel:${phone}" style="color: #0f172a; text-decoration: none;">${phone}</a>
                              </div>
                            </td>
                          </tr>
                        </table>

                        ${domain ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                          <tr>
                            <td width="30" valign="top" style="padding-top: 2px;">
                              <span style="font-size: 16px;">🎯</span>
                            </td>
                            <td>
                              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Domaine de compétence souhaité</div>
                              <div style="font-size: 14px; font-weight: 700; color: #166534; margin-top: 2px;">
                                ${domain}
                              </div>
                            </td>
                          </tr>
                        </table>` : ''}

                        ${availability ? `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                          <tr>
                            <td width="30" valign="top" style="padding-top: 2px;">
                              <span style="font-size: 16px;">⏱️</span>
                            </td>
                            <td>
                              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Disponibilité</div>
                              <div style="font-size: 13.5px; font-weight: 600; color: #334155; margin-top: 2px;">
                                ${availability}
                              </div>
                            </td>
                          </tr>
                        </table>` : ''}

                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #f1f5f9; padding-top: 12px;">
                          <tr>
                            <td width="30" valign="top" style="padding-top: 2px;">
                              <span style="font-size: 16px;">🗓️</span>
                            </td>
                            <td>
                              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">Date de soumission</div>
                              <div style="font-size: 13px; font-weight: 500; color: #64748b; margin-top: 2px;">
                                ${dateStr} (Heure d'Abidjan)
                              </div>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>

                  ${message ? `
                  <!-- Motivations -->
                  <div style="margin-bottom: 10px;">
                    <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px;">
                      Motivations & Expériences du candidat
                    </span>
                  </div>
                  <div style="background-color: #fcfdfc; border-left: 4px solid #16a34a; border-top: 1px solid #eef2ef; border-right: 1px solid #eef2ef; border-bottom: 1px solid #eef2ef; border-radius: 8px; padding: 20px 22px; margin-bottom: 28px;">
                    <div style="font-size: 14.5px; line-height: 1.7; color: #334155; white-space: pre-wrap;">${message}</div>
                  </div>` : ''}

                  <!-- Boutons d'action -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="padding: 0 8px 10px 8px;">
                              <a href="mailto:${email}?subject=Votre candidature bénévole au sein du MIDH" 
                                 style="display: inline-block; background: linear-gradient(135deg, #0B3827 0%, #12573c 100%); color: #ffffff !important; text-decoration: none; padding: 13px 26px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 10px rgba(11, 56, 39, 0.25);">
                                ✉️ Contacter ${prenom} par Email
                              </a>
                            </td>
                            ${waNumber ? `
                            <td style="padding: 0 8px 10px 8px;">
                              <a href="https://wa.me/${waNumber}" 
                                 target="_blank"
                                 style="display: inline-block; background-color: #25D366; color: #ffffff !important; text-decoration: none; padding: 13px 22px; border-radius: 8px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.25);">
                                💬 Échanger sur WhatsApp
                              </a>
                            </td>` : ''}
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Signature officielle & Contacts institutionnels -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 26px 30px;">
                  
                  <div style="font-size: 13px; font-weight: 800; color: #0B3827; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; text-align: center;">
                    Mouvement Ivoirien des Droits Humains (MIDH)
                  </div>
                  
                  <div style="font-size: 11.5px; color: #64748b; text-align: center; margin-bottom: 16px;">
                    Organisation Non Gouvernementale régie par la loi N° 60-315 du 21 septembre 1960 • Fondée le 08 Octobre 2000
                  </div>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px dashed #cbd5e1; padding-top: 16px;">
                    <tr>
                      <td style="font-size: 12px; color: #475569; line-height: 1.7; text-align: center;">
                        📍 <strong>Siège social :</strong> Abidjan, Cocody Angré, Carrefour Duncan, Côte d'Ivoire<br>
                        📞 <strong>Ligne directe / WhatsApp :</strong> +225 01 01 49 87 39 &nbsp;|&nbsp; ☎️ +225 27 22 52 35 15<br>
                        ✉️ <strong>Courriel officiel :</strong> <a href="mailto:contact@midh-ci.org" style="color: #0B3827; text-decoration: none; font-weight: 600;">contact@midh-ci.org</a> &nbsp;|&nbsp; 🌐 <strong>Site web :</strong> <a href="https://www.midh-ci.org" style="color: #0B3827; text-decoration: none; font-weight: 600;">www.midh-ci.org</a>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top: 16px; text-align: center;">
                    <span style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 10.5px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; border: 1px solid #fde68a;">
                      🏛️ Statut d'observateur auprès de la Commission Africaine des Droits de l'Homme et des Peuples (CADHP)
                    </span>
                  </div>

                  <div style="margin-top: 18px; font-size: 10.5px; color: #94a3b8; text-align: center;">
                    Ce message a été généré automatiquement par le portail officiel www.midh-ci.org via le système certifié Resend.
                  </div>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  return await resend.emails.send({
    from: DEFAULT_FROM,
    to: recipients,
    replyTo: email,
    subject: `[Bénévolat MIDH] Nouvelle candidature de ${fullName} (${location})`,
    html: htmlContent,
  });
}

/**
 * Envoi d'une alerte à l'équipe MIDH lors d'une nouvelle inscription à la newsletter
 */
export async function sendNewsletterNotificationToTeam({
  subscriberEmail,
}: {
  subscriberEmail: string;
}) {
  const recipients = getRecipients();
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Abidjan',
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>[MIDH] Nouvel abonné Newsletter</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 30px 10px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #07261a 0%, #0B3827 50%, #12573c 100%); padding: 30px; text-align: center;">
                  <img src="${LOGO_MIDH_URL}" alt="Logo MIDH" width="130" style="background:#fff; padding:8px 18px; border-radius:10px; margin-bottom:12px; display:inline-block;" />
                  <h1 style="margin: 0; font-size: 18px; font-weight: 800; color: #ffffff; text-transform: uppercase;">
                    Lettre d'Information MIDH
                  </h1>
                  <p style="margin: 6px 0 0 0; font-size: 12px; color: #a7f3d0;">
                    Nouvelle souscription enregistrée sur le portail web
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px;">
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px;">
                      Adresse e-mail du nouvel abonné
                    </div>
                    <div style="font-size: 17px; font-weight: 800; color: #0B3827;">
                      <a href="mailto:${subscriberEmail}" style="color: #0B3827; text-decoration: none;">${subscriberEmail}</a>
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                      🗓️ <strong>Date :</strong> ${dateStr} (Heure d'Abidjan)<br>
                      🌐 <strong>Origine :</strong> Formulaire d'accueil du site officiel
                    </div>
                  </div>

                  <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 6px; padding: 14px 18px; font-size: 13.5px; color: #166534; line-height: 1.6; margin-bottom: 24px;">
                    💡 <strong>Gestion WordPress :</strong> Cette adresse est automatiquement enregistrée dans votre menu WordPress <strong>« Abonnés Newsletter »</strong>. Vous pouvez exporter la liste complète au format Excel / CSV à tout moment.
                  </div>

                  <table align="center" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <a href="https://cms.midh-ci.org/wp-admin/edit.php?post_type=midh_subscriber" 
                           style="display: inline-block; background-color: #0B3827; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 13.5px;">
                          📊 Consulter la liste des abonnés dans WordPress
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                  Mouvement Ivoirien des Droits Humains (MIDH) — Notification automatique
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  return await resend.emails.send({
    from: DEFAULT_FROM,
    to: recipients,
    subject: `[MIDH Newsletter] Nouvel abonné : ${subscriberEmail}`,
    html: htmlContent,
  });
}

/**
 * Envoi d'un e-mail officiel de bienvenue et de confirmation à l'abonné
 */
export async function sendNewsletterWelcomeEmail({
  subscriberEmail,
}: {
  subscriberEmail: string;
}) {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="utf-8">
      <title>Bienvenue sur la lettre d'information du MIDH</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f0f4f1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 30px 10px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #07261a 0%, #0B3827 50%, #12573c 100%); padding: 34px 30px; text-align: center;">
                  <img src="${LOGO_MIDH_URL}" alt="Logo MIDH" width="130" style="background:#fff; padding:8px 18px; border-radius:10px; margin-bottom:14px; display:inline-block;" />
                  <h1 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: #ffffff;">
                    MOUVEMENT IVOIRIEN DES DROITS HUMAINS
                  </h1>
                  <p style="margin: 0; font-size: 13px; color: #a7f3d0; font-style: italic;">
                    « Agir pour la Dignité Humaine, la Justice et la Démocratie »
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding: 34px 30px;">
                  <h2 style="font-size: 17px; font-weight: 800; color: #0B3827; margin: 0 0 14px 0;">
                    Votre inscription est confirmée !
                  </h2>

                  <p style="font-size: 14.5px; line-height: 1.7; color: #334155; margin: 0 0 16px 0;">
                    Bonjour,
                  </p>

                  <p style="font-size: 14.5px; line-height: 1.7; color: #334155; margin: 0 0 20px 0;">
                    Nous vous remercions pour votre intérêt envers l'action du <strong>Mouvement Ivoirien des Droits Humains (MIDH)</strong>. Votre adresse (<code>${subscriberEmail}</code>) a bien été enregistrée dans notre liste de diffusion officielle.
                  </p>

                  <div style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px;">
                    <div style="font-size: 12.5px; font-weight: 700; color: #0B3827; text-transform: uppercase; margin-bottom: 10px;">
                      Ce que vous recevrez en priorité :
                    </div>
                    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
                      <li>📑 <strong>Rapports d'enquêtes &amp; plaidoyers</strong> sur l'état des droits fondamentaux.</li>
                      <li>📢 <strong>Communiqués officiels &amp; déclarations</strong> du Bureau Exécutif National.</li>
                      <li>⚖️ <strong>Informations sur nos cliniques juridiques</strong> et actions auprès des populations.</li>
                    </ul>
                  </div>

                  <table align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 28px auto 10px auto;">
                    <tr>
                      <td style="padding: 0 6px;">
                        <a href="https://www.midh-ci.org/documents-rapports" 
                           style="display: inline-block; background-color: #0B3827; color: #ffffff !important; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-weight: 700; font-size: 13.5px;">
                          📚 Consulter nos rapports
                        </a>
                      </td>
                      <td style="padding: 0 6px;">
                        <a href="https://www.midh-ci.org/nos-actions" 
                           style="display: inline-block; background-color: #e2e8f0; color: #0f172a !important; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-weight: 700; font-size: 13.5px;">
                          🤝 Nos actions de terrain
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 11.5px; color: #64748b; line-height: 1.6; border-top: 1px solid #e2e8f0;">
                  📍 <strong>Siège :</strong> Abidjan, Cocody Angré, Carrefour Duncan, Côte d'Ivoire<br>
                  📞 <strong>Ligne directe :</strong> +225 01 01 49 87 39 &nbsp;|&nbsp; ✉️ <a href="mailto:contact@midh-ci.org" style="color:#0B3827; text-decoration:none;">contact@midh-ci.org</a><br>
                  <span style="font-size:10.5px; color:#94a3b8; display:block; margin-top:8px;">
                    Vous recevez cet e-mail car vous vous êtes inscrit(e) sur www.midh-ci.org. Pour vous désabonner à tout moment, répondez simplement « Désabonnement » à ce message.
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  return await resend.emails.send({
    from: DEFAULT_FROM,
    to: subscriberEmail,
    subject: `Bienvenue sur la lettre d'information du MIDH`,
    html: htmlContent,
  });
}

