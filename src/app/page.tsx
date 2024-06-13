'use client';

import React, { useState } from 'react';
import { Box, Drawer, Typography, Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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
      <Header
        onControlClick={toggleDrawer}
        onFetchDataClick={fetchAllHolders}
        onCSVUploadClick={onCSVUploadClick}
        onCSVExportClick={onCSVExportClick}
        isDrawerOpen={drawerOpen}
      />
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          style: {
            width: '75%',
            margin: '0 auto',
            backgroundColor: '#000000',
            color: '#ffffff',
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            borderRadius: '8px',
            borderColor: '#fff',
            borderLeft: '2px solid #fff',  // Add this line
            borderRight: '2px solid #fff', // Add this line
            borderBottom: '2px solid #fff' // Add this line
          },
        }}
      >
        <Box role="presentation" display="flex" flexDirection="column" style={{ paddingTop: '16px' }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <Button
              aria-controls="csv-menu"
              aria-haspopup="true"
              onClick={handleCSVClick}
              style={{
                borderColor: '#fff',
                color: '#fff',
                borderWidth: '2px',
                borderStyle: 'solid',
                padding: '8px 16px',
                margin: '0 12px',
              }}
            >
              CSV <ArrowDropDownIcon />
            </Button>
            <Menu
              id="csv-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCSVClose}
              PaperProps={{ style: { backgroundColor: '#ffffff', color: '#000000' } }}
            >
              <MenuItem onClick={onCSVUploadClick} style={{ color: '#000000' }}>Upload CSV</MenuItem>
              <MenuItem onClick={onCSVExportClick} style={{ color: '#000000' }}>Export CSV</MenuItem>
            </Menu>
            <Button
              onClick={toggleDrawer}
              style={{
                borderColor: '#fff',
                color: '#fff',
                borderWidth: '2px',
                borderStyle: 'solid',
                padding: '8px 16px',
                margin: '0 12px',
              }}
            >
              {drawerOpen ? 'Close Control' : 'Open Control'}
            </Button>
            <Button
              onClick={fetchAllHolders}
              style={{
                borderColor: '#fff',
                color: '#fff',
                borderWidth: '2px',
                borderStyle: 'solid',
                padding: '8px 16px',
                margin: '0 12px',
              }}
            >
              Fetch Data
            </Button>
          </Box>
          <Typography
  variant="body1"
  gutterBottom
  style={{ paddingTop: '16px', paddingBottom: '32px', paddingLeft: '18%', paddingRight: '18%' }}
>
  Paste the Contract Address and add a Tag for identification. You can also upload a CSV. Remember to export and store your contract lists locally, we will not save any data.
</Typography>
          <NodeForm
            nodes={nodes}
            setNodes={setNodes}
            handleNodeChange={handleNodeChange}
            addNodeField={addNodeField}
            removeNodeField={removeNodeField}
            fetchAllHolders={fetchAllHolders}
            loading={loading}
          />
        </Box>
      </Drawer>

      <Box display="flex" flexDirection="row"  width="100%">
        <Box width="25%" >
          <Chart
            analysisResults={analysisResults}
            onHoverTokenCount={handleHoverTokenCount}
            onLeaveTokenCount={handleLeaveTokenCount}
          />
        </Box>
        <Box width="75%" >
          {!loading && analysisResults && (
            <AstroChart
              nodes={nodes}
              analysisResults={analysisResults}
              hoverTokenCount={hoverTokenCount}
            />
          )}
        </Box>
      </Box>
      <div style={{ display: 'none' }}>
        <CSVUpload onUpload={handleCSVUpload} />
        <CSVExport data={exportData()} filename="nodes.csv" />
      </div>
    </div>
  );
};

export default Dashboard;
