import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');
    const configuredSecret = process.env.REVALIDATE_SECRET_TOKEN;

    if (configuredSecret && secret !== configuredSecret) {
      return NextResponse.json({ message: 'Jeton secret invalide' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const tag = body.tag || 'wordpress';
    const path = body.path || '/';

    revalidateTag(tag);
    revalidatePath(path);

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
