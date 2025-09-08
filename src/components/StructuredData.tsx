// src/components/StructuredData.tsx
import React from 'react';

interface StructuredDataProps {
  type?: 'website' | 'lottery' | 'organization';
  lotteryData?: {
    name: string;
    description: string;
    ticketPrice: string;
    maxPlayers: number;
    currentPlayers: number;
    status: string;
  };
}

export function StructuredData({ type = 'website', lotteryData }: StructuredDataProps) {
  const getWebsiteStructuredData = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DETTERY',
    alternateName: 'Decentralized Lottery Platform',
    url: 'https://dettery.com',
    description: 'The world\'s first truly decentralized lottery platform. Experience provably fair gaming with transparent randomness, secure smart contracts, and automatic payouts on the Ethereum blockchain.',
    inLanguage: ['en-US', 'ru-RU'],
    isAccessibleForFree: true,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://dettery.com?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'DETTERY',
      url: 'https://dettery.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dettery.com/logo.png',
        width: 512,
        height: 512
      },
      sameAs: [
        'https://github.com/advexon/Dettery',
        'https://twitter.com/dettery',
        'https://discord.gg/dettery'
      ]
    }
  });

  const getOrganizationStructuredData = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DETTERY',
    alternateName: 'Decentralized Lottery Platform',
    url: 'https://dettery.com',
    logo: 'https://dettery.com/logo.png',
    description: 'The world\'s first truly decentralized lottery platform. Experience provably fair gaming with transparent randomness, secure smart contracts, and automatic payouts on the Ethereum blockchain.',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Advexon',
      url: 'https://github.com/advexon'
    },
    sameAs: [
      'https://github.com/advexon/Dettery',
      'https://twitter.com/dettery',
      'https://discord.gg/dettery'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://dettery.com/support'
    },
    areaServed: 'Worldwide',
    serviceType: 'Decentralized Lottery Platform',
    knowsAbout: [
      'Blockchain Technology',
      'Smart Contracts',
      'Decentralized Applications',
      'Cryptocurrency',
      'Ethereum',
      'Web3',
      'DeFi',
      'Provably Fair Gaming'
    ]
  });

  const getLotteryStructuredData = () => {
    if (!lotteryData) return null;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Game',
      name: lotteryData.name,
      description: lotteryData.description,
      gameLocation: {
        '@type': 'VirtualLocation',
        url: 'https://dettery.com'
      },
      gameItem: {
        '@type': 'Thing',
        name: 'Lottery Ticket',
        description: `Ticket price: ${lotteryData.ticketPrice} ETH`
      },
      numberOfPlayers: {
        '@type': 'QuantitativeValue',
        value: lotteryData.currentPlayers,
        maxValue: lotteryData.maxPlayers,
        unitText: 'players'
      },
      gameStatus: lotteryData.status,
      provider: {
        '@type': 'Organization',
        name: 'DETTERY',
        url: 'https://dettery.com'
      },
      offers: {
        '@type': 'Offer',
        price: lotteryData.ticketPrice,
        priceCurrency: 'ETH',
        availability: lotteryData.status === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'DETTERY'
        }
      }
    };
  };

  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return getOrganizationStructuredData();
      case 'lottery':
        return getLotteryStructuredData();
      default:
        return getWebsiteStructuredData();
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
