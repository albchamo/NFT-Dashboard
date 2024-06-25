import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { DrawerProvider } from '../context/DrawerContext';
import { ExportListProvider } from '../context/ExportListContext';



const Layout = dynamic(() => import('../components/Layout'), { ssr: false });

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#000000', color: '#ffffff' }}> {/* Dark background and white font */}
      <ExportListProvider>
      <DrawerProvider>
          <Layout>{children}</Layout>
        </DrawerProvider>
        </ExportListProvider>

      </body>
    </html>
  );
};

export default RootLayout;
