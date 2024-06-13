'use client';

import React, { useState } from 'react';
import { Box, Drawer, Typography } from '@mui/material';
import { getHolders, getAllHolders } from '../services/alchemyService';
import { analyzeHolders, AnalysisResults } from '../components/analysisService';
import Header from '../components/Header';
import NodeForm from '../components/NodeForm';
import Chart from '../components/BarChart';
import AstroChart from '../components/AstroChart';
import CSVUpload from '../components/CSVUpload';
import CSVExport from '../components/CSVExport';

const Dashboard = () => {
  const [nodes, setNodes] = useState([{ address: '', tag: '' }]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoverTokenCount, setHoverTokenCount] = useState<number | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  const fetchAllHolders = async () => {
    setLoading(true);
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
          />
        </Box>
        <Box width="60%" p={2}>
          {!loading && analysisResults && (
            <AstroChart
              nodes={nodes}
              analysisResults={analysisResults}
              hoverTokenCount={hoverTokenCount}
            />
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
