'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatDemo from './components/ChatDemo';
import Features from './components/Features';
import DiceBackground from './components/DiceBackground';
import VideoPlayer from './components/VideoPlayer';

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black to-purple-900/80">
      <DiceBackground />
      <div className="relative z-10">
        <Header />
        
        <motion.div 
          ref={heroRef} 
          style={{ scale, opacity, y }} 
          className="pt-40 lg:pt-52 px-6 min-h-screen flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
                Powered by OpenAI GPT-4o & Swarm
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-center text-white mb-8 tracking-tight"
            >
              The Future of D&D is <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                AI-Powered
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
            >
              Experience a new era of tabletop gaming with our AI Dungeon Master. 
              Immersive storytelling, real-time voice narration, and dynamic image 
              generation bring your adventures to life like never before.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-16 max-w-5xl mx-auto"
            >
              <VideoPlayer 
                videoId="1025141034"
                onExpand={() => {
                  // Optional: Add any additional effects when video expands
                }}
                onMinimize={() => {
                  // Optional: Cleanup effects when video minimizes
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <section id="features" className="py-20">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Features</h2>
          <Features />
        </section>

        <section id="demo" className="py-20">
          <h2 className="text-4xl font-bold text-center text-white mb-8">The Concept</h2>
          <ChatDemo />
        </section>
      </div>
    </main>
  );
}