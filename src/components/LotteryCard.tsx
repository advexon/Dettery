'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { LOTTERY_ABI } from '@/lib/config';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShareButton } from './ShareButton';

interface LotteryCardProps {
  address: string;
  index: number;
  onDataChange?: () => void;
  isHighlighted?: boolean;
}

interface LotteryData {
  ticketPrice: bigint | undefined;
  maxPlayers: bigint | undefined;
  players: readonly `0x${string}`[] | undefined;
  lotteryState: number | undefined;
  winner: `0x${string}` | undefined;
  canPickWinner: boolean | undefined;
  revealBlock: bigint | undefined;
}

export function LotteryCard({ address, index, onDataChange, isHighlighted = false }: LotteryCardProps) {
  const { address: userAddress } = useAccount();
  const [isEntering, setIsEntering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Batch all contract reads for better performance
  const lotteryAddress = address as `0x${string}`;
  
  const { data: ticketPrice } = useReadContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 'i_ticketPrice',
    query: {
      staleTime: 30000, // Cache for 30 seconds
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const { data: maxPlayers } = useReadContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 'i_maxPlayers',
    query: {
      staleTime: 30000,
    },
  });

  const { data: players } = useReadContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 'getPlayers',
    query: {
      staleTime: 5000, // More frequent updates for players
      refetchInterval: 5000,
    },
  });

  const { data: lotteryState } = useReadContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 'getLotteryState',
    query: {
      staleTime: 10000,
      refetchInterval: 10000,
    },
  });

  const { data: winner } = useReadContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 's_winner',
    query: {
      staleTime: 30000,
    },
  });

  const { data: canPickWinner } = useReadContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 'canPickWinner',
    query: {
      staleTime: 10000,
      refetchInterval: 10000,
    },
  });

  const { data: revealBlock } = useReadContract({
    address: lotteryAddress,
    abi: LOTTERY_ABI,
    functionName: 'getRevealBlock',
    query: {
      staleTime: 30000,
    },
  });

  const { writeContract, isPending, data: hash } = useWriteContract();

  // Wait for transaction receipt and then refetch data
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Refetch data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && onDataChange) {
      onDataChange();
    }
  }, [isConfirmed, onDataChange]);

  // Memoized computed values for better performance
  const computedValues = useMemo(() => {
    const isUserInLottery = players?.includes(userAddress as `0x${string}`);
    const isLotteryOpen = lotteryState === 0;
    const isLotteryFull = Boolean(players && maxPlayers && maxPlayers > BigInt(0) && players.length >= Number(maxPlayers.toString()));
    const canPickWinnerNow = canPickWinner === true;
    const uniquePlayers = players ? new Set(players).size : 0;
    const totalEntries = players ? players.length : 0;
    const userEntryCount = players ? players.filter(player => player === userAddress).length : 0;

    return {
      isUserInLottery,
      isLotteryOpen,
      isLotteryFull,
      canPickWinnerNow,
      uniquePlayers,
      totalEntries,
      userEntryCount,
    };
  }, [players, maxPlayers, lotteryState, canPickWinner, userAddress]);

  // Memoized state text function
  const getStateText = useCallback((state: number) => {
    switch (state) {
      case 0:
        return t('lottery.state.open');
      case 1:
        return t('lottery.state.calculating');
      case 2:
        return t('lottery.state.closed');
      default:
        return t('lottery.state.unknown');
    }
  }, [t]);

  // Memoized state color function
  const getStateColor = useCallback((state: number) => {
    switch (state) {
      case 0:
        return 'bg-green-100 text-green-800';
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const handleEnter = useCallback(async () => {
    if (!ticketPrice || !userAddress) return;

    try {
      setIsEntering(true);
      await writeContract({
        address: lotteryAddress,
        abi: LOTTERY_ABI,
        functionName: 'enter',
        value: ticketPrice,
      });
    } catch (error) {
      console.error('Error entering lottery:', error);
    } finally {
      setIsEntering(false);
    }
  }, [ticketPrice, userAddress, writeContract, lotteryAddress]);

  const handlePickWinner = useCallback(async () => {
    try {
      await writeContract({
        address: lotteryAddress,
        abi: LOTTERY_ABI,
        functionName: 'pickWinner',
      });
    } catch (error) {
      console.error('Error picking winner:', error);
    }
  }, [writeContract, lotteryAddress]);

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Show error state if critical data is missing
  if (!ticketPrice || !maxPlayers) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">⚠️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800">{t('errors.lotteryDataError')}</h3>
            <p className="text-red-600 text-sm">{t('errors.unableToLoadLottery')}</p>
          </div>
        </div>
        <p className="text-red-700 text-sm">Address: {address}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
      isHighlighted 
        ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-200' 
        : 'border-gray-200 bg-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">#{index + 1}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Lottery Pool #{index + 1}</h3>
            <p className="text-sm text-gray-500 font-mono">{address}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <ShareButton lotteryAddress={address} lotteryIndex={index} />
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStateColor(lotteryState || 0)}`}>
            {getStateText(lotteryState || 0)}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-blue-600 text-lg">💰</span>
            <span className="text-sm font-medium text-blue-800">{t('lottery.ticketPrice')}</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{formatEther(ticketPrice)} ETH</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-600 text-lg">👥</span>
            <span className="text-sm font-medium text-green-800">{t('lottery.participants')}</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {computedValues.totalEntries}/{Number(maxPlayers.toString())}
          </p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(computedValues.totalEntries / Number(maxPlayers.toString())) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-purple-600 text-lg">🏆</span>
            <span className="text-sm font-medium text-purple-800">{t('lottery.prizePool')}</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {formatEther(ticketPrice * BigInt(computedValues.totalEntries))} ETH
          </p>
        </div>
      </div>

      {/* Winner Display */}
      {winner && winner !== "0x0000000000000000000000000000000000000000" && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏆</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-yellow-800">{t('lottery.messages.winnerSelected')}</h4>
              <p className="text-yellow-700 font-mono text-sm break-all">{winner}</p>
              {winner === userAddress && (
                <span className="inline-block mt-1 px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-medium">
                  🎉 {t('lottery.messages.congratulations')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Participants Section */}
      {players && players.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👥</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{t('lottery.participants')}</h4>
            </div>
            <div className="text-sm text-gray-600">
              {computedValues.uniquePlayers} unique • {computedValues.totalEntries} total entries
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {players.map((player, playerIndex) => (
                <div key={`${player}-${playerIndex}`} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">{playerIndex + 1}</span>
                    </div>
                    <span className="text-sm font-mono text-gray-700 break-all">
                      {player === userAddress ? (
                        <span className="text-blue-600 font-semibold">You ({player})</span>
                      ) : (
                        player
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {players.filter(p => p === player).length > 1 && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        {players.filter(p => p === player).length}x
                      </span>
                    )}
                    {player === userAddress && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transparency & Safety Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Transparency & Safety</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-gray-700">Smart Contract Verified</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-gray-700">Block Hash Randomness</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-gray-700">No Central Authority</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-gray-700">Automatic Payouts</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!userAddress && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔗</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{t('wallet.connectPrompt')}</p>
                <p className="text-xs text-gray-500">{t('wallet.connectDescription')}</p>
              </div>
            </div>
          </div>
        )}

        {computedValues.isLotteryOpen && !computedValues.isLotteryFull && userAddress && (
          <button
            onClick={handleEnter}
            disabled={isPending || isConfirming || isEntering || computedValues.isUserInLottery}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-bold text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">🎫</span>
              <span>
                {isPending ? t('lottery.actions.entering') : isConfirming ? t('lottery.actions.confirming') : isEntering ? t('lottery.actions.processing') : 
                 computedValues.isUserInLottery ? `${t('lottery.actions.youreIn')} (${computedValues.userEntryCount} ${t('lottery.actions.entries')})` : t('lottery.enter')}
              </span>
            </div>
          </button>
        )}

        {computedValues.isLotteryFull && lotteryState === 1 && (
          <div>
            {computedValues.canPickWinnerNow ? (
              <button
                onClick={handlePickWinner}
                disabled={isPending || isConfirming}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 font-bold text-white hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🎲</span>
                  <span>
                    {isPending ? t('lottery.actions.pickingWinner') : isConfirming ? t('lottery.actions.confirming') : t('lottery.pickWinner')}
                  </span>
                </div>
              </button>
            ) : (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">{t('lottery.messages.waitingForRandomness')}</p>
                    <p className="text-xs text-yellow-600">
                      {t('lottery.messages.waitingForRandomnessDescription')} {revealBlock?.toString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {lotteryState === 2 && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔒</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">{t('lottery.messages.lotteryClosed')}</p>
                <p className="text-xs text-gray-500">{t('lottery.messages.lotteryClosedDescription')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Hash Display */}
      {hash && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Transaction Hash:</p>
          <p className="text-xs font-mono text-gray-800 break-all">{hash}</p>
        </div>
      )}
    </div>
  );
}
