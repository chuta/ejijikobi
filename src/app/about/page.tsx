'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const values = [
    {
      title: 'Heritage',
      description: 'Celebrating and preserving African craftsmanship through modern fashion.',
      icon: '🏺'
    },
    {
      title: 'Innovation',
      description: 'Blending traditional techniques with contemporary design aesthetics.',
      icon: '💫'
    },
    {
      title: 'Sustainability',
      description: 'Committed to ethical production and environmental responsibility.',
      icon: '🌱'
    },
    {
      title: 'Community',
      description: 'Supporting local artisans and fostering cultural exchange.',
      icon: '🤝'
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-black text-white">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="/placeholder.jpg"
          alt="Ejiji Kobi Workshop"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1 
              className="text-5xl md:text-6xl font-playfair font-bold mb-4"
              {...fadeIn}
            >
              Our Story
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-200"
              {...fadeIn}
              transition={{ delay: 0.2 }}
            >
              Where African Heritage Meets Modern Fashion
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-playfair font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Ejiji Kobi, we&apos;re on a mission to redefine African fashion for the modern world. 
              Our journey began with a simple yet powerful idea: to create clothing that honors our 
              rich cultural heritage while embracing contemporary design sensibilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-playfair font-bold">Our Values</h2>
            <p className="mt-4 text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-white p-8 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-playfair font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-playfair font-bold mb-6">Our Journey</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in the heart of Nigeria, Ejiji Kobi emerged from a deep appreciation 
                  for African textiles and craftsmanship. Our founders, inspired by their 
                  travels across the continent, saw an opportunity to bridge the gap between 
                  traditional African fashion and contemporary global trends.
                </p>
                <p>
                  We work closely with local artisans, combining their expertise with modern 
                  design techniques to create pieces that are both timeless and innovative. 
                  Each garment tells a story of cultural heritage while embracing the future 
                  of fashion.
                </p>
                <p>
                  Today, we&apos;re proud to be at the forefront of modern African fashion, 
                  creating pieces that celebrate our heritage while pushing the boundaries 
                  of contemporary design.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="relative h-[600px] rounded-lg overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Image
                src="/placeholder.jpg"
                alt="Ejiji Kobi Journey"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-playfair font-bold mb-6">
              Join Us on Our Journey
            </h2>
            <p className="text-gray-300 mb-8">
              Experience the perfect blend of tradition and modernity with our latest collection.
            </p>
            <a
              href="/collections"
              className="inline-block bg-white text-black px-8 py-3 rounded-full hover:bg-[rgb(200,162,84)] hover:text-white transition-colors duration-300"
            >
              Explore Our Collections
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 