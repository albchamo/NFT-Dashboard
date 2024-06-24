"use client"; 

import React, { useState, useEffect } from 'react';
import { Box, Drawer, Button, Typography } from "@mui/material";
import NodeForm from './NodeForm';
import CSVExport from './CSVExport';
import CSVUpload from './CSVUpload'; 
import { useDrawer } from '../context/DrawerContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getNodesFromUrl, updateUrlParams } from '../utils/urlUtils';
import { useDashboard } from '../hooks/useDashboard';

const ContractDrawer: React.FC = () => {
  const { isDrawerOpen, toggleDrawer } = useDrawer();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [nodes, setNodes] = useState<{ address: string; tag: string }[]>(() => getNodesFromUrl());

  useEffect(() => {
    updateUrlParams(router, nodes);
  }, [nodes, router]);

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
  const refreshPage = () => {
    window.location.reload(); // This will reload the page with the updated URL
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
            onClick={refreshPage} // Manually trigger the fetch function
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
