import { useCallback, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { LOTTERY_ABI } from '@/lib/config';

interface UseLotteryActionsOptions {
  address: `0x${string}`;
  onSuccess?: () => void;
}

export function useLotteryActions({ address, onSuccess }: UseLotteryActionsOptions) {
  const { writeContract, isPending, data: hash, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const enterLottery = useCallback(async (ticketPrice: bigint) => {
    try {
      await writeContract({
        address,
        abi: LOTTERY_ABI,
        functionName: 'enter',
        value: ticketPrice,
      });
    } catch (error) {
      console.error('Error entering lottery:', error);
      throw error;
    }
  }, [writeContract, address]);

  const pickWinner = useCallback(async () => {
    try {
      await writeContract({
        address,
        abi: LOTTERY_ABI,
        functionName: 'pickWinner',
      });
    } catch (error) {
      console.error('Error picking winner:', error);
      throw error;
    }
  }, [writeContract, address]);

  // Call onSuccess when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && onSuccess) {
      onSuccess();
    }
  }, [isConfirmed, onSuccess]);

  return {
    enterLottery,
    pickWinner,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
    isLoading: isPending || isConfirming,
  };
}
