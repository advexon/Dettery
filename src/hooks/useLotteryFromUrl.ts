'use client';
import { useEffect, useState } from 'react';

export function useLotteryFromUrl() {
  const [targetLottery, setTargetLottery] = useState<`0x${string}` | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const lotteryAddress = urlParams.get('lottery');
      if (lotteryAddress) {
        setTargetLottery(lotteryAddress as `0x${string}`);
      }
    }
  }, []);

  return targetLottery;
}
