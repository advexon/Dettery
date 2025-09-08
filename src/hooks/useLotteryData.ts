import { useReadContract } from 'wagmi';
import { LOTTERY_ABI } from '@/lib/config';

interface UseLotteryDataOptions {
  address: `0x${string}`;
  enabled?: boolean;
}

export function useLotteryData({ address, enabled = true }: UseLotteryDataOptions) {
  const { data: ticketPrice, isLoading: isLoadingTicketPrice } = useReadContract({
    address,
    abi: LOTTERY_ABI,
    functionName: 'i_ticketPrice',
    query: {
      enabled,
      staleTime: 30000,
      refetchInterval: 10000,
    },
  });

  const { data: maxPlayers, isLoading: isLoadingMaxPlayers } = useReadContract({
    address,
    abi: LOTTERY_ABI,
    functionName: 'i_maxPlayers',
    query: {
      enabled,
      staleTime: 30000,
    },
  });

  const { data: players, isLoading: isLoadingPlayers } = useReadContract({
    address,
    abi: LOTTERY_ABI,
    functionName: 'getPlayers',
    query: {
      enabled,
      staleTime: 5000,
      refetchInterval: 5000,
    },
  });

  const { data: lotteryState, isLoading: isLoadingState } = useReadContract({
    address,
    abi: LOTTERY_ABI,
    functionName: 'getLotteryState',
    query: {
      enabled,
      staleTime: 10000,
      refetchInterval: 10000,
    },
  });

  const { data: winner, isLoading: isLoadingWinner } = useReadContract({
    address,
    abi: LOTTERY_ABI,
    functionName: 's_winner',
    query: {
      enabled,
      staleTime: 30000,
    },
  });

  const { data: canPickWinner, isLoading: isLoadingCanPickWinner } = useReadContract({
    address,
    abi: LOTTERY_ABI,
    functionName: 'canPickWinner',
    query: {
      enabled,
      staleTime: 10000,
      refetchInterval: 10000,
    },
  });

  const { data: revealBlock, isLoading: isLoadingRevealBlock } = useReadContract({
    address,
    abi: LOTTERY_ABI,
    functionName: 'getRevealBlock',
    query: {
      enabled,
      staleTime: 30000,
    },
  });

  const isLoading = isLoadingTicketPrice || isLoadingMaxPlayers || isLoadingPlayers || 
                   isLoadingState || isLoadingWinner || isLoadingCanPickWinner || isLoadingRevealBlock;

  return {
    ticketPrice,
    maxPlayers,
    players,
    lotteryState,
    winner,
    canPickWinner,
    revealBlock,
    isLoading,
  };
}
