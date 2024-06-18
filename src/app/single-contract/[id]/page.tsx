// single-contract/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolders, getContractMetadata } from '../../../services/alchemyService';
import Header from '../../../components/Header';
import LoadingModal from '../../../components/LoadingModal';
import CSVExport from '../../../components/CSVExport';
import { Box, Typography, Button } from "@mui/material";

const SingleContractPage = ({ params }) => {
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [holders, setHolders] = useState<Set<string>>(new Set());
  const [metadata, setMetadata] = useState(null);
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
        onControlClick={() => router.back()}
        onFetchDataClick={() => {}}
        onCSVUploadClick={() => {}}
        onCSVExportClick={() => {}}
        isDrawerOpen={false}
      />
      {loading && <LoadingModal open={loading} message="Fetching data... please wait." />}
      {!loading && (
        <Box sx={{ paddingTop: '5%', paddingLeft: "20%" }}>

          {metadata && (
            <Box sx={{ marginBottom: '20px' }}>
              <Typography variant="body1"><strong>Name:</strong> {metadata.name}</Typography>
              <Typography variant="body1"><strong>Symbol:</strong> {metadata.symbol}</Typography>
              <Typography variant="body1"><strong>Total Supply:</strong> {metadata.totalSupply}</Typography>
              <Typography variant="body1"><strong>Decimals:</strong> {metadata.decimals}</Typography>
            </Box>
          )}
          <Typography variant="body1"><strong>Contract Address:</strong> {id}</Typography>
          <Typography variant="body1"><strong>Number of Holders:</strong> {holders.size}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.back()}
            sx={{  marginRight: '10px' }}
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
