import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Hero from '@/components/Hero';
import InspirationSection from '@/components/InspirationSection';
import Testimonials from '@/components/Testimonials';

const LandingPage = () => {
    const { status } = useSession();
    const router = useRouter();
    // Jika ingin halaman utama hanya untuk user login, aktifkan kode berikut:
    // useEffect(() => {
    //   if (status === 'unauthenticated') router.replace('/login');
    // }, [status]);
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>OtLogo - AI Powered Logo Generator</title>
                <meta name="description" content="Generate beautiful, unique logos for your brand in seconds." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex-grow">
                <Hero />
                <InspirationSection />
                <Testimonials />
            </main>
        </div>
    );
};

export default LandingPage;