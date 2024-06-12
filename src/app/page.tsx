'use client';

import React, { useState } from 'react';
import { Typography, Button, TextField, List, ListItem, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { getHolders, getAllHolders, analyzeHolders } from '../services/alchemyService';

const Dashboard = () => {
  const [mainContract, setMainContract] = useState('');
  const [mainHolders, setMainHolders] = useState<Set<string> | null>(null);
  const [otherContracts, setOtherContracts] = useState([{ address: '', tag: '' }]);
  const [loading, setLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    totalMainHolders: number;
    holdersWithAllTokens: number;
    holdersWithSomeTokens: number;
    holdersWithNoOtherTokens: number;
    tokenHoldingCounts: { [key: number]: number };
  }>(null);

  const fetchMainHolders = async () => {
    setLoading(true);
    try {
      const holders = await getHolders(mainContract);
      setMainHolders(holders);
    } catch (error) {
      console.error('Error fetching main contract holders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherContractsData = async () => {
    if (!mainHolders) return;

    setLoading(true);
    try {
      const { otherHolders } = await getAllHolders(mainContract, otherContracts);
      const analysis = analyzeHolders(mainHolders, otherHolders);
      setAnalysisResults(analysis);
    } catch (error) {
      console.error('Error fetching data for other contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtherContractChange = (index: number, field: 'address' | 'tag', value: string) => {
    const updatedContracts = [...otherContracts];
    updatedContracts[index][field] = value;
    setOtherContracts(updatedContracts);
  };

  const addContractField = () => {
    setOtherContracts([...otherContracts, { address: '', tag: '' }]);
  };

  const removeContractField = (index: number) => {
    const updatedContracts = [...otherContracts];
    updatedContracts.splice(index, 1);
    setOtherContracts(updatedContracts);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <TextField
        label="Main NFT Contract Address"
        value={mainContract}
        onChange={(e) => setMainContract(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={fetchMainHolders}
        disabled={loading || !mainContract}
      >
        {loading ? 'Loading...' : 'Fetch Main Contract Holders'}
      </Button>

      {mainHolders && (
        <Typography variant="h6" gutterBottom>
          Number of Holders for Main Contract: {mainHolders.size}
        </Typography>
      )}

      {mainHolders && (
        <>
          {otherContracts.map((contract, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <TextField
                label="Token Contract Address"
                value={contract.address}
                onChange={(e) => handleOtherContractChange(index, 'address', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Tag"
                value={contract.tag}
                onChange={(e) => handleOtherContractChange(index, 'tag', e.target.value)}
                fullWidth
                margin="normal"
                style={{ marginLeft: '8px' }}
              />
              <IconButton
                onClick={() => removeContractField(index)}
                color="secondary"
                aria-label="remove contract"
                style={{ marginLeft: '8px' }}
              >
                <Delete />
              </IconButton>
            </div>
          ))}

          <Button variant="contained" color="primary" onClick={addContractField}>
            Add Another Contract
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={fetchOtherContractsData}
            disabled={loading || otherContracts.some(contract => !contract.address)}
            style={{ marginTop: '16px' }}
          >
            {loading ? 'Loading...' : 'Fetch Data for Other Contracts'}
          </Button>
        </>
      )}

      {analysisResults && (
        <div>
          <Typography variant="h6" gutterBottom>
            Analysis Results
          </Typography>
          <List>
            <ListItem>Total Main Holders: {analysisResults.totalMainHolders}</ListItem>
            <ListItem>Holders with All Tokens: {analysisResults.holdersWithAllTokens}</ListItem>
            <ListItem>Holders with Some Tokens: {analysisResults.holdersWithSomeTokens}</ListItem>
            <ListItem>Holders with No Other Tokens: {analysisResults.holdersWithNoOtherTokens}</ListItem>
            {Object.entries(analysisResults.tokenHoldingCounts).map(([count, holders]) => (
              <ListItem key={count}>
                Holders with {count} Tokens: {holders}
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
