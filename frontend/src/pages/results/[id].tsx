import Head from 'next/head';
import Header from '@/components/Header';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiDownload, FiSave, FiStar } from 'react-icons/fi';
import { useRouter } from 'next/router';
import prisma from '@/lib/prisma';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

const mainLogo = {
    imageUrl: "/images/logo-placeholder-1.png",
    prompt: "A cyberpunk wolf mascot, neon colors, vector style",
    seed: "123456789",
};

const variations = [
    { id: 1, imageUrl: "/images/logo-placeholder-2.png" },
    { id: 2, imageUrl: "/images/logo-placeholder-3.png" },
    { id: 3, imageUrl: "/images/logo-placeholder-4.png" },
];

const accentColors = ["#00A3FF", "#FF007A", "#39FF14", "#FFFFFF", "#111111"];

type ResultsPageProps = {
    prediction: {
        output: string[];
    } | null;
};

const ResultsPage = ({ prediction }: ResultsPageProps) => {
    if (!prediction) {
        return <div>Prediction not found.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Head>
                <title>Your Logo is Ready!</title>
            </Head>
            
            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold text-brand-text mb-4">Here's Your Brand New Logo!</h1>
                    <p className="text-xl text-gray-600 mb-12">Click on your favorite design to download, share, or view it in high resolution.</p>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Logo Display */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-white border-2 border-brand-text rounded-lg shadow-hard p-8 aspect-square flex items-center justify-center sticky top-28">
                                <Image src={mainLogo.imageUrl} alt={mainLogo.prompt} width={500} height={500} objectFit="contain" />
                            </div>
                        </div>

                        {/* Controls and Refinements */}
                        <div className="w-full lg:w-1/3">
                            <div className="space-y-8">
                                {/* Final Actions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <motion.button className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-neon text-white font-bold rounded-lg shadow-hard" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                        <FiDownload/> Download
                                    </motion.button>
                                    <motion.button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-brand-text font-bold rounded-lg shadow-hard" whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                                        <FiSave/> Save
                                    </motion.button>
                                </div>

                                {/* Variations */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Smart Variations</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {variations.map(v => (
                                            <div key={v.id} className="bg-gray-100 border-2 border-brand-text rounded-lg p-2 aspect-square cursor-pointer hover:border-brand-neon transition-colors">
                                                <div className="relative w-full h-full">
                                                    <Image src={v.imageUrl} alt={`Variation ${v.id}`} layout="fill" objectFit="contain" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                 {/* Super Light Editor */}
                                 <div>
                                    <h3 className="text-xl font-bold mb-4">Quick Edits</h3>
                                    <div className="space-y-4">
                                        <button className="w-full flex items-center gap-3 p-3 border-2 border-brand-text rounded-lg font-bold hover:bg-gray-50 transition-colors">
                                            <FiStar className="text-brand-neon"/> Remove Background
                                        </button>
                                        <div className="p-3 border-2 border-brand-text rounded-lg">
                                            <h4 className="font-bold mb-2 text-gray-700">Change Accent Color</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {accentColors.map(color => (
                                                    <motion.button key={color} style={{backgroundColor: color}} className="w-8 h-8 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-neon" whileHover={{scale: 1.1}}/>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Generation Info */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Generation Info</h3>
                                    <div className="p-4 bg-gray-100 border-2 border-gray-200 rounded-lg text-sm space-y-2 font-mono">
                                        <p><span className="font-bold">PROMPT:</span> {mainLogo.prompt}</p>
                                        <p><span className="font-bold">SEED:</span> {mainLogo.seed}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ResultsPage; 