'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatDemo from './components/ChatDemo';
import Features from './components/Features';
import DragonBackground from './components/DragonBackground';

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black to-purple-900/80">
      <DragonBackground />
      <div className="relative z-10">
        <Header />
        
        <motion.div ref={heroRef} style={{ scale }} className="pt-32 px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-center text-white mb-8"
          >
            Introducing the D&D AI Dungeon Master
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-center text-gray-300 max-w-2xl mx-auto"
          >
            Experience a new era of Dungeons & Dragons with our AI-powered Discord bot. Using agentic LLMs, it simulates immersive roleplaying sessions, complete with real-time voice synthesis and image generation capabilities.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src="https://player.vimeo.com/video/1025141034?autoplay=0&loop=1&title=0&byline=0&portrait=0"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>

        <section id="features" className="py-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Features</h2>
          <Features />
        </section>

        <section id="demo" className="py-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">The Concept</h2>
          <ChatDemo />
        </section>
      </div>
    </main>
  );
}