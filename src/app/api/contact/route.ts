import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schéma de validation strict
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères").max(100),
  email: z.string().email("Adresse email invalide").max(120),
  phone: z.string().max(25).optional().or(z.literal('')),
  subject: z.string().min(3, "L'objet est requis").max(150),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(3000),
  // Piège anti-spam (Honeypot) : doit rester absolument vide
  website_trap: z.string().max(0, "Tentative de spam détectée").optional().or(z.literal('')),
});

// Limiteur de fréquence en mémoire simple (Rate Limiter)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5; // Max 5 messages par minute par IP

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
        { success: false, message: "Trop de requêtes. Veuillez patienter avant de renvoyer un message." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validatedData.error.flatten().fieldErrors,
          message: "Veuillez vérifier les informations saisies.",
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validatedData.data;

    // Journalisation sécurisée sans secrets
    console.info(`[Contact Form] Nouveau message reçu de ${name} (${email}) - Objet: ${subject}`);

    // Envoi de l'e-mail via Resend
    try {
      const { sendContactNotification } = await import('@/services/resend');
      const emailResult = await sendContactNotification({
        name,
        email,
        phone,
        subject,
        message,
      });

      if (emailResult.error) {
        console.error("[Contact API] Erreur Resend:", emailResult.error);
      } else {
        console.info("[Contact API] E-mail envoyé avec succès via Resend. ID:", emailResult.data?.id);
      }
    } catch (mailErr) {
      console.error("[Contact API] Erreur lors de l'envoi Resend:", mailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Votre message a été transmis avec succès à la coordination du MIDH. Nous vous répondrons dans les meilleurs délais.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API] Erreur interne:", error);
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue lors de l'envoi de votre message." },
      { status: 500 }
    );
  }
}
