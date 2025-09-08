'use client';
import { useEffect, useState } from 'react';

export function useLotteryFromUrl() {
  const [targetLottery, setTargetLottery] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const lotteryAddress = urlParams.get('lottery');
      if (lotteryAddress) {
        setTargetLottery(lotteryAddress);
      }
    }
  }, []);

  return targetLottery;
}
