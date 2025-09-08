import { formatEther } from 'viem';

export interface LotteryComputedValues {
  isUserInLottery: boolean;
  isLotteryOpen: boolean;
  isLotteryFull: boolean;
  canPickWinnerNow: boolean;
  uniquePlayers: number;
  totalEntries: number;
  userEntryCount: number;
  prizePool: string;
  progressPercentage: number;
}

export function computeLotteryValues(
  players: readonly `0x${string}`[] | undefined,
  maxPlayers: bigint | undefined,
  lotteryState: number | undefined,
  canPickWinner: boolean | undefined,
  ticketPrice: bigint | undefined,
  userAddress: `0x${string}` | undefined
): LotteryComputedValues {
  const isUserInLottery = players?.includes(userAddress as `0x${string}`) || false;
  const isLotteryOpen = lotteryState === 0;
  const isLotteryFull = Boolean(
    players && 
    maxPlayers && 
    maxPlayers > BigInt(0) && 
    players.length >= Number(maxPlayers.toString())
  );
  const canPickWinnerNow = canPickWinner === true;
  const uniquePlayers = players ? new Set(players).size : 0;
  const totalEntries = players ? players.length : 0;
  const userEntryCount = players ? players.filter(player => player === userAddress).length : 0;
  
  const prizePool = ticketPrice && totalEntries > 0 
    ? formatEther(ticketPrice * BigInt(totalEntries))
    : '0';
    
  const progressPercentage = maxPlayers && totalEntries > 0
    ? (totalEntries / Number(maxPlayers.toString())) * 100
    : 0;

  return {
    isUserInLottery,
    isLotteryOpen,
    isLotteryFull,
    canPickWinnerNow,
    uniquePlayers,
    totalEntries,
    userEntryCount,
    prizePool,
    progressPercentage,
  };
}

export function getStateText(state: number): string {
  switch (state) {
    case 0:
      return 'Open';
    case 1:
      return 'Calculating Winner';
    case 2:
      return 'Closed';
    default:
      return 'Unknown';
  }
}

export function getStateColor(state: number): string {
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
}

export function formatAddress(address: string, length: number = 6): string {
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function isWinner(winner: `0x${string}` | undefined, userAddress: `0x${string}` | undefined): boolean {
  return Boolean(winner && userAddress && winner === userAddress);
}

export function hasValidWinner(winner: `0x${string}` | undefined): boolean {
  return Boolean(winner && winner !== "0x0000000000000000000000000000000000000000");
}
