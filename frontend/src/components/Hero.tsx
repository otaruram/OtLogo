import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Hero = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // Determine the correct link based on authentication status
  const ctaLink = isAuthenticated ? '/config' : '/login';

  return (
    <section className="text-center py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          YOUR VISUAL IDENTITY.
          <br />
          <span className="text-brand-neon">CREATED IN SECONDS.</span>
        </motion.h1>
        <motion.p
          className="mt-6 max-w-2xl mx-auto text-lg text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          OtLogo is more than a logo maker. We are your AI creative partner, helping you translate ideas into an unforgettable visual identity. Forget complex and expensive design processes. Here, your imagination is the only limit.
        </motion.p>
        <div className="mt-12">
            <Link href={ctaLink} legacyBehavior passHref>
                <motion.a
                    className="inline-block px-16 py-5 bg-brand-neon text-white text-2xl font-extrabold rounded-lg shadow-hard hover:shadow-none transition-shadow"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                >
                    START CREATING NOW
                </motion.a>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero; 