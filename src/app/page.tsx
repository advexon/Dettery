'use client';
import { useState, useCallback } from 'react';
import { ConnectWallet } from '@/components/ConnectWallet';
import { CreateLottery } from '@/components/CreateLottery';
import { LotteryList } from '@/components/LotteryList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLotteryCreated = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-6xl p-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl">🎲</span>
            </div>
            <div>
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DETTERY
              </h1>
              <p className="text-lg text-gray-500 font-medium">Decentralized Lottery Platform</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience provably fair gaming with transparent randomness, secure smart contracts, and automatic payouts on the Ethereum Sepolia testnet.
          </p>
          <div className="flex justify-center">
            <ConnectWallet />
          </div>
          
          {/* Network Info */}
          <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Connected to Sepolia Testnet</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <section>
            <CreateLottery onLotteryCreated={handleLotteryCreated} />
          </section>
          
          <section className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">ℹ️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">How It Works</h2>
                <p className="text-sm text-gray-500">Transparent and fair lottery system</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-semibold text-gray-800">Create Lottery Pool</p>
                  <p className="text-gray-600 text-sm">Set ticket price and maximum players for your lottery</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-semibold text-gray-800">Players Participate</p>
                  <p className="text-gray-600 text-sm">Anyone can join by paying the ticket price</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-semibold text-gray-800">Fair Winner Selection</p>
                  <p className="text-gray-600 text-sm">Block hash randomness ensures provably fair results</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <p className="font-semibold text-gray-800">Automatic Payouts</p>
                  <p className="text-gray-600 text-sm">Winner gets 80%, admin fee is 20%</p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Security Features</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">Smart Contract Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">No Central Authority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">Transparent Randomness</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700">Automatic Execution</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section>
          <h2 className="mb-6 text-3xl font-bold text-gray-800">Active Lotteries</h2>
          <LotteryList key={refreshKey} />
        </section>
      </div>
    </main>
  );
}
