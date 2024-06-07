import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { getNftHolders } from '../services/alchemyService';

interface GetNftHoldersProps {
  setHolders: (holders: string[]) => void;
  setContractAddress: (address: string) => void;
}

const GetNftHolders = ({ setHolders, setContractAddress }: GetNftHoldersProps) => {
  const [localContractAddress, setLocalContractAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHolders = async () => {
    setLoading(true);
    setContractAddress(localContractAddress);
    try {
      const owners = await getNftHolders(localContractAddress);
      setHolders(owners);
    } catch (error) {
      console.error('Error fetching NFT holders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TextField
        label="NFT Contract Address"
        value={localContractAddress}
        onChange={(e) => setLocalContractAddress(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={fetchHolders}
        disabled={loading || !localContractAddress}
      >
        {loading ? 'Loading...' : 'Fetch NFT Holders'}
      </Button>
    </>
  );
};

export default GetNftHolders;
