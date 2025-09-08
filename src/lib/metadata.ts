// src/lib/metadata.ts
import type { Metadata } from 'next';

const baseUrl = 'https://dettery.com';
const siteName = 'DETTERY';
const description = 'DETTERY - The world\'s first truly decentralized lottery platform. Experience provably fair gaming with transparent randomness, secure smart contracts, and automatic payouts on the Ethereum blockchain.';
const keywords = [
  'decentralized lottery',
  'blockchain lottery',
  'ethereum lottery',
  'provably fair',
  'smart contract lottery',
  'crypto lottery',
  'web3 lottery',
  'defi lottery',
  'transparent randomness',
  'chainlink vrf',
  'lottery dapp',
  'decentralized gaming',
  'crypto gaming',
  'ethereum dapp',
  'lottery platform',
  'fair gaming',
  'blockchain gaming',
  'smart contract gaming',
  'decentralized finance',
  'lottery smart contract'
];

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} - Decentralized Lottery Platform`,
    template: `%s | ${siteName}`
  },
  description,
  keywords: keywords.join(', '),
  authors: [{ name: 'Advexon', url: 'https://github.com/advexon' }],
  creator: 'Advexon',
  publisher: 'DETTERY',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName,
    title: `${siteName} - Decentralized Lottery Platform`,
    description,
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Decentralized Lottery Platform`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dettery',
    creator: '@advexon',
    title: `${siteName} - Decentralized Lottery Platform`,
    description,
    images: [`${baseUrl}/og-image.png`],
  },
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
  verification: {
    google: 'your-google-verification-code', // Replace with actual Google Search Console verification code
    yandex: 'your-yandex-verification-code', // Replace with actual Yandex verification code
    yahoo: 'your-yahoo-verification-code', // Replace with actual Yahoo verification code
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
      'ru-RU': `${baseUrl}/ru`,
    },
  },
  category: 'technology',
  classification: 'Decentralized Lottery Platform',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteName,
    'application-name': siteName,
    'msapplication-TileColor': '#3B82F6',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#3B82F6',
  },
};

export const lotteryMetadata: Metadata = {
  title: 'Create Lottery Pool',
  description: 'Create a new decentralized lottery pool with custom ticket prices and player limits. Fair, transparent, and secure lottery creation on the blockchain.',
  openGraph: {
    title: 'Create Lottery Pool | DETTERY',
    description: 'Create a new decentralized lottery pool with custom ticket prices and player limits. Fair, transparent, and secure lottery creation on the blockchain.',
    images: [
      {
        url: `${baseUrl}/og-lottery-create.png`,
        width: 1200,
        height: 630,
        alt: 'Create Lottery Pool on DETTERY',
      },
    ],
  },
  twitter: {
    title: 'Create Lottery Pool | DETTERY',
    description: 'Create a new decentralized lottery pool with custom ticket prices and player limits. Fair, transparent, and secure lottery creation on the blockchain.',
    images: [`${baseUrl}/og-lottery-create.png`],
  },
};

export const aboutMetadata: Metadata = {
  title: 'About DETTERY',
  description: 'Learn about DETTERY, the world\'s first truly decentralized lottery platform. Discover how we ensure fairness, transparency, and security through blockchain technology.',
  openGraph: {
    title: 'About DETTERY | Decentralized Lottery Platform',
    description: 'Learn about DETTERY, the world\'s first truly decentralized lottery platform. Discover how we ensure fairness, transparency, and security through blockchain technology.',
    images: [
      {
        url: `${baseUrl}/og-about.png`,
        width: 1200,
        height: 630,
        alt: 'About DETTERY - Decentralized Lottery Platform',
      },
    ],
  },
  twitter: {
    title: 'About DETTERY | Decentralized Lottery Platform',
    description: 'Learn about DETTERY, the world\'s first truly decentralized lottery platform. Discover how we ensure fairness, transparency, and security through blockchain technology.',
    images: [`${baseUrl}/og-about.png`],
  },
};
