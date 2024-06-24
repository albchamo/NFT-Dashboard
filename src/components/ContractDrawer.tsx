"use client"; 

import React from 'react';
import { Box, Drawer, Button, Typography } from "@mui/material";
import NodeForm from './NodeForm';
import CSVExport from './CSVExport';
import CSVUpload from './CSVUpload'; 
import { useDrawer } from '../context/DrawerContext';
import { useDashboard } from '../hooks/useDashboard';

const ContractDrawer: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const {
    nodes,
    setNodes,
    handleNodeChange,
    addNodeField,
    removeNodeField,
    loading,
    handleCSVUpload,
    exportNodes
  } = useDashboard();

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Drawer
      anchor="top"
      open={isDrawerOpen}
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
          borderLeft: '2px solid #fff',
          borderRight: '2px solid #fff',
          borderBottom: '2px solid #fff'
        },
      }}
    >
      <Box role="presentation" display="flex" flexDirection="column" style={{ paddingTop: '16px' }}>
        <Box display="flex" justifyContent="center" mb={2}>
          <CSVExport data={nodes.map(node => ({ address: node.address, tag: node.tag }))} filename="nodes.csv" />
          <CSVUpload onUpload={handleCSVUpload} />
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
            {isDrawerOpen ? 'Close Control' : 'Open Control'}
          </Button>
          <Button
            onClick={refreshPage}
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
        />
      </Box>
    </Drawer>
  );
};

export default ContractDrawer;

