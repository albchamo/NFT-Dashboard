// src/app/dashboard/page.tsx
'use client';

import React from 'react';
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
    setNodes,
    loading,
    drawerOpen,
    hoverTokenCount,
    clickTokenCount,
    exportList,
    setExportList,
    allHolders,
    analysisResults,
    anchorEl,
    toggleDrawer,
    handleCSVClick,
    handleCSVClose,
    onCSVUploadClick,
    onClickNodesExport,
    onClickHoldersExport,
    fetchAllHolders,
    updateNodeField,
    addNodeField,
    removeNodeField,
    handleCSVUpload,
    exportNodes,
    handleHoverTokenCount,
    handleLeaveTokenCount,
    handleClickTokenCount,
    noContractsFetched
  } = useDashboard();

  return (
    <div>
      <Header
        onControlClick={toggleDrawer}
        onFetchDataClick={fetchAllHolders}
        onCSVUploadClick={onCSVUploadClick}
        onCSVExportClick={onClickHoldersExport}
        isDrawerOpen={drawerOpen}
      />
      <ContractDrawer
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        handleCSVClick={handleCSVClick}
        anchorEl={anchorEl}
        handleCSVClose={handleCSVClose}
        onCSVUploadClick={onCSVUploadClick}
        onCSVExportClick={onClickNodesExport}
        fetchAllHolders={fetchAllHolders}
        nodes={nodes}
        setNodes={setNodes} // This line was missing
        handleNodeChange={updateNodeField}
        addNodeField={addNodeField}
        removeNodeField={removeNodeField}
        loading={loading}
        exportNodes={exportNodes} // Ensure exportNodes prop is passed
      />
      {noContractsFetched ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <Typography variant="h3">Add one or more contracts </Typography>
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
            />
          </Box>
          <Box width="75%">
            {!loading && analysisResults && (
              <AstroChart
                nodes={nodes}
                analysisResults={analysisResults}
                hoverTokenCount={hoverTokenCount}
                clickTokenCount={clickTokenCount}
                setClickTokenCount={handleClickTokenCount}
                setExportList={setExportList}
              />
            )}
          </Box>
        </Box>
      )}
      <div style={{ display: 'none' }}>
        <CSVUpload onUpload={handleCSVUpload} />
        <CSVExport data={exportNodes()} filename="nodes.csv" />
      </div>
      <LoadingModal open={loading} message="Fetching data... please wait." />
    </div>
  );
};

export default Dashboard;
