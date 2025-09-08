export interface LotteryData {
  address: string;
  ticketPrice: bigint;
  maxPlayers: bigint;
  players: readonly `0x${string}`[];
  lotteryState: number;
  winner: `0x${string}`;
  canPickWinner: boolean;
  revealBlock: bigint;
}

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

export interface CreateLotteryForm {
  ticketPrice: string;
  maxPlayers: string;
}

export interface ValidationResult {
  isValid: boolean;
  ticketPriceError: string;
  maxPlayersError: string;
}

export enum LotteryState {
  OPEN = 0,
  CALCULATING_WINNER = 1,
  CLOSED = 2,
}

export interface TransactionStatus {
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  hash?: `0x${string}`;
  error?: Error;
}
