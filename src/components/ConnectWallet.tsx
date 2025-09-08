'use client';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from 'react';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder that matches the expected structure
    return (
      <div className="text-right">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="text-right">
        <p className="truncate text-sm text-gray-600">Connected: {address}</p>
        <button 
          onClick={() => disconnect()} 
          className="font-bold text-red-500 hover:text-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="rounded-lg bg-blue-600 px-6 py-2 font-bold text-white hover:bg-blue-700 transition-colors shadow-md"
    >
      Connect Wallet
    </button>
  );
}
