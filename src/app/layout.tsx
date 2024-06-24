import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { DrawerProvider } from '../context/DrawerContext';


const Layout = dynamic(() => import('../components/Layout'), { ssr: false });

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#000000', color: '#ffffff' }}> {/* Dark background and white font */}
      <DrawerProvider>
          <Layout>{children}</Layout>
        </DrawerProvider>
      </body>
    </html>
  );
};

export default RootLayout;
