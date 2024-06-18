import React from 'react';
import { Box, Drawer, Button, Menu, MenuItem, Typography } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NodeForm from './NodeForm';
import CSVExport from './CSVExport'; // Import CSVExport


interface ContractDrawerProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  handleCSVClick: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCSVClose: () => void;
  onCSVUploadClick: () => void;
  onCSVExportClick: () => void;
  fetchAllHolders: () => void;
  nodes: { address: string; tag: string }[];
  setNodes: React.Dispatch<React.SetStateAction<{ address: string; tag: string }[]>>;
  handleNodeChange: (index: number, field: 'address' | 'tag', value: string) => void;
  addNodeField: () => void;
  removeNodeField: (index: number) => void;
  loading: boolean;
}

const ContractDrawer: React.FC<ContractDrawerProps> = ({
  drawerOpen, toggleDrawer, handleCSVClick, anchorEl, handleCSVClose,
  onCSVUploadClick, onCSVExportClick, fetchAllHolders, nodes, setNodes,
  handleNodeChange, addNodeField, removeNodeField, loading
}) => {
  return (
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
          borderLeft: '2px solid #fff',
          borderRight: '2px solid #fff',
          borderBottom: '2px solid #fff'
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
            <MenuItem onClick={onCSVUploadClick} style={{ color: '#000000' }}>Upload List</MenuItem>
            <MenuItem onClick={onCSVExportClick} style={{ color: '#000000' }}>Export List</MenuItem>
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
                <CSVExport data={nodes.map(node => ({ address: node.address, tag: node.tag }))} filename="nodes.csv" />

      </Box>
    </Drawer>
  );
};

export default ContractDrawer;
