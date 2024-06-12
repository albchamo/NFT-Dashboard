'use client';

import React, { useState } from 'react';
import { Box, Drawer, Typography } from '@mui/material';
import { getHolders, getAllHolders, analyzeHolders } from '../services/alchemyService';
import Header from '../components/Header';
import NodeForm from '../components/NodeForm';
import Chart from '../components/BarChart';
import AstroChart from '../components/AstroChart';
import CSVUpload from '../components/CSVUpload';
import CSVExport from '../components/CSVExport';

const Dashboard = () => {
  const [nodes, setNodes] = useState([{ address: '', tag: '' }]);
  const [mainHolders, setMainHolders] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoverTokenCount, setHoverTokenCount] = useState<number | null>(null);
  const [clickTokenCount, setClickTokenCount] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<null | {
    totalMainHolders: number;
    holdersWithAllTokens: number;
    holdersWithSomeTokens: number;
    holdersWithNoOtherTokens: number;
    tokenHoldingCounts: { [key: number]: number };
  }>(null);
  const [allHolders, setAllHolders] = useState<{ address: string; holders: Set<string> }[]>([]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const fetchAllHolders = async () => {
    setLoading(true);
    try {
      const holderPromises = nodes.map(node => getHolders(node.address));
      const holdersList = await Promise.all(holderPromises);
      const allHoldersData = holdersList.map((holders, index) => ({
        address: nodes[index].address,
        holders,
      }));
      setAllHolders(allHoldersData);

      if (nodes.length === 1) {
        setMainHolders(holdersList[0]);
      } else {
        const mainHolders = holdersList[0];
        const otherContracts = nodes.slice(1); // All nodes except the first one
        const { otherHolders } = await getAllHolders(nodes[0].address, otherContracts);
        const analysis = analyzeHolders(mainHolders, otherHolders);
        setAnalysisResults(analysis);
        setMainHolders(mainHolders);
      }
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
    // Prepare data for export
    const data = nodes.map(node => ({ address: node.address, tag: node.tag }));
    return data;
  };

  const handleHoverTokenCount = (tokenCount: number) => {
    setHoverTokenCount(tokenCount);
  };

  const handleLeaveTokenCount = () => {
    setHoverTokenCount(null);
  };

  const handleClickTokenCount = (tokenCount: number) => {
    setClickTokenCount(tokenCount);
  };

  return (
    <div>
      <Header onMenuClick={toggleDrawer} />
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer} PaperProps={{ style: { width: '69%' } }}>
        <Box p={2} role="presentation">
          <Typography variant="h6" gutterBottom>
            Node Configuration
          </Typography>
          <CSVUpload onUpload={handleCSVUpload} />
          <NodeForm
            nodes={nodes}
            handleNodeChange={handleNodeChange}
            addNodeField={addNodeField}
            removeNodeField={removeNodeField}
            fetchAllHolders={fetchAllHolders}
            loading={loading}
          />
          <CSVExport data={exportData()} filename="nodes.csv" />
        </Box>
      </Drawer>

      <Box display="flex" flexDirection="row" p={3}>
        <Box width="40%" p={2}>
          <Chart
            analysisResults={analysisResults}
            onHoverTokenCount={handleHoverTokenCount}
            onLeaveTokenCount={handleLeaveTokenCount}
            onClickTokenCount={handleClickTokenCount}
          />
        </Box>
        <Box width="60%" p={2}>
          {!loading && analysisResults && (
            <AstroChart nodes={nodes} holdersData={allHolders} onHoverTokenCount={hoverTokenCount} onClickTokenCount={clickTokenCount} />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
