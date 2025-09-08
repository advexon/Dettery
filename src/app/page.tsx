'use client';
import { useState, useCallback, Suspense } from 'react';
import { ConnectWallet } from '@/components/ConnectWallet';
import { CreateLottery } from '@/components/CreateLottery';
import { LotteryList } from '@/components/LotteryList';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { StructuredData } from '@/components/StructuredData';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useLanguage();

  const handleLotteryCreated = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);
  return (
    <>
      <StructuredData type="website" />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="mx-auto max-w-6xl p-8">
        <header className="mb-12 text-center">
          {/* Language Switcher */}
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>
          
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl">🎲</span>
            </div>
            <div>
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('header.title')}
              </h1>
              <p className="text-lg text-gray-500 font-medium">{t('header.subtitle')}</p>
            </div>
          </div>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('header.description')}
              </p>
              
              {/* SEO-optimized content */}
              <div className="hidden">
                <h2>Decentralized Lottery Platform</h2>
                <p>DETTERY is the world's first truly decentralized lottery platform built on Ethereum blockchain. Experience provably fair gaming with transparent randomness, secure smart contracts, and automatic payouts. Join thousands of players in fair, transparent, and secure lottery games.</p>
                <h3>Key Features</h3>
                <ul>
                  <li>Provably Fair Gaming - Transparent randomness using blockchain technology</li>
                  <li>Smart Contract Security - Automated and tamper-proof lottery execution</li>
                  <li>Decentralized Platform - No central authority, fully transparent</li>
                  <li>Automatic Payouts - Instant winner selection and prize distribution</li>
                  <li>Multi-language Support - Available in English and Russian</li>
                  <li>Social Sharing - Share lottery pools with friends and family</li>
                </ul>
              </div>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
          
          {/* Network Info */}
          <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">{t('header.networkStatus')}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <section>
            <CreateLottery onLotteryCreated={handleLotteryCreated} />
          </section>
          
          <section className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">ℹ️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{t('howItWorks.title')}</h2>
                <p className="text-sm text-gray-500">{t('howItWorks.subtitle')}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-semibold text-gray-800">{t('howItWorks.steps.step1.title')}</p>
                  <p className="text-gray-600 text-sm">{t('howItWorks.steps.step1.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-semibold text-gray-800">{t('howItWorks.steps.step2.title')}</p>
                  <p className="text-gray-600 text-sm">{t('howItWorks.steps.step2.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-semibold text-gray-800">{t('howItWorks.steps.step3.title')}</p>
                  <p className="text-gray-600 text-sm">{t('howItWorks.steps.step3.description')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-semibold text-gray-800">{t('howItWorks.steps.step4.title')}</p>
                  <p className="text-gray-600 text-sm">{t('howItWorks.steps.step4.description')}</p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{t('howItWorks.securityFeatures.title')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">{t('howItWorks.securityFeatures.features.smartContractVerified')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">{t('howItWorks.securityFeatures.features.noCentralAuthority')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">{t('howItWorks.securityFeatures.features.transparentRandomness')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">{t('howItWorks.securityFeatures.features.automaticExecution')}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-800">Active Lotteries</h2>
          <p className="mb-6 text-gray-600 text-sm">{t('lottery.messages.latestFirst')}</p>
          <ErrorBoundary>
            <Suspense fallback={
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600">{t('common.loading')}</span>
              </div>
            }>
              <LotteryList key={refreshKey} />
            </Suspense>
          </ErrorBoundary>
        </section>
        </div>
      </main>
    </>
  );
}
