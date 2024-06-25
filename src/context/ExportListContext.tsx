// src/context/ExportListContext.tsx
"use client";


import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

interface ExportListContextProps {
  exportList: Set<string>;
  setExportList: (newList: Set<string>) => void;
}

interface ExportListProviderProps {
  children: ReactNode;
}

const ExportListContext = createContext<ExportListContextProps | undefined>(undefined);

export const ExportListProvider: React.FC<ExportListProviderProps> = ({ children }) => {
  const [exportList, setExportList] = useState<Set<string>>(new Set());

  const setExportListCallback = useCallback((newList: Set<string>) => {
    setExportList(newList);
  }, []);

  return (
    <ExportListContext.Provider value={{ exportList, setExportList: setExportListCallback }}>
      {children}
    </ExportListContext.Provider>
  );
};

export const useExportList = (): ExportListContextProps => {
  const context = useContext(ExportListContext);
  if (!context) {
    throw new Error('useExportList must be used within an ExportListProvider');
  }
  return context;
};
