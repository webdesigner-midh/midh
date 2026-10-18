import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schéma explicite pour la validation des paramètres de requête (Query String)
const RevalidateQuerySchema = z.object({
  secret: z.string().min(1, 'Jeton secret requis').max(128),
  tag: z.string().max(100).optional().default('wordpress'),
  path: z.string().max(255).optional().default('/'),
});

// Schéma explicite pour la validation du corps de requête (Body JSON)
const RevalidateBodySchema = z.object({
  tag: z.string().max(100).optional(),
  path: z.string().max(255).optional(),
  post_id: z.union([z.number(), z.string()]).optional(),
  slug: z.string().max(255).optional(),
}).optional();

export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}

async function handleRevalidation(request: NextRequest) {
  try {
    // 1. Validation explicite des paramètres de requête (Query String) à la frontière de l'API
    const queryParams = {
      secret: request.nextUrl.searchParams.get('secret') || '',
      tag: request.nextUrl.searchParams.get('tag') || undefined,
      path: request.nextUrl.searchParams.get('path') || undefined,
    };

    const queryValidation = RevalidateQuerySchema.safeParse(queryParams);
    if (!queryValidation.success) {
      return NextResponse.json(
        { message: 'Paramètres invalides', errors: queryValidation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { secret, tag: queryTag, path: queryPath } = queryValidation.data;
    const configuredSecret = process.env.REVALIDATE_SECRET_TOKEN;

    if (configuredSecret && secret !== configuredSecret) {
      return NextResponse.json({ message: 'Jeton secret invalide' }, { status: 401 });
    }

    let tag = queryTag;
    let path = queryPath;

    // 2. Validation explicite du corps (Body JSON) pour les requêtes POST
    if (request.method === 'POST') {
      const rawBody = await request.json().catch(() => ({}));
      const bodyValidation = RevalidateBodySchema.safeParse(rawBody);

      if (!bodyValidation.success) {
        return NextResponse.json(
          { message: 'Corps de requête invalide', errors: bodyValidation.error.flatten().fieldErrors },
          { status: 400 }
        );
      }

      if (bodyValidation.data?.tag) {
        tag = bodyValidation.data.tag;
      }
      if (bodyValidation.data?.path) {
        path = bodyValidation.data.path;
      }
    }

    // 3. Exécution de la revalidation Next.js
    revalidateTag(tag);
    revalidatePath(path);
    revalidatePath('/galerie');
    revalidatePath('/', 'layout');

    console.info(`[Revalidation Webhook] Tag "${tag}" et chemin "${path}" revalidés avec succès.`);

    return NextResponse.json({
      revalidated: true,
      tag,
      path,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Erreur lors de la revalidation', error: (err as Error).message },
      { status: 500 }
    );
  }
}
