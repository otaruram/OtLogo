import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const SubscriptionsPage = () => {
    const { data: session } = useSession();

    if (!session) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>My Subscriptions - AI Logo Maker</title>
            </Head>
            
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8">My Subscriptions</h1>
                    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Choose the best plan for your needs. Unlock premium features and take your branding to the next level.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Google Play Billing Card */}
                        <div className="neo-card">
                            <h2 className="text-2xl font-bold mb-4">For Android App Users</h2>
                            <h3 className="text-xl font-semibold mb-2">Google Play Billing</h3>
                            <p className="mb-4">The easiest and most secure way to subscribe through our Android app. Payments are handled directly by your Google account.</p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                <li>Fast, one-tap payments.</li>
                                <li>Billed automatically (monthly/yearly).</li>
                                <li>Managed directly via Google Play Store.</li>
                            </ul>
                            <p className="text-sm text-gray-500">Note: This method is exclusively for our Android application. A service fee of 15-30% is applied by Google.</p>
                            <button className="neo-btn mt-6 w-full opacity-50 cursor-not-allowed">Available in App</button>
                        </div>

                        {/* Bank Transfer Card */}
                        <div className="neo-card">
                             <h2 className="text-2xl font-bold mb-4">For Website Users</h2>
                            <h3 className="text-xl font-semibold mb-2">Bank Transfer (Virtual Account)</h3>
                            <p className="mb-4">The best way to pay via our website. We use a secure payment gateway for automated and instant activation.</p>
                            <ul className="list-disc list-inside mb-4 space-y-2">
                                 <li>Automatic payment detection.</li>
                                 <li>Instant subscription activation.</li>
                                 <li>Supports Bank BRI and other major Indonesian banks.</li>
                            </ul>
                            <p className="text-sm text-gray-500">You will be provided a unique Virtual Account (VA) number for each transaction. No manual confirmation needed.</p>
                             <button className="neo-btn neo-btn-primary mt-6 w-full">Choose Plan</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    return { props: { session } };
};

export default SubscriptionsPage; 