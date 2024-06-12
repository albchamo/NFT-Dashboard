'use client';

import React from 'react';
import { TextField, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface NodeFormProps {
  nodes: { address: string; tag: string }[];
  handleNodeChange: (index: number, field: 'address' | 'tag', value: string) => void;
  addNodeField: () => void;
  removeNodeField: (index: number) => void;
  fetchAllHolders: () => void;
  loading: boolean;
}

const NodeForm: React.FC<NodeFormProps> = ({
  nodes,
  handleNodeChange,
  addNodeField,
  removeNodeField,
  fetchAllHolders,
  loading,
}) => {
  return (
    <div>
      {nodes.map((node, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <TextField
            label={`Node ${index + 1} Contract Address`}
            value={node.address}
            onChange={(e) => handleNodeChange(index, 'address', e.target.value)}
            margin="normal"
            style={{ flex: 2 }}
          />
          <TextField
            label="Tag"
            value={node.tag}
            onChange={(e) => handleNodeChange(index, 'tag', e.target.value)}
            margin="normal"
            style={{ flex: 1, marginLeft: '8px' }}
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
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={addNodeField} fullWidth>
        Add Another Node
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchAllHolders}
        disabled={loading || nodes.some(node => !node.address)}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        {loading ? 'Loading...' : 'Fetch All Holders'}
      </Button>
    </div>
  );
};

export default NodeForm;
