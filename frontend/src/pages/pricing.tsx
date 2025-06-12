import { useState } from 'react';
import Head from 'next/head';
import { CheckCircle, Star, Zap, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGumroadPayment = async (credits: number, price: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gumroad/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits, amount: price }), // Corrected payload
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.purchaseUrl; // Use purchaseUrl from API response
      } else {
        throw new Error(data.message || 'Payment initiation failed.');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Could not initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pricingPackages = [
    {
      name: 'Starter',
      credits: 50,
      price: 5,
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      features: ['50 Logo Generations', 'Standard Resolution', 'Personal License'],
      isPopular: false,
      handler: () => handleGumroadPayment(50, 5),
    },
    {
      name: 'Creator',
      credits: 200,
      price: 15,
      icon: <Star className="w-8 h-8 text-blue-500" />,
      isPopular: true,
      features: ['200 Logo Generations', 'High Resolution', 'Commercial License', 'Vector Files (SVG)'],
      handler: () => handleGumroadPayment(200, 15),
    },
    {
      name: 'Pro',
      credits: 500,
      price: 30,
      icon: <Gem className="w-8 h-8 text-purple-500" />,
      features: ['500 Logo Generations', 'All Creator Features', 'Brand Kit', 'Priority Support'],
      isPopular: false,
      handler: () => handleGumroadPayment(500, 30),
    },
  ];

  return (
    <>
      <Head>
        <title>Pricing & Credits - OtLogo</title>
        <meta name="description" content="Unlock more creative potential. Choose a package that fits your needs and continue designing." />
      </Head>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-16 h-16 border-4 border-dashed border-white rounded-full"
            />
            <p className="ml-4 text-white text-xl">Mempersiapkan pembayaran...</p>
        </div>
      )}

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Get More Credits
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock more creative potential. Choose a package that fits your needs and continue designing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {pricingPackages.map((pkg) => (
            <motion.div 
              key={pkg.name}
              className={`border rounded-xl p-6 flex flex-col bg-white ${pkg.isPopular ? 'border-blue-500 border-2 shadow-xl' : 'border-gray-200 shadow-lg'}`}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {pkg.isPopular && <span className="text-xs font-bold bg-blue-500 text-white px-3 py-1 rounded-full self-center mb-4 -mt-10">POPULAR</span>}
              <div className="flex items-center gap-4 mb-4">
                {pkg.icon}
                <h2 className="text-2xl font-bold text-gray-800">{pkg.name}</h2>
              </div>
              <p className="text-5xl font-extrabold text-gray-900 mb-2">{pkg.credits} <span className="text-xl font-medium text-gray-500">Credits</span></p>
              <p className="text-2xl font-bold text-gray-700 mb-6">${pkg.price}</p>
              
              <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
                {pkg.features.map(feature => (
                  <li key={feature} className="flex items-start"><CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />{feature}</li>
                ))}
              </ul>
              
              <button
                onClick={pkg.handler}
                disabled={isLoading}
                className={`w-full text-center font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${pkg.isPopular ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
};

export default PricingPage; 