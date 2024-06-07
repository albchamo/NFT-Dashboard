'use client';

import { useState } from 'react';
import { Typography, List, ListItem } from '@mui/material';
import GetNftHolders from '../components/GetNFTHolders';
import GetTokenOwnership from '../components/GetTokenOwnership';
import GetTokenTransfers from '../components/GetTokenTransfers';

const Home = () => {
  const [mainContractAddress, setMainContractAddress] = useState<string>('');
  const [tokenContractAddresses, setTokenContractAddresses] = useState<string[]>([]);
  const [holders, setHolders] = useState<string[]>([]);
  const [ownershipData, setOwnershipData] = useState<{ [address: string]: string[] }>({});

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <GetNftHolders setHolders={setHolders} setContractAddress={setMainContractAddress} />

      <Typography variant="h6" gutterBottom>
        NFT Holders
      </Typography>
      {holders.length > 0 ? (
        <List>
          {holders.map((holder) => (
            <ListItem key={holder}>{holder}</ListItem>
          ))}
        </List>
      ) : (
        <Typography>No holders found or enter a valid contract address.</Typography>
      )}

      <GetTokenOwnership holders={holders} setOwnershipData={setOwnershipData} />

      <Typography variant="h6" gutterBottom>
        Ownership Breakdown
      </Typography>
      {Object.keys(ownershipData).length > 0 ? (
        <List>
          {Object.entries(ownershipData).map(([tokenAddress, tokenHolders]) => (
            <ListItem key={tokenAddress}>
              <Typography variant="body1">
                {tokenAddress}: {tokenHolders.length} holders
              </Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No token ownership data available.</Typography>
      )}

      {mainContractAddress && (
        <GetTokenTransfers 
          mainContractAddress={mainContractAddress}
          tokenContractAddresses={Object.keys(ownershipData)}
          holders={holders} 
        />
      )}
    </>
  );
};

export default Home;
