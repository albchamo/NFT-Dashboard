import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface SidebarProps {
  nodes: { address: string; tag: string }[];
  handleNodeChange: (index: number, field: 'address' | 'tag', value: string) => void;
  addNodeField: () => void;
  removeNodeField: (index: number) => void;
  fetchMainHolders: () => void;
  loading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ nodes, handleNodeChange, addNodeField, removeNodeField, fetchMainHolders, loading }) => {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {nodes.map((node, index) => (
          <ListItem key={index}>
            <TextField
              label={`Node ${index + 1} Contract Address`}
              value={node.address}
              onChange={(e) => handleNodeChange(index, 'address', e.target.value)}
              fullWidth
              margin="normal"
              style={{ maxWidth: '150px' }}
            />
            <TextField
              label={`Node ${index + 1} Tag`}
              value={node.tag}
              onChange={(e) => handleNodeChange(index, 'tag', e.target.value)}
              fullWidth
              margin="normal"
              style={{ maxWidth: '80px', marginLeft: '8px' }}
            />
            {index > 0 && (
              <IconButton
                onClick={() => removeNodeField(index)}
                color="secondary"
                aria-label="remove node"
                style={{ marginLeft: '8px' }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ListItem>
        ))}
        <ListItem>
          <Button variant="contained" color="primary" onClick={addNodeField}>
            Add Node
          </Button>
        </ListItem>
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchMainHolders}
            disabled={loading || !nodes[0].address}
          >
            {loading ? 'Loading...' : 'Fetch Node 1 Holders'}
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
