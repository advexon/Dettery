'use client';
import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { LOTTERY_ABI } from '@/lib/config';

interface LotteryCardProps {
  address: string;
  index: number;
  onDataChange?: () => void;
}

export function LotteryCard({ address, index, onDataChange }: LotteryCardProps) {
  const { address: userAddress } = useAccount();
  const [isEntering, setIsEntering] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: ticketPrice } = useReadContract({
    address: address as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'i_ticketPrice',
  });

  const { data: maxPlayers } = useReadContract({
    address: address as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'i_maxPlayers',
  });

  const { data: players } = useReadContract({
    address: address as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'getPlayers',
  });

  const { data: lotteryState } = useReadContract({
    address: address as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'getLotteryState',
  });

  const { data: winner } = useReadContract({
    address: address as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 's_winner',
  });

  const { data: canPickWinner } = useReadContract({
    address: address as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'canPickWinner',
  });

  const { data: revealBlock } = useReadContract({
    address: address as `0x${string}`,
    abi: LOTTERY_ABI,
    functionName: 'getRevealBlock',
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
  }, [isConfirmed]); // Removed onDataChange from dependencies

  const getStateText = (state: number) => {
    switch (state) {
      case 0: return 'Open';
      case 1: return 'Calculating Winner';
      case 2: return 'Closed';
      default: return 'Unknown';
    }
  };

  const getStateColor = (state: number) => {
    switch (state) {
      case 0: return 'text-green-600 bg-green-100';
      case 1: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleEnter = async () => {
    if (!ticketPrice || !userAddress) return;
    
    setIsEntering(true);
    try {
      await writeContract({
        address: address as `0x${string}`,
        abi: LOTTERY_ABI,
        functionName: 'enter',
        value: ticketPrice as bigint,
      });
    } catch (error) {
      console.error('Error entering lottery:', error);
    } finally {
      setIsEntering(false);
    }
  };

  const handlePickWinner = async () => {
    try {
      await writeContract({
        address: address as `0x${string}`,
        abi: LOTTERY_ABI,
        functionName: 'pickWinner',
      });
    } catch (error) {
      console.error('Error picking winner:', error);
    }
  };

  const isUserInLottery = players?.includes(userAddress as `0x${string}`);
  const isLotteryOpen = lotteryState === 0;
  const isLotteryFull = players && maxPlayers && players.length >= Number(maxPlayers);

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-md">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">#{index + 1}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Lottery Pool</h3>
            <p className="text-sm text-gray-500">Created on Sepolia Testnet</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStateColor(lotteryState as number)}`}>
          {getStateText(lotteryState as number)}
        </span>
      </div>
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">💰</span>
            </div>
            <p className="text-sm font-medium text-blue-700">Ticket Price</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {ticketPrice ? formatEther(ticketPrice as bigint) : '0'} ETH
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👥</span>
            </div>
            <p className="text-sm font-medium text-green-700">Participants</p>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {players ? players.length : 0} / {maxPlayers?.toString() || 0}
          </p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${players && maxPlayers ? (players.length / Number(maxPlayers)) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🏆</span>
            </div>
            <p className="text-sm font-medium text-purple-700">Total Pool</p>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {ticketPrice && players ? 
              formatEther((ticketPrice as bigint) * BigInt(players.length)) : 
              '0'
            } ETH
          </p>
          <p className="text-xs text-purple-600 mt-1">
            Winner: 80% • Admin: 20%
          </p>
        </div>
      </div>

      {/* Winner Display */}
      {winner && winner !== "0x0000000000000000000000000000000000000000" && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏆</span>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">Winner Selected!</p>
              <p className="text-xs text-yellow-600 font-mono break-all">{winner}</p>
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
              <h4 className="text-lg font-semibold text-gray-800">Participants</h4>
            </div>
            <div className="text-sm text-gray-600">
              {players ? new Set(players).size : 0} unique • {players ? players.length : 0} total entries
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
                    {/* Show if this is a duplicate entry */}
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
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🔒</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-800">Transparency & Safety</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
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
              <span className="text-gray-700">Decentralized on Sepolia</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span className="text-gray-700">No Central Authority</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span className="text-gray-700">Automatic Payouts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500">✅</span>
              <span className="text-gray-700">Public Blockchain</span>
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-white rounded border">
          <p className="text-xs text-gray-600">
            <strong>Contract Address:</strong> <span className="font-mono break-all">{address}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {isLotteryOpen && !isLotteryFull && userAddress && (
          <div>
            {isUserInLottery ? (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✅</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">You are participating!</p>
                    <p className="text-xs text-green-600">Good luck! 🍀</p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleEnter}
                disabled={isPending || isConfirming || isEntering}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-bold text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🎲</span>
                  <span>
                    {isPending || isEntering ? 'Entering...' : isConfirming ? 'Confirming...' : `Enter Lottery (${ticketPrice ? formatEther(ticketPrice as bigint) : '0'} ETH)`}
                  </span>
                </div>
              </button>
            )}
          </div>
        )}

        {!userAddress && (
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🔗</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Connect your wallet to participate</p>
                <p className="text-xs text-gray-500">Use MetaMask or any Web3 wallet</p>
              </div>
            </div>
          </div>
        )}

        {isLotteryFull && lotteryState === 1 && (
          <div>
            {canPickWinner ? (
              <button
                onClick={handlePickWinner}
                disabled={isPending || isConfirming}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 font-bold text-white hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🎲</span>
                  <span>
                    {isPending ? 'Picking Winner...' : isConfirming ? 'Confirming...' : 'Pick Winner'}
                  </span>
                </div>
              </button>
            ) : (
              <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">⏳</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-orange-800">Waiting for Fair Randomness</p>
                    <p className="text-xs text-orange-600">
                      Block {revealBlock?.toString()} required for secure winner selection
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
