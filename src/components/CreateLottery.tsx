'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/lib/config';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateLotteryProps {
  onLotteryCreated?: () => void;
}

export function CreateLottery({ onLotteryCreated }: CreateLotteryProps) {
  const [ticketPrice, setTicketPrice] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const { t } = useLanguage();

  const { writeContract, isPending, data: hash } = useWriteContract();

  // Wait for transaction receipt and then refetch data
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Refetch data when transaction is confirmed
  React.useEffect(() => {
    if (isConfirmed && onLotteryCreated) {
      onLotteryCreated();
      // Reset form
      setTicketPrice('');
      setMaxPlayers('');
    }
  }, [isConfirmed]); // Removed onLotteryCreated from dependencies

  // Memoized validation
  const validation = useMemo(() => {
    const ticketPriceNum = parseFloat(ticketPrice);
    const maxPlayersNum = parseInt(maxPlayers);
    
    return {
      isValid: ticketPriceNum > 0 && maxPlayersNum > 0 && maxPlayersNum <= 1000,
      ticketPriceError: ticketPriceNum <= 0 ? t('lottery.validation.ticketPricePositive') : '',
      maxPlayersError: maxPlayersNum <= 0 ? t('lottery.validation.maxPlayersPositive') : 
                      maxPlayersNum > 1000 ? t('lottery.validation.maxPlayersLimit') : '',
    };
  }, [ticketPrice, maxPlayers]);

  const handleCreate = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation.isValid) return;

    try {
      writeContract({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: 'createLottery',
        args: [parseEther(ticketPrice), BigInt(maxPlayers)],
      });
    } catch (error) {
      console.error('Error creating lottery:', error);
    }
  }, [validation.isValid, ticketPrice, maxPlayers, writeContract]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">➕</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t('createLottery.title')}</h2>
          <p className="text-sm text-gray-500">{t('createLottery.description')}</p>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🎲</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800">Free & Secure Randomness</p>
            <p className="text-xs text-blue-600">{t('createLottery.randomnessInfo')}</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleCreate} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">💰</span>
                <span>{t('createLottery.form.ticketPriceLabel')}</span>
              </div>
            </label>
            <input
              type="text"
              placeholder={t('createLottery.form.ticketPricePlaceholder')}
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 p-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300"
            />
            <p className="text-xs text-gray-500 mt-2">Amount each participant needs to pay</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">👥</span>
                <span>{t('createLottery.form.maxPlayersLabel')}</span>
              </div>
            </label>
            <input
              type="number"
              placeholder={t('createLottery.form.maxPlayersPlaceholder')}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 p-4 text-lg focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300"
            />
            <p className="text-xs text-gray-500 mt-2">Maximum number of participants allowed</p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending || isConfirming || !ticketPrice || !maxPlayers} 
          className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 font-bold text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-center space-x-3">
            <span className="text-xl">🎲</span>
            <span className="text-lg">
              {isPending ? t('createLottery.form.submitting') : isConfirming ? t('createLottery.form.confirming') : t('createLottery.form.submit')}
            </span>
          </div>
        </button>
        
        {hash && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Transaction Submitted!</p>
                <p className="text-xs text-green-600 font-mono break-all">{t('createLottery.transactionHash')} {hash}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
