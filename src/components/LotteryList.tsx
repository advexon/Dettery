'use client';
import { useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/lib/config';
import { LotteryCard } from './LotteryCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLotteryFromUrl } from '@/hooks/useLotteryFromUrl';

export function LotteryList() {
  const { t } = useLanguage();
  const targetLottery = useLotteryFromUrl();
  const { data: lotteryAddresses, refetch } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getDeployedLotteries',
  });

  const handleDataChange = useCallback(() => {
    refetch();
  }, [refetch]);

  if (!lotteryAddresses || lotteryAddresses.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">🎲</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">{t('lottery.messages.noActiveLotteries')}</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {t('lottery.messages.noActiveLotteriesDescription')}
        </p>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
          <span className="text-blue-500">💡</span>
          <span className="text-sm text-blue-700">{t('lottery.messages.createFirstLottery')}</span>
        </div>
      </div>
    );
  }

  // Reverse the array to show latest lotteries first, but prioritize shared lottery
  const reversedLotteries = lotteryAddresses ? [...lotteryAddresses].reverse() : [];
  
  // If there's a target lottery from URL, move it to the top
  const sortedLotteries = targetLottery && reversedLotteries.includes(targetLottery)
    ? [targetLottery, ...reversedLotteries.filter(addr => addr !== targetLottery)]
    : reversedLotteries;

  return (
    <div className="space-y-4">
      {targetLottery && reversedLotteries.includes(targetLottery) && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🔗</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">{t('lottery.share.sharedLottery')}</p>
              <p className="text-xs text-blue-600">{t('lottery.share.sharedLotteryDescription')}</p>
            </div>
          </div>
        </div>
      )}
      
      {sortedLotteries.map((address, index) => (
        <LotteryCard 
          key={address} 
          address={address} 
          index={reversedLotteries.indexOf(address)} 
          onDataChange={handleDataChange}
          isHighlighted={address === targetLottery}
        />
      ))}
    </div>
  );
}
