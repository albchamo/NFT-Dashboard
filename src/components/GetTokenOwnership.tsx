import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { getTokenOwnership } from '../services/alchemyService';

interface GetTokenOwnershipProps {
  holders: string[];
  setOwnershipData: (data: { [address: string]: string[] }) => void;
}

const GetTokenOwnership = ({ holders, setOwnershipData }: GetTokenOwnershipProps) => {
  const [tokenAddresses, setTokenAddresses] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchOwnership = async () => {
    setLoading(true);
    try {
      const tokenAddressArray = tokenAddresses.split(',').map(addr => addr.trim());
      const ownership = await getTokenOwnership(tokenAddressArray, holders);
      setOwnershipData(ownership);
    } catch (error) {
      console.error('Error fetching token ownership:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TextField
        label="Token Contract Addresses (comma-separated)"
        value={tokenAddresses}
        onChange={(e) => setTokenAddresses(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={fetchOwnership}
        disabled={loading || !tokenAddresses || holders.length === 0}
      >
        {loading ? 'Loading...' : 'Fetch Token Ownership'}
      </Button>
    </>
  );
};

export default GetTokenOwnership;
