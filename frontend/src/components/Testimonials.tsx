import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'Startup Founder',
    quote: "OtLogo is a game-changer! I got a professional logo in minutes without breaking the bank. The AI is incredibly intuitive.",
    avatar: "/assets/3.png",
  },
  {
    name: 'Mike R.',
    role: 'Freelance Designer',
    quote: "As a designer, I'm always looking for inspiration. OtLogo's generation capabilities are a fantastic starting point for my projects.",
    avatar: "/assets/4.png",
  },
  {
    name: 'Alex T.',
    role: 'E-commerce Store Owner',
    quote: "I needed a logo for my new online store and OtLogo delivered. The quality is amazing for the price. Highly recommended!",
    avatar: "/assets/5.png",
  },
   {
    name: 'Emily C.',
    role: 'Content Creator',
    quote: "I'm so impressed with the variety and creativity of the logos. It helped me create a unique brand identity for my channel.",
    avatar: "/assets/6.png",
  },
];

const TestimonialCard = ({ name, role, quote, avatar }: typeof testimonials[0]) => (
  <motion.div
    className="bg-white p-6 border-2 border-brand-text rounded-lg shadow-hard flex flex-col items-center text-center"
    whileHover={{ y: -5, boxShadow: "8px 8px 0px #1a1a1a" }}
  >
    <div className="relative w-24 h-24 mb-4">
        <Image src={avatar} fill alt={name} className="rounded-full border-2 border-brand-text object-cover" />
    </div>
    <div className="flex text-yellow-400 mb-2">
      {[...Array(5)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
    </div>
    <p className="text-gray-600 mb-4 flex-grow">"{quote}"</p>
    <div>
        <h3 className="font-bold text-lg text-brand-text">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
    </div>
  </motion.div>
);


const Testimonials = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-brand-text text-center mb-4">Loved by Creators & Entrepreneurs</h2>
        <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what some of our amazing users have to say about their experience with OtLogo.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 