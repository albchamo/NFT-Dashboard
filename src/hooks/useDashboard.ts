'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllHolders } from '../services/alchemyService';
import { analyzeHolders, AnalysisResults } from '../components/analysisService';
import { getNodesFromUrl, updateUrlParams } from '../utils/urlUtils';
import { useDrawer } from '../context/DrawerContext';
import { Node, Link } from '../components/AstroChartTypes';

export const useDashboard = () => {
  const searchParams = useSearchParams();
  const [nodes, setNodes] = useState<{ address: string; tag: string }[]>(() => getNodesFromUrl());
  const [loading, setLoading] = useState(false);
  const [clickTokenCount, setClickTokenCount] = useState<number | null>(null);
  const [exportList, setExportList] = useState<Set<string>>(new Set());
  const [allHolders, setAllHolders] = useState<Set<string>>(new Set());
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [initialFetch, setInitialFetch] = useState<boolean>(true);

  const { closeDrawer } = useDrawer();
  const router = useRouter();

  // Fetch all holders when the component mounts if nodes are available in the URL
  useEffect(() => {
    if (initialFetch && nodes.length > 0 && nodes[0].address) {
      fetchAllHolders();
      setInitialFetch(false); // Ensure this runs only once
    }
  }, [nodes, initialFetch]);

  useEffect(() => {
    updateUrlParams(router, nodes);
  }, [nodes, router]);

  useEffect(() => {
    if (clickTokenCount !== null && analysisResults) {
      const holders = analysisResults.holdersByTokenCount[clickTokenCount];
      setExportList(holders || allHolders);
      console.log(`Export list updated for token count ${clickTokenCount}:`, holders || allHolders);
    } else {
      setExportList(allHolders);
      console.log('Export list reset to all holders:', allHolders);
    }
  }, [clickTokenCount, analysisResults, allHolders]);

  const fetchAllHolders = async () => {
    setLoading(true);
    closeDrawer();

    try {
      const mainContractAddress = nodes[0]?.address;
      const otherContracts = nodes.slice(1);

      if (!mainContractAddress) {
        console.error('Main contract address is not set');
        setLoading(false);
        return;
      }

      console.log('Fetching holders for contracts:', mainContractAddress, otherContracts);

      const allHoldersData = await getAllHolders(mainContractAddress, otherContracts);
      console.log('Fetched all holders:', allHoldersData);

      const allHolders = new Set<string>();
      Object.values(allHoldersData.allHolders).forEach(holdersSet => {
        holdersSet.forEach(holder => allHolders.add(holder));
      });

      console.log('All holders state set:', allHolders);

      setAllHolders(allHolders);

      const analysis = analyzeHolders(allHoldersData.allHolders);
      console.log('Analysis results:', analysis);

      setAnalysisResults(analysis);
      console.log('Set analysisResults:', analysis);

      setExportList(allHolders);
      console.log('Set exportList to allHolders:', allHolders);
    } catch (error) {
      console.error('Error fetching holders:', error);
    } finally {
      setLoading(false);
    }
  };

  const setExportListToTokenCount = (tokenCount: number) => {
    if (analysisResults) {
      const holders = analysisResults.holdersByTokenCount[tokenCount];
      setExportList(holders || allHolders);
      console.log(`Export list updated for token count ${tokenCount}:`, holders || allHolders);
    }
  };

  const setExportListToLink = (link: Link) => {
    const holders = new Set(link.addresses);
    setExportList(holders);
    console.log('Export list updated for link:', holders);
  };

  const resetExportList = () => {
    setExportList(allHolders);
    console.log('Export list reset to all holders:', allHolders);
  };

  const noContractsFetched = nodes.length === 0 || (nodes.length === 1 && !nodes[0].address);

  return {
    nodes,
    setNodes, // Ensure setNodes is returned so it can be used to update the URL
    loading,
    clickTokenCount,
    exportList,
    setExportListToTokenCount,
    setExportListToLink,
    resetExportList,
    allHolders,
    analysisResults,
    handleClickTokenCount: setClickTokenCount,
    noContractsFetched,
  };
};
