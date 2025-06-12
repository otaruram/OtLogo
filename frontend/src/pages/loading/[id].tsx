import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import type { Prediction } from '@prisma/client';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type LoadingPageProps = {
    predictionId: string;
};

const LoadingPage = ({ predictionId }: LoadingPageProps) => {
    const router = useRouter();
    const { id } = router.query;
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [status, setStatus] = useState<string>('starting');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const pollPrediction = async () => {
            let running = true;
            while (running) {
                try {
                    const res = await fetch(`/api/predictions/${id}`);
                    const data = await res.json();

                    if (res.status !== 200) {
                        setError(data.message || 'Failed to fetch prediction.');
                        running = false;
                        return;
                    }

                    setPrediction(data);
                    setStatus(data.status);

                    if (data.status === 'succeeded' || data.status === 'failed' || data.status === 'canceled') {
                        running = false;
                        if (data.status === 'succeeded') {
                            router.push(`/detail/${data.id}`);
                        } else {
                            setError(data.error || 'Prediction failed.');
                        }
                    } else {
                        await sleep(2000); // Poll every 2 seconds
                    }
                } catch (err) {
                    setError('An unexpected error occurred.');
                    running = false;
                }
            }
        };

        pollPrediction();

    }, [id, router]);

    return (
        <>
            <Head>
                <title>Generating Your Logo...</title>
                <meta name="description" content="Please wait while we generate your logo." />
            </Head>
            
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mt-8"
                ></motion.div>
                <p className="mt-4">Please wait, this can take a minute or two.</p>
            </div>
        </>
    );
};

export default LoadingPage; 