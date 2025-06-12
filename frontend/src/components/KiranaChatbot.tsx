'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { useRouter } from 'next/router';

interface Message {
    id: number;
    sender: 'bot' | 'user';
    text: string;
    suggestions?: string[];
}

const KiranaChatbot = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', text: 'Halo! Aku Kirana, asisten digitalmu. Ada yang bisa dibantu?', suggestions: ["Apa itu OtLogo?", "Berapa harga paket?", "Bagaimana cara buat logo?"] }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, hasMounted]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim()) return;

        const userMessage: Message = { id: Date.now(), sender: 'user', text: messageText };

        setMessages(prev => {
            const newHistory = prev.map(m => {
                // Only modify bot messages that have suggestions
                if (m.sender === 'bot' && m.suggestions) {
                    return { ...m, suggestions: [] };
                }
                return m;
            });
            return [...newHistory, userMessage];
        });
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();

            const botMessage: Message = {
                id: Date.now() + 1,
                sender: 'bot',
                text: data.response,
                suggestions: data.suggestions,
            };
            setMessages(prev => [...prev, botMessage]);

            if (data.action && data.action.type === 'navigate') {
                router.push(data.action.payload);
                toggleChat(); // Close chat after navigating
            }
        } catch (error) {
            console.error('Gagal mengirim pesan:', error);
            const errorMessage: Message = { id: Date.now() + 1, sender: 'bot', text: 'Maaf, ada masalah. Coba lagi nanti.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };

    if (!hasMounted) {
        return null;
    }

    return (
        <>
            {/* Tombol Pemicu Chatbot */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChat}
                className="fixed bottom-5 right-5 z-50 w-24 h-24 rounded-full shadow-lg flex items-center justify-center bg-transparent"
                aria-label="Tanya Kirana"
            >
                <img src="/assets/1.png" alt="Kirana Chatbot" className="w-full h-full object-contain" />
            </motion.button>

            {/* Jendela Chatbot */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="fixed bottom-28 right-5 z-50 w-[350px] h-[500px] flex flex-col font-sans bg-white"
                        style={{
                            filter: 'drop-shadow(8px 8px 0px rgba(0,0,0,1))',
                            borderRadius: '15px',
                            border: '3px solid black'
                        }}
                    >
                        {/* Header Jendela */}
                        <div className="flex justify-between items-center p-3 text-black border-b-3 border-black" style={{ background: "url('/images/3.png')", borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                            <div className="flex items-center gap-3">
                                <img src="/assets/2.png" alt="Kirana Avatar" className="w-10 h-10 rounded-full border-2 border-black object-cover" />
                                <h3 className="font-bold text-xl" style={{ fontFamily: "'Gloria Hallelujah', cursive" }}>Kirana</h3>
                            </div>
                            <button onClick={toggleChat} className="transform hover:rotate-90 transition-transform duration-300">
                                <X size={28} style={{ strokeWidth: '4px', color: 'black' }} />
                            </button>
                        </div>
                        
                        {/* Area Percakapan */}
                        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto" style={{ background: "url('/images/4.png')" }}>
                            {messages.map((msg) => (
                                <div key={msg.id}>
                                    <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                                        {msg.sender === 'bot' && (
                                            <img src="/assets/2.png" alt="Kirana" className="w-8 h-8 rounded-full border border-black object-cover" />
                                        )}
                                        <div className={`p-3 rounded-lg max-w-[80%] text-black shadow-md ${msg.sender === 'user' ? 'bg-blue-200' : 'bg-white'}`} style={{ border: '1px solid black', borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px', wordWrap: 'break-word' }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                    {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4 ml-10">
                                            {msg.suggestions.map((suggestion, index) => (
                                                <button key={index} onClick={() => handleSendMessage(suggestion)} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-300 hover:bg-blue-200 transition-colors">
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-end gap-2 justify-start mb-4">
                                     <img src="/assets/2.png" alt="Kirana" className="w-8 h-8 rounded-full border border-black object-cover" />
                                     <div className="p-3 rounded-lg bg-white" style={{ border: '1px solid black', borderRadius: '20px 20px 20px 5px' }}>
                                        <div className="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                     </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Area Input Teks */}
                        <form onSubmit={handleFormSubmit} className="p-3 flex items-center gap-2 border-t-3 border-black" style={{ background: "url('/images/paper-texture-top.png')", borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Tanya sesuatu..." className="flex-grow p-2 bg-yellow-100 border-2 border-transparent focus:border-yellow-400 focus:outline-none rounded-md" style={{ background: "rgba(253, 230, 138, 0.5)"}}/>
                            <button type="submit" className="p-3 bg-transparent hover:scale-125 transition-transform" aria-label="Kirim Pesan">
                                <Send size={20} className="text-gray-600 -rotate-45" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 20px;
                }
                .typing-indicator span {
                    height: 8px;
                    width: 8px;
                    margin: 0 2px;
                    background-color: #9E9E9E;
                    border-radius: 50%;
                    display: inline-block;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
                
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
            `}</style>
        </>
    );
};

export default KiranaChatbot; 