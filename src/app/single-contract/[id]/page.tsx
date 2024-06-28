'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getHolders, getContractMetadata } from '../../../services/alchemyService';
import Footer from '../../../components/common/Footer';
import LoadingModal from '../../../components/common/LoadingModal';
import { useDashboard } from '../../../hooks/useDashboard';
import { Box, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import ContractDrawer from '../../../components/common/ContractDrawer';
import TopBar from '@/components/common/Topbar';

interface Params {
  id: string;
}

interface OpenSeaMetadata {
  floorPrice?: number;
  collectionName?: string;
  collectionSlug?: string;
  safelistRequestStatus?: string;
  imageUrl?: string;
  description?: string;
  externalUrl?: string | null;
  twitterUsername?: string;
  discordUrl?: string;
  bannerImageUrl?: string;
  lastIngestedAt?: string;
}

interface TokenMetadataResponse {
  name: string | null;
  symbol: string | null;
  totalSupply?: string;
  tokenType?: string;
  contractDeployer?: string;
  deployedBlockNumber?: number;
  decimals?: number | null;
  openSeaMetadata?: OpenSeaMetadata;
}

interface SingleContractPageProps {
  params: Params;
}

const SingleContractPage: React.FC<SingleContractPageProps> = ({ params }) => {
  const { id } = params;
  const [loading, setLoading] = useState(false);
  const [holders, setHolders] = useState<Set<string>>(new Set());
  const [metadata, setMetadata] = useState<TokenMetadataResponse | null>(null);
  const { setExportListToContractHolders } = useDashboard();
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

        // Add console log to inspect metadata
        console.log('Fetched metadata from Alchemy:', fetchedMetadata);

        setHolders(fetchedHolders);
        setMetadata(fetchedMetadata);
        setExportListToContractHolders(fetchedHolders);
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [id, setExportListToContractHolders]);

  return (
    <div>
      <TopBar />

      <Footer />
      <ContractDrawer />
      {loading && <LoadingModal open={loading} message="Fetching data... please wait." />}
      {!loading && metadata && (
        <Box sx={{ paddingTop: '5%', paddingLeft: "20%" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.back()}
            sx={{ marginRight: '10px' }}
          >
            Back
          </Button>
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="body1"><strong>Collection Name:</strong> {metadata.name ?? 'N/A'}</Typography>
            <Typography variant="body1"><strong>Symbol:</strong> {metadata.symbol ?? 'N/A'}</Typography>
            <Typography variant="body1"><strong>Total Supply:</strong> {metadata.totalSupply ?? 'N/A'}</Typography>
            <Typography variant="body1"><strong>Token Type:</strong> {metadata.tokenType ?? 'N/A'}</Typography>
            <Typography variant="body1"><strong>Deployed Block Number:</strong> {metadata.deployedBlockNumber ?? 'N/A'}</Typography>
            <Typography variant="body1"><strong>Decimals:</strong> {metadata.decimals ?? 'N/A'}</Typography>
            <Typography variant="body1"><strong>Contract Deployer:</strong> {metadata.contractDeployer ?? 'N/A'}</Typography>
          </Box>
          {metadata.openSeaMetadata && (
            <Box sx={{ marginBottom: '20px' }}>
              <Typography variant="body1"><strong>OpenSea Collection Name:</strong> {metadata.openSeaMetadata.collectionName ?? 'N/A'}</Typography>
              <Typography variant="body1"><strong>Floor Price:</strong> {metadata.openSeaMetadata.floorPrice ?? 'N/A'}</Typography>
              <Typography variant="body1"><strong>Safelist Request Status:</strong> {metadata.openSeaMetadata.safelistRequestStatus ?? 'N/A'}</Typography>
              <Typography variant="body1"><strong>Description:</strong> {metadata.openSeaMetadata.description ?? 'N/A'}</Typography>
              {metadata.openSeaMetadata.imageUrl && (
                <Card sx={{ maxWidth: 345, marginTop: '20px' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={metadata.openSeaMetadata.imageUrl}
                    alt={metadata.name ?? 'Contract Image'}
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Contract Image
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}
          <Typography variant="body1"><strong>Contract Address:</strong> {id}</Typography>
          <Typography variant="body1"><strong>Number of Holders:</strong> {holders.size}</Typography>
        </Box>
      )}
    </div>
  );
};

export default SingleContractPage;
