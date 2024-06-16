'use client';

import React, { useState } from 'react';
import { Box, Typography } from "@mui/material";
import { getAllHolders } from '../services/alchemyService';
import { analyzeHolders, AnalysisResults } from '../components/analysisService';
import Header from '../components/Header';
import Chart from '../components/BarChart';
import AstroChart from '../components/AstroChart';
import CSVUpload from '../components/CSVUpload';
import CSVExport from '../components/CSVExport';
import ContractDrawer from '../components/ContractDrawer';
import LoadingModal from '../components/LoadingModal';

const Dashboard = () => {
  const [nodes, setNodes] = useState([{ address: '', tag: '' }]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoverTokenCount, setHoverTokenCount] = useState<number | null>(null);
  const [clickTokenCount, setClickTokenCount] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

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

  const onCSVExportClick = () => {
    const exportButton = document.getElementById('csv-export-button');
    if (exportButton) {
      exportButton.click();
    }
    handleCSVClose();
  };

  const fetchAllHolders = async () => {
    setLoading(true);
    setDrawerOpen(false);  // Close the drawer when fetching data
    try {
      const mainContractAddress = nodes[0].address;
      const otherContracts = nodes.slice(1);

      const { allHolders } = await getAllHolders(mainContractAddress, otherContracts);

      const analysis = analyzeHolders(allHolders);
      setAnalysisResults(analysis);
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

  const exportData = () => {
    return nodes.map(node => ({ address: node.address, tag: node.tag }));
  };

  const handleHoverTokenCount = (tokenCount: number) => {
    setHoverTokenCount(tokenCount);
  };

  const handleLeaveTokenCount = () => {
    setHoverTokenCount(null);
  };

  const handleClickTokenCount = (tokenCount: number) => {
    if (clickTokenCount === tokenCount) {
      setClickTokenCount(null);  // Deactivate the view if the same bar is clicked again
    } else {
      setClickTokenCount(tokenCount);  // Activate the view for the clicked token count
    }
  };

  return (
    <div>
      <Header
        onControlClick={toggleDrawer}
        onFetchDataClick={fetchAllHolders}
        onCSVUploadClick={onCSVUploadClick}
        onCSVExportClick={onCSVExportClick}
        isDrawerOpen={drawerOpen}
      />
      <ContractDrawer
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        handleCSVClick={handleCSVClick}
        anchorEl={anchorEl}
        handleCSVClose={handleCSVClose}
        onCSVUploadClick={onCSVUploadClick}
        onCSVExportClick={onCSVExportClick}
        fetchAllHolders={fetchAllHolders}
        nodes={nodes}
        setNodes={setNodes}
        handleNodeChange={handleNodeChange}
        addNodeField={addNodeField}
        removeNodeField={removeNodeField}
        loading={loading}
      />
      <Box display="flex" flexDirection="row" width="100%" style={{ paddingTop: "40px" }}>
        <Box width="25%">
          <Chart
            analysisResults={analysisResults}
            onHoverTokenCount={handleHoverTokenCount}
            onLeaveTokenCount={handleLeaveTokenCount}
            onClickTokenCount={handleClickTokenCount}
          />
        </Box>
        <Box width="75%">
          {!loading && analysisResults && (
            <AstroChart
              nodes={nodes}
              analysisResults={analysisResults}
              hoverTokenCount={hoverTokenCount}
              clickTokenCount={clickTokenCount}
              setClickTokenCount={setClickTokenCount}
            />
          )}
        </Box>
      </Box>
      <div style={{ display: 'none' }}>
        <CSVUpload onUpload={handleCSVUpload} />
        <CSVExport data={exportData()} filename="nodes.csv" />
      </div>
      <LoadingModal open={loading} message="Fetching data... please wait." />
    </div>
  );
};

export default Dashboard;
