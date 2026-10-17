import { Resend } from 'resend';

// Initialisation du client Resend avec la variable d'environnement sécurisée
const resendApiKey = process.env.RESEND_API_KEY;
export const resend = new Resend(resendApiKey);

// Expéditeur officiel vérifié dans Resend
export const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'MIDH <contact@midh-ci.org>';

// Destinataires par défaut de l'équipe MIDH
export function getRecipients(): string[] {
  const envRecipients = process.env.CONTACT_FORM_RECIPIENT;
  if (!envRecipients) {
    return ['contact@midh-ci.org', 'brahimacoulibaly7777@gmail.com'];
  }
  return envRecipients.split(',').map((e) => e.trim()).filter(Boolean);
}

/**
 * Envoi d'un e-mail de notification pour le formulaire de contact
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

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f8f6; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: #0B3827; padding: 24px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.85; }
        .body { padding: 28px; }
        .field { margin-bottom: 16px; }
        .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px; }
        .value { font-size: 15px; color: #0f172a; font-weight: 500; }
        .message-box { background: #f8fafc; border-left: 4px solid #0B3827; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #334155; margin-top: 8px; white-space: pre-wrap; }
        .footer { background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
        .reply-btn { display: inline-block; margin-top: 16px; background: #0B3827; color: #ffffff !important; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Nouveau message reçu</h1>
          <p>Formulaire de contact • midh-ci.org</p>
        </div>
        <div class="body">
          <div class="field">
            <div class="label">Expéditeur</div>
            <div class="value">${name} &lt;${email}&gt;</div>
          </div>
          ${phone ? `
          <div class="field">
            <div class="label">Téléphone / WhatsApp</div>
            <div class="value">${phone}</div>
          </div>` : ''}
          <div class="field">
            <div class="label">Objet</div>
            <div class="value">${subject}</div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="message-box">${message}</div>
          </div>
          <div style="text-align: center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="reply-btn">Répondre directement à ${name}</a>
          </div>
        </div>
        <div class="footer">
          Mouvement Ivoirien des Droits Humains (MIDH) • Système sécurisé Resend
        </div>
      </div>
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
 * Envoi d'un e-mail de notification pour une nouvelle candidature bénévole
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

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f8f6; margin: 0; padding: 24px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: #0B3827; padding: 24px; color: #ffffff; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.85; }
        .body { padding: 28px; }
        .badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; margin-bottom: 16px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .field { margin-bottom: 14px; }
        .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; letter-spacing: 0.5px; }
        .value { font-size: 14px; color: #0f172a; font-weight: 600; }
        .message-box { background: #f8fafc; border-left: 4px solid #16a34a; padding: 14px; border-radius: 4px; font-size: 13px; line-height: 1.6; color: #334155; margin-top: 6px; white-space: pre-wrap; }
        .footer { background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
        .reply-btn { display: inline-block; margin-top: 16px; background: #0B3827; color: #ffffff !important; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Nouvelle adhésion bénévole</h1>
          <p>Engagement citoyen • midh-ci.org</p>
        </div>
        <div class="body">
          <div class="badge">🤝 Candidature Bénévole</div>
          
          <div class="grid">
            <div class="field">
              <div class="label">Nom complet</div>
              <div class="value">${fullName}</div>
            </div>
            <div class="field">
              <div class="label">Téléphone / WhatsApp</div>
              <div class="value">${phone}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">Lieu d'habitation</div>
              <div class="value">${location}</div>
            </div>
          </div>

          ${domain ? `
          <div class="field">
            <div class="label">Domaine de compétence souhaité</div>
            <div class="value">${domain}</div>
          </div>` : ''}

          ${availability ? `
          <div class="field">
            <div class="label">Disponibilité</div>
            <div class="value">${availability}</div>
          </div>` : ''}

          ${message ? `
          <div class="field">
            <div class="label">Motivations / Expérience</div>
            <div class="message-box">${message}</div>
          </div>` : ''}

          <div style="text-align: center;">
            <a href="mailto:${email}?subject=Votre candidature bénévole au MIDH" class="reply-btn">Contacter ${prenom}</a>
          </div>
        </div>
        <div class="footer">
          Mouvement Ivoirien des Droits Humains (MIDH) • Système sécurisé Resend
        </div>
      </div>
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
