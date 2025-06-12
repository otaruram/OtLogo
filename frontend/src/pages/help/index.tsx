import { useState } from 'react';
import AccountLayout from '@/components/AccountLayout';
import { FiSearch, FiBookOpen, FiLifeBuoy, FiMessageSquare, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { helpData } from '@/lib/help-articles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';

const categoryIcons: { [key: string]: React.ElementType } = {
    "Memulai Petualangan Anda": FiBookOpen,
    "Dojo Kreasi: Menguasai AI": FiLifeBuoy,
    "Markas Besar Digital Anda": FiMessageSquare,
    "Logistik & Keuangan": FiCreditCard,
    "Saat Mesin Sedikit Batuk": FiAlertCircle,
};

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');


const HelpPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = helpData.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.articles.some(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AccountLayout>
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-brand-text">Butuh Pencerahan?</h1>
                 <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
                    Anda Datang ke Tempat yang Tepat.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                    <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-2xl" />
                    <input
                        type="text"
                        placeholder="Ketik masalah Anda di sini... atau sekadar rasa penasaran Anda."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 pl-14 border-2 border-brand-text rounded-lg shadow-hard focus:outline-none focus:border-brand-neon font-bold text-lg"
                    />
                </div>
            </div>

            {/* Topic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {filteredData.map((category) => {
                    const Icon = categoryIcons[category.name] || FiBookOpen;
                    return (
                        <Link href={`/help/${slugify(category.name)}`} key={category.name} legacyBehavior>
                            <motion.a
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white border-2 border-brand-text rounded-lg shadow-hard p-6 flex flex-col items-center text-center cursor-pointer"
                            >
                                <Icon className="text-5xl text-brand-neon mb-4" />
                                <h3 className="text-xl font-bold text-brand-text">{category.name}</h3>
                                <p className="text-gray-500 mt-2">{category.description}</p>
                            </motion.a>
                        </Link>
                    )
                })}
            </div>
            
            {/* Contact Us */}
             <div className="text-center mt-16 p-8 bg-gray-50 border-2 border-dashed rounded-lg max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-brand-text">Can't find an answer?</h2>
                <p className="text-lg text-gray-600 mt-2">Our support team is just a message away.</p>
                <a 
                    href="https://wa.link/ud3y9p"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block px-8 py-3 bg-brand-neon text-white font-bold rounded-lg shadow-hard hover:shadow-none transition-shadow"
                >
                    Contact Support
                </a>
            </div>
        </AccountLayout>
    );
};

export default HelpPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
}); 