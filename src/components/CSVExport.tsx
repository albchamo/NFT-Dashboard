'use client';

import React from 'react';
import { Button } from '@mui/material';
import { CSVLink } from 'react-csv';

interface CSVExportProps {
  data: any[];
  filename: string;
}

const CSVExport: React.FC<CSVExportProps> = ({ data, filename }) => {
  return (
    <Button variant="contained" color="primary">
      <CSVLink data={data} filename={filename} style={{ color: 'white', textDecoration: 'none' }}>
        Export CSV
      </CSVLink>
    </Button>
  );
};

export default CSVExport;
