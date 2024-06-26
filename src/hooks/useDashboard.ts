// src/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllHolders } from '../services/alchemyService';
import { analyzeHolders, AnalysisResults } from '../services/analysisService';
import { getNodesFromUrl, updateUrlParams } from '../utils/urlUtils';
import { useDrawer } from '../context/DrawerContext';
import { useExportList } from '../context/ExportListContext';
import { Node, Link } from '../components/AstroChartTypes';

export const useDashboard = () => {
  const searchParams = useSearchParams();
  const [nodes, setNodes] = useState<{ address: string; tag: string }[]>(() => getNodesFromUrl());
  const [loading, setLoading] = useState(false);
  const [allHolders, setAllHolders] = useState<Set<string>>(new Set());
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [initialFetch, setInitialFetch] = useState<boolean>(true);
  const [clickTokenCount, setClickTokenCount] = useState<number | null>(null);
  const { closeDrawer } = useDrawer();
  const router = useRouter();
  const { exportList, setExportList } = useExportList();



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

  const fetchAllHolders = useCallback(async () => {
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
  }, [nodes, closeDrawer, setExportList]);





  const setExportListToTokenCount = useCallback((tokenCount: number) => {
    if (analysisResults) {
      const holders = analysisResults.holdersByTokenCount[tokenCount];
      setExportList(holders || allHolders);
      setClickTokenCount(tokenCount);
      console.log(`Export list updated for token count ${tokenCount}:`, holders || allHolders);
    }
  }, [analysisResults, allHolders, setExportList]);




  const setExportListToLink = useCallback((link: Link) => {
    const holders = new Set(link.addresses);
    setExportList(holders);
    console.log('Export list updated for link:', holders);
  }, [setExportList]);

  const resetExportList = useCallback(() => {
    setExportList(allHolders);
    setClickTokenCount(null);

    console.log('Export list reset to all holders:', allHolders);
  }, [allHolders, setExportList]);




  const setExportListToContractHolders = useCallback((holders: Set<string>) => {
    setExportList(holders);
    console.log('Export list updated to contract holders:', holders);
  }, [setExportList]);


  const noContractsFetched = nodes.length === 0 || (nodes.length === 1 && !nodes[0].address);



  
  return {
    nodes,
    setNodes, // Ensure setNodes is returned so it can be used to update the URL
    loading,
    exportList,
    setExportListToTokenCount,
    setExportListToLink,
    resetExportList,
    allHolders,
    analysisResults,
    noContractsFetched,
    clickTokenCount, // Return clickTokenCount
    setExportListToContractHolders,

  };
};
