// single-contract/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolders, getContractMetadata } from '../../../services/alchemyService';
import Header from '../../../components/common/Header';
import LoadingModal from '../../../components/common/LoadingModal';
import CSVExport from '../../../utils/CSVExport';
import { Box, Typography, Button } from "@mui/material";

interface Params {
  id: string;
}

interface TokenMetadataResponse {
  name: string | null;
  symbol: string | null;
}

interface SingleContractPageProps {
  params: Params;
}

const SingleContractPage: React.FC<SingleContractPageProps> = ({ params }) => {
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [holders, setHolders] = useState<Set<string>>(new Set());
  const [metadata, setMetadata] = useState<TokenMetadataResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContractData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching holders and metadata for contract: ${id}`);
        const [fetchedHolders, fetchedMetadata] = await Promise.all([
          getHolders(id),
          getContractMetadata(id),
        ]);
        console.log(`Fetched holders:`, fetchedHolders);
        console.log(`Fetched metadata:`, fetchedMetadata);
        setHolders(fetchedHolders);
        setMetadata(fetchedMetadata);
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id]);

  const exportData = () => {
    return Array.from(holders).map(holder => ({ address: holder }));
  };

  return (
    <div>
      <Header
      />
      {loading && <LoadingModal open={loading} message="Fetching data... please wait." />}
      {!loading && (
        <Box sx={{ paddingTop: '5%', paddingLeft: "20%" }}>
          {metadata && (
            <Box sx={{ marginBottom: '20px' }}>
              <Typography variant="body1"><strong>Name:</strong> {metadata.name ?? 'N/A'}</Typography>
              <Typography variant="body1"><strong>Symbol:</strong> {metadata.symbol ?? 'N/A'}</Typography>
            </Box>
          )}
          <Typography variant="body1"><strong>Contract Address:</strong> {id}</Typography>
          <Typography variant="body1"><strong>Number of Holders:</strong> {holders.size}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.back()}
            sx={{ marginRight: '10px' }}
          >
            Back
          </Button>
          <CSVExport data={exportData()} filename={`${id}-holders.csv`} />
        </Box>
      )}
    </div>
  );
};

export default SingleContractPage;
