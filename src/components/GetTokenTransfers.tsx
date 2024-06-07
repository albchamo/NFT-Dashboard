import { useState, useEffect } from 'react';
import { Button, List, ListItem, Typography } from '@mui/material';
import { getTokenTransferEvents } from '../services/alchemyService';

interface GetTokenTransfersProps {
  mainContractAddress: string;
  tokenContractAddresses: string[];
  holders: string[];
}

const GetTokenTransfers = ({ mainContractAddress, tokenContractAddresses, holders }: GetTokenTransfersProps) => {
  const [transfers, setTransfers] = useState<{ [holder: string]: any[] }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const allTransfers: { [holder: string]: any[] } = {};

      for (const holder of holders) {
        console.log(`Fetching transfers for holder: ${holder}`);
        const holderTransfers = await getTokenTransferEvents([mainContractAddress, ...tokenContractAddresses], holder);
        console.log(`Transfers for holder ${holder}:`, holderTransfers);
        allTransfers[holder] = holderTransfers;
      }

      setTransfers(allTransfers);
    } catch (error) {
      console.error('Error fetching token transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchTransfers}
        disabled={loading || holders.length === 0}
      >
        {loading ? 'Loading...' : 'Fetch Token Transfers'}
      </Button>

      {Object.keys(transfers).length > 0 && (
        <div>
          {Object.entries(transfers).map(([holder, holderTransfers]) => (
            <div key={holder}>
              <Typography variant="h6">{holder}</Typography>
              <List>
                {holderTransfers.length > 0 ? (
                  holderTransfers.map((transfer, index) => (
                    <ListItem key={index}>
                      <Typography variant="body2">
                        Block: {transfer.blockNum} | Txn Hash: {transfer.hash} | Date: {transfer.metadata?.blockTimestamp ? new Date(transfer.metadata.blockTimestamp).toLocaleString() : 'N/A'}
                      </Typography>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <Typography variant="body2">No transfers found.</Typography>
                  </ListItem>
                )}
              </List>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default GetTokenTransfers;
