'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const heroContent = {
  title: "Where Tradition Meets Modern Elegance",
  description: "Experience the exciting fusion of contemporary fashion with rich African heritage. Each piece tells a story of culture and innovation.",
  buttons: [
    {
      text: "Explore Collections",
      href: "/collections",
      primary: true
    },
    {
      text: "Learn More",
      href: "/about",
      primary: false
    }
  ]
};

export default function AnimatedHero() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <section className="relative h-screen hero-pattern">
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-playfair text-5xl md:text-7xl font-bold leading-tight"
            >
              {heroContent.title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600"
            >
              {heroContent.description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {heroContent.buttons.map((button, index) => (
                <motion.div
                  key={button.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={button.href}
                    className={`
                      inline-block px-8 py-3 rounded-full transition-colors duration-300
                      ${button.primary
                        ? "bg-black text-white hover:bg-[rgb(200,162,84)]"
                        : "border border-black hover:bg-black hover:text-white"
                      }
                    `}
                  >
                    {button.text}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block relative h-[600px]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute inset-0 bg-[rgb(200,162,84)]/10 rounded-lg"
            />
            <Image
              src="/ejiji1.png"
              alt="Ejiji Kobi Fashion"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 