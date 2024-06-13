'use client';

import React from 'react';
import { Button } from '@mui/material';
import Papa from 'papaparse';

interface CSVUploadProps {
  onUpload: (data: { address: string; tag: string }[]) => void;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onUpload }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data as { address: string; tag: string }[];
        onUpload(data);
      },
    });
  };

  return (
    <div>
      <Button variant="contained" component="label" id="csv-upload-button">
        Upload CSV
        <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
      </Button>
    </div>
  );
};

export default CSVUpload;
