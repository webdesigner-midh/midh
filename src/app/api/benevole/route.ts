import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schéma de validation strict pour l'adhésion bénévole
const volunteerSchema = z.object({
  nom: z.string().trim().min(2, "Le nom doit comporter au moins 2 caractères").max(80),
  prenom: z.string().trim().min(2, "Le prénom doit comporter au moins 2 caractères").max(80),
  email: z.string().trim().email("Adresse email invalide").max(120),
  location: z.string().trim().min(2, "Veuillez préciser votre lieu d'habitation (ville, commune ou quartier)").max(150),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide").max(30),
  domain: z.string().max(100).optional().or(z.literal('')),
  availability: z.string().max(100).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  // Piège anti-spam (Honeypot) : doit rester absolument vide
  website_trap: z.string().max(0, "Tentative de spam détectée").optional().or(z.literal('')),
});

// Limiteur de fréquence en mémoire (Rate Limiter)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5; // Max 5 soumissions par minute par IP

  const record = rateLimitMap.get(ip);
  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: "Trop de requêtes. Veuillez patienter avant de renvoyer votre candidature." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = volunteerSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validatedData.error.flatten().fieldErrors,
          message: "Veuillez vérifier les informations renseignées dans le formulaire.",
        },
        { status: 400 }
      );
    }

    const { nom, prenom, email, location, phone, domain, availability, message, website_trap } = validatedData.data;

    // Détection bot / spam
    if (website_trap && website_trap.length > 0) {
      return NextResponse.json({ success: true, message: "Candidature reçue avec succès." });
    }

    console.info(`[Bénévolat MIDH] Nouvelle adhésion reçue : ${prenom} ${nom} (${email}) - Tél : ${phone} - Lieu : ${location} - Domaine : ${domain || 'Non spécifié'}`);

    // Envoi de l'e-mail via Resend
    try {
      const { sendVolunteerNotification } = await import('@/services/resend');
      const emailResult = await sendVolunteerNotification({
        nom,
        prenom,
        email,
        phone,
        location,
        domain,
        availability,
        message,
      });

      if (emailResult.error) {
        console.error("[Bénévolat API] Erreur Resend:", emailResult.error);
      } else {
        console.info("[Bénévolat API] E-mail envoyé avec succès via Resend. ID:", emailResult.data?.id);
      }
    } catch (mailErr) {
      console.error("[Bénévolat API] Erreur lors de l'envoi Resend:", mailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Votre demande d'adhésion en tant que bénévole a été transmise avec succès au MIDH. Notre équipe prendra contact avec vous très prochainement.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Bénévolat MIDH Error]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur interne est survenue. Veuillez réessayer ultérieurement ou nous contacter directement sur WhatsApp au +225 01 01 49 87 39.",
      },
      { status: 500 }
    );
  }
}
