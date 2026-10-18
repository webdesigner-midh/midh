import { NextResponse } from 'next/server';
import { z } from 'zod';
import { subscribeNewsletterInWordPress } from '@/services/wordpress';
import { sendNewsletterNotificationToTeam, sendNewsletterWelcomeEmail } from '@/services/resend';

const newsletterSchema = z.object({
  email: z.string().email("Veuillez renseigner une adresse email valide").max(120),
  consent: z.boolean().refine((val) => val === true, "Le consentement est obligatoire"),
  website_trap: z.string().max(0, "Tentative de spam détectée").optional().or(z.literal('')),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = newsletterSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validatedData.error.flatten().fieldErrors,
          message: "Veuillez renseigner une adresse e-mail valide et accepter les conditions.",
        },
        { status: 400 }
      );
    }

    const { email } = validatedData.data;
    console.info(`[Newsletter] Inscription demandée pour: ${email}`);

    // 1. Enregistrement dans WordPress (CPT Abonnés Newsletter & export Excel/CSV)
    try {
      await subscribeNewsletterInWordPress(email);
    } catch (wpErr) {
      console.warn("[Newsletter API] Erreur d'enregistrement WordPress:", (wpErr as Error).message);
    }

    // 2. Alerte immédiate transmise à l'équipe MIDH par e-mail
    try {
      await sendNewsletterNotificationToTeam({ subscriberEmail: email });
    } catch (alertErr) {
      console.error("[Newsletter API] Erreur notification équipe:", alertErr);
    }

    // 3. E-mail officiel de confirmation et bienvenue envoyé à l'abonné
    try {
      await sendNewsletterWelcomeEmail({ subscriberEmail: email });
    } catch (welcomeErr) {
      console.error("[Newsletter API] Erreur e-mail de bienvenue:", welcomeErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Merci pour votre intérêt envers le MIDH ! Votre inscription à notre lettre d'information a bien été confirmée. Un e-mail de bienvenue vient de vous être envoyé.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Newsletter API] Erreur:", error);
    return NextResponse.json(
      { success: false, message: "Impossible d'enregistrer votre inscription pour le moment." },
      { status: 500 }
    );
  }
}

