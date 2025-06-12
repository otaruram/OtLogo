import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import type { Session } from 'next-auth';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../../next-i18next.config.js';
import { CreditsProvider } from '@/contexts/CreditsContext';
import Layout from '@/components/Layout';
import { Toaster } from 'react-hot-toast';

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={session}>
        <CreditsProvider>
            <Layout>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                <Component {...pageProps} />
            </Layout>
        </CreditsProvider>
    </SessionProvider>
  );
};

export default appWithTranslation(MyApp, nextI18NextConfig); 