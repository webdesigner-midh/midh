import type { Metadata, Viewport } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleTranslate from '@/components/common/GoogleTranslate';
import './globals.css';

export const metadata: Metadata = {
  title: 'MIDH | Mouvement Ivoirien des Droits Humains — Justice, Dignité et Libertés',
  description:
    'Organisation non gouvernementale de droit ivoirien fondée le 8 octobre 2000. Promotion, protection et défense des droits humains et accompagnement juridique des victimes en Côte d’Ivoire.',
  metadataBase: new URL('https://midh-ci.org'),
  keywords: [
    'MIDH',
    'Droits humains Côte d’Ivoire',
    'ONG ivoirienne',
    'Défenseurs des droits de l’homme Abidjan',
    'Clinique juridique Abidjan',
    'Assistance judiciaire victimes',
    'Droits civils et politiques',
  ],
  authors: [{ name: 'Mouvement Ivoirien des Droits Humains' }],
  openGraph: {
    title: 'MIDH — Mouvement Ivoirien des Droits Humains',
    description:
      'Les droits humains, une responsabilité collective. Promotion, protection et défense des droits reconnus en Côte d’Ivoire depuis le 8 octobre 2000.',
    url: 'https://midh-ci.org',
    siteName: 'MIDH',
    locale: 'fr_FR',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0B3827',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-background font-body-md text-on-surface antialiased flex flex-col min-h-screen">
        <Header />
        <GoogleTranslate />
        <main className="w-full pt-[72px] sm:pt-[104px] bg-background flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
