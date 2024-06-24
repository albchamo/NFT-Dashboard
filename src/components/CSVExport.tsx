'use client';

import React from 'react';
import { Button } from '@mui/material';
import { CSVLink } from 'react-csv';

interface CSVExportProps {
  data: any[];
  filename: string;
}

const CSVExport: React.FC<CSVExportProps> = ({ data, filename }) => {
  console.log('CSVExport data:', data); // Add log for CSVExport data

  return (
    <CSVLink data={data} filename={filename} style={{ color: 'white', textDecoration: 'none' }}>
      <Button variant="contained" color="primary" id="csv-export-button">
        Export CSV
      </Button>
    </CSVLink>
  );
};

export default CSVExport;
