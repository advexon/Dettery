'use client';
import { useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/lib/config';
import { LotteryCard } from './LotteryCard';

export function LotteryList() {
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
        <h3 className="text-2xl font-bold text-gray-700 mb-3">No Active Lotteries</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Be the first to create a lottery pool and start the fun! Create a fair and transparent lottery that anyone can join.
        </p>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
          <span className="text-blue-500">💡</span>
          <span className="text-sm text-blue-700">Use the form above to create your first lottery</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lotteryAddresses.map((address, index) => (
        <LotteryCard key={address} address={address} index={index} onDataChange={handleDataChange} />
      ))}
    </div>
  );
}
