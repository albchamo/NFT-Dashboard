import { ReactNode } from 'react';
import Layout from '../components/Layout';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <head>
        <title>NFT Dashboard</title>
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
};

export default RootLayout;
