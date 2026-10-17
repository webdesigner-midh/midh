import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return handleRevalidation(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidation(request);
}

async function handleRevalidation(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');
    const configuredSecret = process.env.REVALIDATE_SECRET_TOKEN;

    if (configuredSecret && secret !== configuredSecret) {
      return NextResponse.json({ message: 'Jeton secret invalide' }, { status: 401 });
    }

    let tag = request.nextUrl.searchParams.get('tag') || 'wordpress';
    let path = request.nextUrl.searchParams.get('path') || '/';

    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      tag = body.tag || tag;
      path = body.path || path;
    }

    revalidateTag(tag);
    revalidatePath(path);
    revalidatePath('/', 'layout');

    console.info(`[Revalidation Webhook] Tag "${tag}" et chemin "${path}" revalidés.`);

    return NextResponse.json({
      revalidated: true,
      tag,
      path,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json({ message: "Erreur lors de la revalidation", error: (err as Error).message }, { status: 500 });
  }
}

