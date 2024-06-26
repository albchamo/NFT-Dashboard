'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Footer from '../../components/common/Footer';
import Chart from '../../components/BarChart';
import AstroChart from '../../components/AstroChart';
import ContractDrawer from '../../components/common/ContractDrawer';
import LoadingModal from '../../components/common/LoadingModal';
import { useDashboard } from '../../hooks/useDashboard';
import TopBar from '@/components/common/Topbar';


const Dashboard = () => {
  const {
    nodes,
    loading,
    setExportListToTokenCount,
    setExportListToLink,
    resetExportList,
    analysisResults,
    noContractsFetched,
    clickTokenCount, // Use clickTokenCount from useDashboard
  } = useDashboard();

  console.log('Dashboard nodes:', nodes); // Debug log
  console.log('Dashboard analysisResults:', analysisResults); // Debug log
  console.log('Dashboard noContractsFetched:', noContractsFetched); // Debug log
  console.log('Dashboard loading:', loading); // Debug log

  if (loading) {
    return <LoadingModal open={loading} message="Fetching data... please wait." />;
  }

  return (
    <div>
      <TopBar />
      <ContractDrawer />
      {noContractsFetched || !analysisResults ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          textAlign="center" // Add this line to center the text horizontally

          
        >
          <Typography variant="h3">Welcome to Snapshooter. </Typography>
          <Typography variant="body1">A tool to visualize relationships between multiple NFT contracts on Base. 
          <br />
          Please add the contract adresses on the control to begin.</Typography>
        </Box>
      ) : (
        <Box
        display="flex"
        flexDirection="row"
        width="100%"
        height="80vh" // Adjust height to fit the screen properly
        justifyContent="space-between" // Distribute space evenly
        alignItems="center" // Center content vertically
        style={{ paddingTop: '40px', paddingLeft: '20px', paddingRight: '20px' }} // Adjust padding for layout
      >
          {analysisResults && (
            <>
            <Box
                width="30%" // Adjust width to give more space to the chart
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center" // Center content vertically
              >                <Chart
                  analysisResults={analysisResults}
                  setExportListToTokenCount={setExportListToTokenCount}
                  resetExportList={resetExportList}
                />
              </Box>
              <Box
                width="65%" // Adjust width to give more space to the chart
                height= "100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center" // Center content vertically
                style={{ overflow: 'hidden' }}

              >
                <AstroChart
                  nodes={nodes}
                  analysisResults={analysisResults}
                  clickTokenCount={clickTokenCount} // Pass clickTokenCount to AstroChart
                  setExportListToLink={setExportListToLink}
                  resetExportList={resetExportList}
                />
              </Box>
            </>
          )}
        </Box>
      )}
<Footer />
    </div>
  );
};

export default Dashboard;
