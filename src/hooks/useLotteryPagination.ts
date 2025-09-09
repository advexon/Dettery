// src/hooks/useLotteryPagination.ts
'use client';
import { useState, useMemo, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/lib/config';

const POOLS_PER_PAGE = 5;

export function useLotteryPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadedPools, setLoadedPools] = useState<readonly `0x${string}`[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: allLotteryAddresses, refetch } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: 'getDeployedLotteries',
  });

  // Filter lotteries based on search query
  const filteredLotteries = useMemo(() => {
    if (!allLotteryAddresses) return [];
    
    if (!searchQuery.trim()) {
      return allLotteryAddresses;
    }

    const query = searchQuery.toLowerCase();
    return allLotteryAddresses.filter(address => 
      address.toLowerCase().includes(query)
    );
  }, [allLotteryAddresses, searchQuery]);

  // Get lotteries for current page
  const paginatedLotteries = useMemo(() => {
    const startIndex = (currentPage - 1) * POOLS_PER_PAGE;
    const endIndex = startIndex + POOLS_PER_PAGE;
    return filteredLotteries.slice(0, endIndex);
  }, [filteredLotteries, currentPage]);

  // Calculate pagination info
  const totalPages = Math.ceil(filteredLotteries.length / POOLS_PER_PAGE);
  const hasMore = paginatedLotteries.length < filteredLotteries.length;
  const totalResults = filteredLotteries.length;

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore]);

  // Handle data refresh
  const handleDataRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // Data
    lotteries: paginatedLotteries,
    allLotteries: allLotteryAddresses || [],
    filteredLotteries,
    
    // Pagination state
    currentPage,
    totalPages,
    hasMore,
    totalResults,
    isLoadingMore,
    
    // Actions
    handleSearch,
    handleClearSearch,
    handlePageChange,
    handleLoadMore,
    handleDataRefresh,
    
    // Search state
    searchQuery,
    isSearching: searchQuery.trim().length > 0,
  };
}
