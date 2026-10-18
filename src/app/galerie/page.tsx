import type { Metadata } from 'next';
import GalleryClient from '@/components/gallery/GalleryClient';
import { getGalleryData } from '@/services/wordpress';

export const revalidate = 60; // Revalidation ISR toutes les 60s

export const metadata: Metadata = {
  title: 'Médiathèque & Galerie Photo-Vidéo | MIDH Côte d’Ivoire',
  description:
    'Explorez les archives photographiques et reportages vidéo du Mouvement Ivoirien des Droits Humains (MIDH) : missions de terrain, ateliers de formation, plaidoyers et événements officiels.',
  openGraph: {
    title: 'Médiathèque & Galerie Photo-Vidéo | MIDH Côte d’Ivoire',
    description:
      'Explorez les archives photographiques et reportages vidéo du Mouvement Ivoirien des Droits Humains (MIDH) : missions de terrain, ateliers de formation, plaidoyers et événements officiels.',
    url: 'https://midh-ci.org/galerie',
  },
};

export default async function GaleriePage() {
  const { photos, videos } = await getGalleryData();

  return <GalleryClient initialPhotos={photos} initialVideos={videos} />;
}
