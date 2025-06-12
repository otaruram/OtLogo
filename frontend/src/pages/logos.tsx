import Head from 'next/head';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiDownload, FiShare2, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';

// Dummy data for logos - replace with actual data
const logos = [
    { id: 1, prompt: "Cyberpunk wolf mascot", date: "June 07, 2025", imageUrl: "/images/logo-placeholder-1.png" },
    { id: 2, prompt: "Minimalist mountain range", date: "June 06, 2025", imageUrl: "/images/logo-placeholder-2.png" },
    { id: 3, prompt: "Vintage coffee shop emblem", date: "June 05, 2025", imageUrl: "/images/logo-placeholder-3.png" },
    { id: 4, prompt: "Abstract tech startup icon", date: "June 04, 2025", imageUrl: "/images/logo-placeholder-4.png" },
];

const LogosPage = () => {
    const hasLogos = logos.length > 0;

    return (
        <>
            <Head>
                <title>My Logos - OtLogo</title>
                <meta name="description" content="Your personal gallery of generated logos." />
            </Head>
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-5xl font-extrabold text-brand-text mb-8 text-center">My Logos</h1>
                
                {hasLogos ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {logos.map(logo => (
                            <motion.div
                                key={logo.id}
                                className="group relative bg-white border-2 border-brand-text rounded-lg p-4 transition-all duration-300 hover:border-brand-neon hover:shadow-hard-lg"
                                whileHover={{ y: -5 }}
                            >
                                <div className="relative w-full aspect-square mb-4 rounded-md overflow-hidden">
                                    <Image src={logo.imageUrl} alt={logo.prompt} layout="fill" objectFit="cover" />
                                </div>
                                <h3 className="font-bold text-lg truncate">{logo.prompt}</h3>
                                <p className="text-sm text-gray-500">Created {logo.date}</p>

                                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white rounded-full text-brand-text hover:text-brand-neon shadow-md"><FiDownload /></button>
                                    <button className="p-2 bg-white rounded-full text-brand-text hover:text-brand-neon shadow-md"><FiShare2 /></button>
                                    <button className="p-2 bg-white rounded-full text-brand-text hover:text-brand-danger shadow-md"><FiTrash2 /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <h2 className="text-3xl font-bold text-brand-text mb-4">Your logo gallery is empty.</h2>
                        <p className="text-gray-600 mb-8">Let's create something amazing.</p>
                        <Link href="/generate" passHref>
                            <motion.a 
                                className="inline-block px-10 py-4 bg-brand-neon text-white font-extrabold rounded-lg shadow-hard hover:shadow-none transition-shadow"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start Designing
                            </motion.a>
                        </Link>
                    </div>
                )}
            </main>
        </>
    );
};

export default LogosPage; 