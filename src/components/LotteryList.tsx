'use client';
import { useCallback } from 'react';
import { LotteryCard } from './LotteryCard';
import { LotterySearch } from './LotterySearch';
import { LotteryPagination } from './LotteryPagination';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLotteryFromUrl } from '@/hooks/useLotteryFromUrl';
import { useLotteryPagination } from '@/hooks/useLotteryPagination';

export function LotteryList() {
  const { t } = useLanguage();
  const targetLottery = useLotteryFromUrl();
  const {
    lotteries,
    allLotteries,
    currentPage,
    totalPages,
    hasMore,
    totalResults,
    isLoadingMore,
    handleSearch,
    handleClearSearch,
    handlePageChange,
    handleLoadMore,
    handleDataRefresh,
    searchQuery,
    isSearching,
  } = useLotteryPagination();

  const handleDataChange = useCallback(() => {
    handleDataRefresh();
  }, [handleDataRefresh]);

  // Show empty state if no lotteries exist
  if (!allLotteries || allLotteries.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-slate-50 to-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">🎲</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">{t('lottery.messages.noActiveLotteries')}</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {t('lottery.messages.noActiveLotteriesDescription')}
        </p>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
          <span className="text-blue-500">💡</span>
          <span className="text-sm text-blue-700">{t('lottery.messages.createFirstLottery')}</span>
        </div>
      </div>
    );
  }

  // Show no results for search
  if (isSearching && lotteries.length === 0) {
    return (
      <div className="space-y-6">
        <LotterySearch
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder={t('lottery.search.placeholder')}
        />
        
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-yellow-50 to-orange-100 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">🔍</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3">{t('lottery.search.noResults')}</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {t('lottery.search.noResultsDescription').replace('{{query}}', searchQuery)}
          </p>
          <button
            onClick={handleClearSearch}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <span className="text-blue-500">🔄</span>
            <span className="text-sm text-blue-700">{t('lottery.search.clearSearch')}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Component */}
      <LotterySearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        placeholder={t('lottery.search.placeholder')}
      />

      {/* Search Results Info */}
      {isSearching && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-blue-500">🔍</span>
            <span className="text-sm text-blue-700">
              {t('lottery.search.resultsInfo').replace('{{count}}', totalResults.toString()).replace('{{query}}', searchQuery)}
            </span>
          </div>
        </div>
      )}

      {/* Shared Lottery Banner */}
      {targetLottery && allLotteries.includes(targetLottery) && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🔗</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">{t('lottery.share.sharedLottery')}</p>
              <p className="text-xs text-blue-600">{t('lottery.share.sharedLotteryDescription')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Lottery Cards */}
      <div className="space-y-4">
        {lotteries.map((address, index) => {
          // Calculate the original index in the reversed array
          const originalIndex = allLotteries.length - 1 - allLotteries.indexOf(address);
          
          return (
            <LotteryCard 
              key={address} 
              address={address} 
              index={originalIndex} 
              onDataChange={handleDataChange}
              isHighlighted={address === targetLottery}
            />
          );
        })}
      </div>

      {/* Pagination */}
      <LotteryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoadingMore}
      />

      {/* Results Summary */}
      <div className="text-center text-sm text-gray-500">
        {isSearching ? (
          <span>
            {t('lottery.search.showingResults')
              .replace('{{showing}}', lotteries.length.toString())
              .replace('{{total}}', totalResults.toString())}
          </span>
        ) : (
          <span>
            {t('lottery.pagination.showingPools')
              .replace('{{showing}}', lotteries.length.toString())
              .replace('{{total}}', allLotteries.length.toString())}
          </span>
        )}
      </div>
    </div>
  );
}
