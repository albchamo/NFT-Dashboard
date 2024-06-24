'use client';

import React, { useEffect } from 'react';
import { Box, Typography } from "@mui/material";
import Header from '../../components/Header';
import Chart from '../../components/BarChart';
import AstroChart from '../../components/AstroChart';
import CSVUpload from '../../components/CSVUpload';
import CSVExport from '../../components/CSVExport';
import ContractDrawer from '../../components/ContractDrawer';
import LoadingModal from '../../components/LoadingModal';
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard = () => {
  const {
    nodes,
    loading,
    hoverTokenCount,
    clickTokenCount,
    exportList,
    setExportList,
    analysisResults,
    handleCSVUpload,
    exportNodes,
    handleHoverTokenCount,
    handleLeaveTokenCount,
    handleClickTokenCount,
    noContractsFetched,
    fetchAllHolders,
    allHolders // Ensure allHolders is available

  } = useDashboard();

  console.log('Dashboard nodes:', nodes); // Debug log
  console.log('Dashboard analysisResults:', analysisResults); // Debug log
  console.log('Dashboard noContractsFetched:', noContractsFetched); // Debug log

  useEffect(() => {
    // Fetch data when the component mounts if nodes are present
    if (nodes.length > 0 && nodes[0].address) {
      fetchAllHolders();
    }
  }, []);

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
        <Box display="flex" flexDirection="row" width="100%" style={{ paddingTop: "40px" }}>
          <Box width="25%" display="flex" flexDirection="column" alignItems="center">
            <Chart
              analysisResults={analysisResults}
              onHoverTokenCount={handleHoverTokenCount}
              onLeaveTokenCount={handleLeaveTokenCount}
              onClickTokenCount={handleClickTokenCount}
              setExportList={setExportList}
              allHolders={allHolders} // Pass allHolders as a prop

            />
          </Box>
          <Box width="75%">
            <AstroChart
              nodes={nodes}
              analysisResults={analysisResults}
              hoverTokenCount={hoverTokenCount}
              clickTokenCount={clickTokenCount}
              setClickTokenCount={handleClickTokenCount}
              setExportList={setExportList}
            />
          </Box>
        </Box>
      )}
      <div style={{ display: 'none' }}>
        <CSVUpload onUpload={handleCSVUpload} />
        <CSVExport data={exportNodes()} filename="nodes.csv" />
      </div>
    </div>
  );
};

export default Dashboard;
