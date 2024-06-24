'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { getAllHolders } from '../services/alchemyService';
import { analyzeHolders, AnalysisResults } from '../components/analysisService';
import { getNodesFromUrl, updateUrlParams } from '../utils/urlUtils';
import { useDrawer } from '../context/DrawerContext';

export const useDashboard = () => {
  const [nodes, setNodes] = useState<{ address: string; tag: string }[]>(getNodesFromUrl());
  const [loading, setLoading] = useState(false);
  const [hoverTokenCount, setHoverTokenCount] = useState<number | null>(null);
  const [clickTokenCount, setClickTokenCount] = useState<number | null>(null);
  const [exportList, setExportList] = useState<Set<string> | null>(null);
  const [allHolders, setAllHolders] = useState<Set<string>>(new Set());
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { toggleDrawer, closeDrawer } = useDrawer(); // Added closeDrawer
  const router = useRouter(); 

  useEffect(() => {
    updateUrlParams(router, nodes);
  }, [nodes, router]);

  useEffect(() => {
    if (clickTokenCount !== null && analysisResults) {
      const holders = analysisResults.holdersByTokenCount[clickTokenCount];
      setExportList(holders || null);
    } else {
      setExportList(allHolders);
    }
  }, [clickTokenCount, analysisResults, allHolders]);

  const handleCSVClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCSVClose = () => {
    setAnchorEl(null);
  };

  const onCSVUploadClick = () => {
    const uploadButton = document.getElementById('csv-upload-button');
    if (uploadButton) {
      uploadButton.click();
    }
    handleCSVClose();
  };

  const onClickNodesExport = () => {
    const nodeData = exportNodes();
    if (nodeData.length > 0) {
      const csvExportElement = document.createElement('a');
      const csvContent = 'data:text/csv;charset=utf-8,' + nodeData.map(e => `${e.address},${e.tag}`).join('\n');
      csvExportElement.setAttribute('href', encodeURI(csvContent));
      csvExportElement.setAttribute('download', 'nodes.csv');
      csvExportElement.click();
    } else {
      alert("No node data available for export");
    }
    handleCSVClose();
  };

  const onClickHoldersExport = () => {
    if (!exportList || exportList.size === 0) {
      alert("No holder data available for export");
      return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + Array.from(exportList).map(holder => holder).join('\n');
    const csvExportElement = document.createElement('a');
    csvExportElement.setAttribute('href', encodeURI(csvContent));
    csvExportElement.setAttribute('download', 'holders.csv');
    csvExportElement.click();
  };

  const fetchAllHolders = async () => {
    setLoading(true);
    closeDrawer(); // Use closeDrawer to ensure the drawer is closed after fetching data

    try {
      const mainContractAddress = nodes[0]?.address; // Add optional chaining to prevent errors
      const otherContracts = nodes.slice(1);

      if (!mainContractAddress) {
        console.error('Main contract address is not set');
        setLoading(false);
        return;
      }

      console.log('Fetching holders for contracts:', mainContractAddress, otherContracts);

      const { allHolders } = await getAllHolders(mainContractAddress, otherContracts);
      console.log('Fetched all holders:', allHolders);

      const holderSet = new Set(Object.keys(allHolders));
      console.log('Holder set:', holderSet);

      setAllHolders(holderSet);
      console.log('All holders state set:', allHolders);

      const analysis = analyzeHolders(allHolders);
      console.log('Analysis results:', analysis); // Add log for analysis results

      setAnalysisResults(analysis);
      console.log('Set analysisResults:', analysis); // Log the analysis result that is set
    } catch (error) {
      console.error('Error fetching holders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeChange = (index: number, field: 'address' | 'tag', value: string) => {
    const updatedNodes = [...nodes];
    updatedNodes[index][field] = value;
    setNodes(updatedNodes);
  };

  const addNodeField = () => {
    setNodes([...nodes, { address: '', tag: '' }]);
  };

  const removeNodeField = (index: number) => {
    const updatedNodes = [...nodes];
    updatedNodes.splice(index, 1);
    setNodes(updatedNodes);
  };

  const handleCSVUpload = (data: { address: string; tag: string }[]) => {
    setNodes(data);
  };

  const exportNodes = () => {
    return nodes.map(node => ({ address: node.address, tag: node.tag }));
  };

  const handleHoverTokenCount = (tokenCount: number | null) => {
    setHoverTokenCount(tokenCount);
  };

  const handleLeaveTokenCount = () => {
    setHoverTokenCount(null);
  };

  const handleClickTokenCount = (tokenCount: number | null) => {
    if (clickTokenCount === tokenCount) {
      setClickTokenCount(null);
    } else {
      setClickTokenCount(tokenCount);
    }
  };

  const noContractsFetched = nodes.length === 0 || (nodes.length === 1 && !nodes[0].address);

  console.log('noContractsFetched:', noContractsFetched); // Add console log
  console.log('nodes:', nodes); // Add console log
  console.log('loading:', loading); // Add console log
  console.log('analysisResults:', analysisResults); // Add console log

  return {
    nodes,
    setNodes,
    loading,
    hoverTokenCount,
    clickTokenCount,
    exportList,
    setExportList,
    allHolders,
    analysisResults,
    anchorEl,
    handleCSVClick,
    handleCSVClose,
    onCSVUploadClick,
    onClickNodesExport,
    onClickHoldersExport,
    fetchAllHolders,
    handleNodeChange,
    addNodeField,
    removeNodeField,
    handleCSVUpload,
    exportNodes,
    handleHoverTokenCount,
    handleLeaveTokenCount,
    handleClickTokenCount,
    noContractsFetched
  };
};
