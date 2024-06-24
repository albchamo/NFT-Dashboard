'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Header from '../../components/Header';
import Chart from '../../components/BarChart';
import AstroChart from '../../components/AstroChart';
import ContractDrawer from '../../components/ContractDrawer';
import LoadingModal from '../../components/LoadingModal';
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard = () => {
  const {
    nodes,
    loading,
    clickTokenCount,
    setExportListToTokenCount,
    setExportListToLink,
    resetExportList,
    analysisResults,
    handleClickTokenCount,
    noContractsFetched,
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
      <Header />
      <ContractDrawer />
      {noContractsFetched || !analysisResults ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <Typography variant="h3">Welcome to Snapshooter. </Typography>
          <Typography variant="body1">Add contracts to begin to explore.</Typography>
        </Box>
      ) : (
        <Box
        display="flex"
        flexDirection="row"
        width="100%"
        height="80vh" // Adjust height to fit the screen properly
        justifyContent="space-between" // Distribute space evenly
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
                  onClickTokenCount={handleClickTokenCount}
                  setExportListToTokenCount={setExportListToTokenCount}
                  resetExportList={resetExportList}
                />
              </Box>
              <Box
                width="65%" // Adjust width to give more space to the chart
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center" // Center content vertically
              >
                <AstroChart
                  nodes={nodes}
                  analysisResults={analysisResults}
                  clickTokenCount={clickTokenCount}
                  setClickTokenCount={handleClickTokenCount}
                  setExportListToLink={setExportListToLink}
                  resetExportList={resetExportList}
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </div>
  );
};

export default Dashboard;
