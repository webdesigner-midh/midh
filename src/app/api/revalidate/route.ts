import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { timingSafeEqualString } from '@/lib/server-crypto';

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
    const configuredSecret = process.env.REVALIDATE_SECRET_TOKEN?.trim();

    if (!configuredSecret) {
      return NextResponse.json(
        { message: 'Revalidation désactivée : REVALIDATE_SECRET_TOKEN non configuré sur le serveur' },
        { status: 503 }
      );
    }

    if (!timingSafeEqualString(secret, configuredSecret)) {
      return NextResponse.json({ message: 'Jeton secret invalide' }, { status: 401 });
    }

    let tag = queryTag;
    let path = queryPath;

    let slug: string | undefined;

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
      if (bodyValidation.data?.slug) {
        slug = bodyValidation.data.slug;
      }
    }

    // 3. Exécution de la revalidation Next.js pour toutes les vues pertinentes
    revalidateTag(tag);
    revalidatePath('/', 'page');
    revalidatePath('/', 'layout');
    revalidatePath('/actualites', 'page');
    revalidatePath('/actualites/[slug]', 'page');
    if (slug) {
      revalidatePath(`/actualites/${slug}`, 'page');
      revalidatePath(`/nos-actions/${slug}`, 'page');
      revalidatePath(`/partenaires/${slug}`, 'page');
    }
    revalidatePath('/nos-actions', 'page');
    revalidatePath('/documents-rapports', 'page');
    revalidatePath('/galerie', 'page');
    revalidatePath('/a-propos', 'page');
    if (path && path !== '/') {
      revalidatePath(path, 'page');
    }

    console.info(`[Revalidation Webhook] Tag "${tag}", chemin "${path}", slug "${slug || 'aucun'}" revalidés avec succès.`);

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
