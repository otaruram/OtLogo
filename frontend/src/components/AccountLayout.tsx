import { ReactNode } from 'react';
import { motion } from 'framer-motion';

const AccountLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="bg-gray-50 flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-16">
                <div className="lg:flex lg:justify-center">
                    <div className="lg:w-3/4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountLayout; 