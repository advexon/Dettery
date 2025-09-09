// src/components/LotteryPagination.tsx
'use client';
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LotteryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  className?: string;
}

export function LotteryPagination({
  currentPage,
  totalPages,
  onPageChange,
  onLoadMore,
  hasMore,
  isLoading = false,
  className = ''
}: LotteryPaginationProps) {
  const { t } = useLanguage();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      onLoadMore();
    }
  };

  if (totalPages <= 1 && !hasMore) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Load More Button */}
      {hasMore && (
        <button
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full max-w-md bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-center space-x-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('lottery.pagination.loading')}</span>
              </>
            ) : (
              <>
                <span className="text-lg">📄</span>
                <span>{t('lottery.pagination.loadMore')}</span>
              </>
            )}
          </div>
        </button>
      )}

      {/* Traditional Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('lottery.pagination.previous')}
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('lottery.pagination.next')}
          </button>
        </div>
      )}

      {/* Page Info */}
      <div className="text-sm text-gray-500 text-center">
        {t('lottery.pagination.pageInfo')
          .replace('{{current}}', currentPage.toString())
          .replace('{{total}}', totalPages.toString())}
      </div>
    </div>
  );
}
