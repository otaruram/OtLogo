import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import KiranaChatbot from './KiranaChatbot';
import Footer from './Footer';

const DynamicKiranaChatbot = dynamic(() => import('./KiranaChatbot'), {
  ssr: false,
});

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <DynamicKiranaChatbot />
      <Footer />
    </div>
  );
};

export default Layout; 