import { NextRequest, NextResponse } from 'next/server';
import { recordArticleView, getArticleViews } from '@/services/wordpress';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Identifiant d\'article manquant.' },
        { status: 400 }
      );
    }

    const cleanId = parseInt(articleId, 10);
    if (!cleanId || isNaN(cleanId) || cleanId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Identifiant d\'article invalide.' },
        { status: 400 }
      );
    }

    const result = await getArticleViews(cleanId);

    return NextResponse.json(
      {
        success: result.success,
        views: result.views,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Erreur API articles/view GET :', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articleId = body?.articleId;

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Identifiant d\'article manquant.' },
        { status: 400 }
      );
    }

    const cleanId = typeof articleId === 'string' ? parseInt(articleId, 10) : Number(articleId);
    if (!cleanId || isNaN(cleanId) || cleanId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Identifiant d\'article invalide.' },
        { status: 400 }
      );
    }

    const result = await recordArticleView(cleanId);

    return NextResponse.json(
      {
        success: result.success,
        views: result.views,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Erreur API articles/view :', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
