import { useState, FormEvent } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiZap, FiDownload, FiSave, FiStar, FiTrash2, FiLoader } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import { useCredits } from '@/contexts/CreditsContext';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface Prediction {
    id: string;
    status: 'starting' | 'processing' | 'succeeded' | 'failed';
    input: {
        prompt: string;
        seed?: number;
    };
    output?: string[];
    error?: string;
    created_at: string;
}

const GenerationResultPanel = ({ prediction, onSave, isSaving, onRemoveBackground, isRemovingBg, onGenerateVariation }: { 
    prediction: Prediction, 
    onSave: () => void, 
    isSaving: boolean, 
    onRemoveBackground: () => void,
    isRemovingBg: boolean,
    onGenerateVariation: (index: number) => void,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <button onClick={onSave} disabled={isSaving} className="w-full flex items-center justify-center py-3 bg-white border-2 border-brand-text font-bold rounded-lg shadow-hard hover:shadow-none transition-all disabled:opacity-50">
                {isSaving ? <FiLoader className="mr-2 animate-spin" /> : <FiSave className="mr-2" />}
                {isSaving ? 'Saving...' : 'Save to My Logos'}
            </button>
            <div>
                <h3 className="text-lg font-bold text-brand-text mb-2">Smart Variations</h3>
                <div className="grid grid-cols-3 gap-2">
                    {Array(3).fill(0).map((_, i) => (
                        <button key={i} onClick={() => onGenerateVariation(i)} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-brand-neon hover:text-brand-neon transition-colors">
                            <FiStar/>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-brand-text mb-2">Quick Edits</h3>
                <button onClick={onRemoveBackground} disabled={isRemovingBg} className="w-full flex items-center justify-center py-3 bg-white border-2 border-brand-text font-bold rounded-lg shadow-hard hover:shadow-none transition-all disabled:opacity-50">
                    {isRemovingBg ? <FiLoader className="mr-2 animate-spin" /> : <FiTrash2 className="mr-2" />}
                    {isRemovingBg ? 'Removing...' : 'Remove Background'}
                </button>
            </div>
        </motion.div>
    );
};


const ConfigPage = () => {
    const { data: session } = useSession();
    const { fetchCredits } = useCredits();

    const [prompt, setPrompt] = useState('A cyberpunk wolf mascot, neon colors');
    const [textOnLogo, setTextOnLogo] = useState('OtLogo');
    const [color, setColor] = useState('');
    const [style, setStyle] = useState('');
    
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isRemovingBg, setIsRemovingBg] = useState(false);

    const triggerDownload = async (imageUrl: string, prompt: string) => {
        toast.loading('Preparing download...');
        try {
            const response = await fetch(`/api/download-image?url=${encodeURIComponent(imageUrl)}`);
            if (!response.ok) throw new Error('Failed to fetch image for download.');
            
            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.download = `${prompt.replace(/ /g, '_').slice(0, 30)}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(objectUrl);
            toast.dismiss();
            toast.success('Download started!');
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || 'Could not download the image.');
            console.error(error);
        }
    };

    const handleGenerate = async (e: FormEvent) => {
        e.preventDefault();
        if (!prompt) {
            toast.error("Please enter a prompt.");
            return;
        }

        setLoading(true);
        setError(null);
        setPrediction(null);
        
        // Construct the prompt
        let fullPrompt = prompt;
        if (textOnLogo) fullPrompt += `, with text "${textOnLogo}"`;
        if (color) fullPrompt += `, color palette: ${color}`;
        if (style) fullPrompt += `, style: ${style}`;

        try {
            const response = await fetch('/api/predictions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: fullPrompt }),
            });

            let newPrediction = await response.json();
            if (response.status !== 201) {
                throw new Error(newPrediction.detail || "Failed to start generation.");
            }
            setPrediction(newPrediction);

            while (newPrediction.status !== 'succeeded' && newPrediction.status !== 'failed') {
                await sleep(1500);
                const pollResponse = await fetch('/api/predictions/' + newPrediction.id);
                newPrediction = await pollResponse.json();
                
                if (pollResponse.status !== 200) {
                     throw new Error(newPrediction.detail || "Failed to poll prediction.");
                }

                setPrediction(newPrediction);
                
                if (newPrediction.status === 'succeeded' || newPrediction.status === 'failed') {
                    await fetchCredits();
                    if(newPrediction.status === 'succeeded') {
                        toast.success("Logo generated successfully!");
                        if (newPrediction.output?.[0]) {
                            await triggerDownload(newPrediction.output[0], newPrediction.input.prompt);
                        }
                    } else {
                        throw new Error(newPrediction.error || "Generation failed.");
                    }
                    break;
                }
            }
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSave = async () => {
        if (!prediction || !prediction.output?.[0]) {
            toast.error("No image to save.");
            return;
        }

        setIsSaving(true);
        toast.loading("Saving to 'My Logos'...");

        try {
            const response = await fetch('/api/logos/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    predictionId: prediction.id,
                    prompt: prediction.input.prompt,
                    imageUrl: prediction.output[0],
                }),
            });

            if (response.status === 409) {
                 toast.dismiss();
                 toast.error("This logo has already been saved.");
                 return;
            }

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save logo.');
            }
            
            toast.dismiss();
            toast.success("Saved to 'My Logos'!");

        } catch (error: any) {
            toast.dismiss();
            toast.error(error.message || "Could not save logo.");
        } finally {
            setIsSaving(false);
        }
    };
    
    // Placeholder function
    const handleRemoveBackground = async () => {
        toast.error("This feature is coming soon!");
    };
    
    // Placeholder function
    const handleGenerateVariation = async (index: number) => {
        toast.error("This feature is coming soon!");
    }

    return (
        <div className="flex flex-col flex-grow bg-gray-50">
            <Head>
                <title>Generate Logo - OtLogo</title>
            </Head>
            <Toaster position="bottom-center" />

            <main className="flex-grow container mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Panel: Controls */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleGenerate} className="bg-white border-2 border-brand-text rounded-lg shadow-hard p-6 sticky top-28">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-bold text-brand-text mb-2">PROMPT</label>
                                <textarea rows={4} className="w-full p-3 border-2 border-brand-text rounded-lg focus:outline-none focus:border-brand-neon font-medium" placeholder="A cyberpunk wolf mascot, neon colors..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                            </div>
                            <div>
                                <button type="button" onClick={() => setIsAdvancedOpen(!isAdvancedOpen)} className="flex items-center justify-between w-full font-bold text-lg">
                                    Advanced Options
                                    <FiChevronDown className={`transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isAdvancedOpen && (
                                        <motion.div className="pt-4 space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Text on Logo</label>
                                                <input type="text" placeholder="e.g., 'OtLogo'" className="w-full p-3 border-2 border-brand-text rounded-lg focus:outline-none focus:border-brand-neon" value={textOnLogo} onChange={(e) => setTextOnLogo(e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Color Palette</label>
                                                <input type="text" placeholder="e.g., 'deep sea blue' or 'gold and black'" className="w-full p-3 border-2 border-brand-text rounded-lg focus:outline-none focus:border-brand-neon" value={color} onChange={(e) => setColor(e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Design Style</label>
                                                <input type="text" placeholder="e.g., 'Minimalist', '80s Retro'" className="w-full p-3 border-2 border-brand-text rounded-lg focus:outline-none focus:border-brand-neon" value={style} onChange={(e) => setStyle(e.target.value)} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div className="mt-8">
                            <motion.button type="submit" disabled={loading} className="w-full flex items-center justify-center py-4 bg-brand-neon text-white rounded-lg shadow-hard hover:shadow-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {loading ? <FiLoader className="mr-3 text-2xl animate-spin" /> : <FiZap className="mr-3 text-2xl" />}
                                <span className="font-extrabold text-xl">{loading ? 'GENERATING...' : 'GENERATE'}</span>
                            </motion.button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </form>
                </div>

                {/* Right Panel: Results */}
                <div className="lg:col-span-2">
                    <div className="bg-white border-2 border-brand-text rounded-lg shadow-hard p-6 sticky top-28">
                        <AnimatePresence mode="wait">
                            {loading && (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-96 text-center">
                                    <FiLoader className="text-4xl text-brand-neon animate-spin" />
                                    <p className="mt-4 font-bold text-lg text-brand-text">Generating your masterpiece...</p>
                                    <p className="text-gray-500">This can take a moment.</p>
                                </motion.div>
                            )}

                            {error && (
                                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-96 text-center">
                                    <FiZap className="text-4xl text-red-500" />
                                    <p className="mt-4 font-bold text-lg text-red-500">Generation Failed</p>
                                    <p className="text-gray-500">{error}</p>
                                </motion.div>
                            )}

                            {prediction?.status === 'succeeded' && prediction.output && (
                                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                        <img src={prediction.output[0]} alt="Generated logo" className="w-full h-full object-cover" />
                                    </div>
                                    <GenerationResultPanel 
                                        prediction={prediction}
                                        onSave={handleSave}
                                        isSaving={isSaving}
                                        onRemoveBackground={handleRemoveBackground}
                                        isRemovingBg={isRemovingBg}
                                        onGenerateVariation={handleGenerateVariation}
                                    />
                                </motion.div>
                            )}
                            
                            {!loading && !error && !prediction && (
                                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-96 text-center">
                                    <FiStar className="text-4xl text-gray-300" />
                                    <p className="mt-4 font-bold text-lg text-gray-400">Your generated logo will appear here.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConfigPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/login?callbackUrl=/config',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};
