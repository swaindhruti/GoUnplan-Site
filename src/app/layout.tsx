import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Playfair_Display,
  Roboto_Condensed,
  Roboto, // Add this line
  Poppins,
  Montserrat,
  Bricolage_Grotesque,
  Instrument_Sans,
} from 'next/font/google';
import SessionProvider from '@/components/providers/sessionProviders';
import './globals.css';
import { PostHogProvider } from './providers';
import Header from '@/components/landing/Header';
import { Toaster } from 'sonner';
import { siteConfig, jsonLdWebsite, jsonLdOrganization, jsonLdTravelAgency } from '@/config/seo';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
});
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto-condensed',
});
const roboto = Roboto({
  // Add this block
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bricolage',
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  category: siteConfig.category,

  // OpenGraph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Travel Booking Platform`,
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter,
    site: siteConfig.social.twitter,
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification tags (add when you have these)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  //   bing: 'your-bing-verification-code',
  // },

  // Manifest for PWA
  manifest: '/manifest.json',

  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // Alternate languages (add when you support multiple languages)
  // alternates: {
  //   canonical: siteConfig.url,
  //   languages: {
  //     'en-US': `${siteConfig.url}/en-US`,
  //   },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTravelAgency) }}
        />
      </head>
      <body
        className={`
          ${geistSans.variable} 
          ${playfair.variable} 
          ${geistMono.variable} 
          ${robotoCondensed.variable}
          ${roboto.variable}
          ${poppins.variable}
          ${montserrat.variable}
          ${bricolage.variable}
          ${instrument.variable}
          antialiased
        `}
      >
        <PostHogProvider>
          <SessionProvider>
            <Header /> <Toaster richColors closeButton expand={true} position="bottom-right" />
            {children}
          </SessionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
