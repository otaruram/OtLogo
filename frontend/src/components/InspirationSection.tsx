import Image from 'next/image';
import { motion } from 'framer-motion';

const inspirationLogos = [
  { src: '/inspiration/7.png', prompt: 'A serene illustration of a traditional village house nestled in a calm landscape.' },
  { src: '/inspiration/4.png', prompt: 'A geometric line art of mountains at sunrise, suggesting adventure and new beginnings.' },
  { src: '/inspiration/2.png', prompt: 'A stylized, powerful ocean wave in the Japanese ukiyo-e style, representing nature\'s force.' },
  { src: '/inspiration/6.png', prompt: 'A retro-style rocket soaring through a star-filled cosmos, evoking a sense of exploration.' },
  { src: '/inspiration/5.png', prompt: 'A neon-lit circuit board in the shape of a human brain, illustrating the fusion of technology and intellect.' },
  { src: '/inspiration/8.png', prompt: 'A clever and impossible triangular optical illusion, representing innovation and out-of-the-box thinking.' },
  { src: '/inspiration/1.png', prompt: 'A majestic phoenix rising from the flames, symbolizing rebirth and power.' },
  { src: '/inspiration/3.png', prompt: 'A whimsical coffee cup containing a scenic mountain landscape, blending nature and comfort.' },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const InspirationSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-brand-text mb-4">
          Fuel Your Creativity
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Stuck for ideas? Browse these stunning logos created by our community and AI to get your inspiration flowing.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {inspirationLogos.map((logo, i) => (
            <motion.div
              key={logo.src}
              className="group relative p-4 bg-white rounded-lg border-2 border-brand-text shadow-hard overflow-hidden"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="relative aspect-square">
                <Image
                  src={logo.src}
                  alt={logo.prompt}
                  fill
                  className="rounded-md object-contain"
                />
              </div>
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-center font-bold">{logo.prompt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InspirationSection; 