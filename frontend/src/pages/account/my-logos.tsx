import { useState } from 'react';
import AccountLayout from '@/components/AccountLayout';
import Head from 'next/head';
import { motion } from 'framer-motion';

interface Logo {
    id: number;
    name: string;
    imageUrl: string;
    createdAt: string;
}

// Mock data for user's logos
const initialLogos: Logo[] = [
    {
        id: 1,
        name: 'Logo 1',
        imageUrl: '/logo1.png',
        createdAt: '2023-10-01'
    },
];

const MyLogosPage = () => {
    const [logos, setLogos] = useState<Logo[]>(initialLogos);
    const [notification, setNotification] = useState({ message: '', type: 'success' });

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: 'success' }), 3000);
    };

    const handleDownload = (imageUrl: string) => {
        // This is a mock function. In a real app, you would trigger a download.
        console.log('Downloading:', imageUrl);
        showNotification('Download started.');
    };

    const handleDelete = async (logoId: number) => {
        const originalLogos = [...logos];
        // Optimistically update the UI
        setLogos(logos.filter(logo => logo.id !== logoId));

        try {
            const response = await fetch('/api/logos/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logoId }),
            });

            if (!response.ok) {
                // If the API call fails, revert the UI change
                setLogos(originalLogos);
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete logo.');
            }
            
            showNotification('Logo deleted successfully.');

        } catch (error: any) {
            console.error(error);
            showNotification(error.message, 'error');
            // Revert UI change on error
            setLogos(originalLogos);
        }
    };

    return (
        <AccountLayout>
            <Head>
                <title>My Logos - OtLog</title>
            </Head>
            {notification.message && (
                 <div className={`fixed top-5 right-5 text-white p-3 rounded-lg shadow-lg z-50 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {notification.message}
                </div>
            )}
            <div className="p-4 sm:p-8">
                <h1 className="text-3xl font-bold text-brand-text mb-6">My Logos</h1>
                {logos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {logos.map((logo) => (
                            <motion.div 
                                key={logo.id}
                                className="bg-brand-secondary rounded-lg overflow-hidden shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-brand-text">{logo.name}</h3>
                                    <p className="text-sm text-gray-400">Created: {logo.createdAt}</p>
                                </div>
                                <div className="p-4 bg-gray-700 flex justify-around">
                                    <button onClick={() => handleDownload(logo.imageUrl)} className="text-white hover:text-green-400 transition-colors">Download</button>
                                    <button onClick={() => handleDelete(logo.id)} className="text-white hover:text-red-400 transition-colors">Delete</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-lg text-gray-400">You haven't created any logos yet.</p>
                    </div>
                )}
            </div>
        </AccountLayout>
    );
};

export default MyLogosPage;
