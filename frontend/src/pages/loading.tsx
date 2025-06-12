import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const rotatingTexts = [
    "Analyzing your prompt...",
    "Engaging neural networks...",
    "Synthesizing pixels...",
    "Adding a touch of neon...",
    "Perfecting the details...",
    "Almost there...",
];

const LoadingAnimation = () => (
    <div className="w-48 h-48">
        <motion.div
            className="w-full h-full border-4 border-brand-neon rounded-lg"
            animate={{
                scale: [1, 1.2, 1.2, 1, 1],
                rotate: [0, 0, 270, 270, 0],
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{
                duration: 2.5,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 1
            }}
        />
    </div>
);

const LoadingPage = () => {
    const router = useRouter();
    const { resultId } = router.query;

    useEffect(() => {
        if (!resultId) {
            // If no resultId is provided, maybe redirect to home or config page after a bit
            const timeout = setTimeout(() => {
                router.push('/config');
            }, 2000);
            return () => clearTimeout(timeout);
        }
        
        // This timeout simulates the backend processing time we set in the mock API.
        // In a real app, you would poll a status endpoint here.
        const timer = setTimeout(() => {
            router.push(`/results/${resultId}`);
        }, 10500); // Slightly longer than the mock API delay

        return () => clearTimeout(timer);
    }, [resultId, router]);

    return (
        <>
            <Head>
                <title>Generating Your Logo...</title>
            </Head>
            <div className="min-h-screen bg-brand-text text-white flex flex-col items-center justify-center">
                <LoadingAnimation />
                <motion.p 
                    className="mt-8 text-xl font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {rotatingTexts[Math.floor(Math.random() * rotatingTexts.length)]}
                </motion.p>
            </div>
        </>
    );
};

export default LoadingPage; 