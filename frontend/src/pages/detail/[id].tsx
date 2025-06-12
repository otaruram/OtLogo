import Head from 'next/head';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import type { GetServerSideProps } from 'next';
import type { Prediction as DBPrediction } from '@prisma/client';
import { useState, useEffect } from 'react';

type Prediction = Omit<DBPrediction, "input" | "output"> & {
    input: { prompt?: string };
    output: string[];
}

type DetailPageProps = {
    prediction: Prediction | null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params || {};

    if (!id || typeof id !== 'string') {
        return { props: { prediction: null } };
    }

    const prediction = await prisma.prediction.findUnique({
        where: { id },
    });

    if (!prediction) {
        return { props: { prediction: null } };
    }

    return {
        props: {
            prediction: JSON.parse(JSON.stringify(prediction)),
        },
    };
};

const DetailPage = ({ prediction }: DetailPageProps) => {
    if (!prediction) {
        return (
            <>
                <Head><title>Logo Not Found</title></Head>
                <main className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold">Logo not found</h1>
                    <p className="text-gray-500 mt-4">The requested logo does not exist or could not be loaded.</p>
                </main>
            </>
        );
    }
    
    const [creationDate, setCreationDate] = useState('');

    useEffect(() => {
        if (prediction?.created_at) {
            setCreationDate(new Date(prediction.created_at).toLocaleString());
        }
    }, [prediction?.created_at]);
    
    const imageUrl = prediction.output && prediction.output[0] ? prediction.output[0] : '/placeholder-logo.svg';

    return (
        <>
            <Head>
                <title>Logo Details - {prediction.input.prompt || 'Untitled'}</title>
            </Head>
            
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <div className="relative w-full" style={{ paddingTop: '100%' }}>
                                    <Image
                                        src={imageUrl}
                                        alt={prediction.input.prompt || 'Generated logo'}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h1 className="text-2xl font-bold mb-6">Logo Details</h1>
                                
                                <div className="mb-6">
                                    <h2 className="font-semibold text-lg text-gray-800">Prompt</h2>
                                    <p className="text-gray-600 bg-gray-50 p-3 rounded-md mt-2 border border-gray-200">{prediction.input.prompt || 'No prompt provided'}</p>
                                </div>
                                
                                <div className="mb-8">
                                    <h2 className="font-semibold text-lg text-gray-800">Created</h2>
                                    <p className="text-gray-600 mt-2">{creationDate || '...'}</p>
                                </div>

                                <a href={imageUrl} download={`logo-${prediction.id}.png`} className="block w-full text-center py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300">
                                    Download Logo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default DetailPage; 