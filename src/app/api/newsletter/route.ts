import { NextResponse } from 'next/server';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email("Veuillez renseigner une adresse email valide").max(120),
  consent: z.boolean().refine((val) => val === true, "Le consentement est obligatoire"),
  website_trap: z.string().max(0).optional().or(z.literal('')),
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
    console.info(`[Newsletter] Inscription confirmée pour: ${email}`);

    // Possibilité de brancher un webhook Mailchimp/Brevo/Sendinblue si configuré
    return NextResponse.json(
      {
        success: true,
        message: "Merci pour votre intérêt envers le MIDH. Votre inscription à la lettre d'information a bien été enregistrée.",
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
