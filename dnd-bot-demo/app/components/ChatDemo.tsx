import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Message from './Message';
import Image from 'next/image';

export default function ChatDemo() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
    initialInView: false
  });
  const scrollRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  const conversation = [
    { 
      content: "!start", 
      isBot: false 
    },
    { 
      content: "Welcome brave adventurers! You find yourselves at the entrance of The Caverns of Chaos. The ancient stone archway looms before you, covered in mysterious runes that pulse with a faint blue light. What would you like to do?", 
      isBot: true,
      reactions: ["🔊"] // Speaker emoji for TTS
    },
    { 
      content: "Can you show me what it looks like?", 
      isBot: false 
    },
    {
      content: "The massive stone archway towers before you, its surface etched with glowing blue runes that seem to pulse with ancient magic. Thick vines crawl up the weathered stone, and a cool mist seeps from the dark entrance.",
      isBot: true,
      reactions: ["🔥"] // Fire emoji for image generation
    },
    {
      content: (
        <div className="space-y-4">
          <p>*Generating image based on description...*</p>
          <div className="relative w-full h-64">
            <Image 
              src="/dnd_scene.png" 
              alt="Dungeon Entrance" 
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      ),
      isBot: true
    },
    { 
      content: "I want to check for traps before we enter", 
      isBot: false 
    },
    { 
      content: (
        <div className="space-y-2">
          <p className="text-yellow-300 italic">🎲 Rolling 1d20 + 2 for Investigation check...</p>
          <p className="text-green-300">[15] + 2 = 17</p>
          <p>Your careful inspection reveals a thin tripwire near the entrance, cleverly concealed among the debris. The mechanism appears to be connected to a series of crossbows mounted in the walls. Good catch! Would you like to attempt to disarm it?</p>
        </div>
      ), 
      isBot: true,
      reactions: ["🔊"] // Speaker emoji for TTS
    },
    {
      content: "Yes, I'll try to disarm it carefully",
      isBot: false
    },
    {
      content: (
        <div className="space-y-2">
          <p className="text-yellow-300 italic">🎲 Rolling 1d20 + 3 for Sleight of Hand...</p>
          <p className="text-green-300">[18] + 3 = 21</p>
          <p>With steady hands and precise movements, you successfully disarm the trap! The crossbow mechanisms retract into the walls with a satisfying click. The path ahead is now safe for the party to proceed.</p>
        </div>
      ),
      isBot: true,
      reactions: ["🔊"] // Speaker emoji for TTS
    }
  ];

  useEffect(() => {
    if (inView && currentMessageIndex === -1) {
      setCurrentMessageIndex(0);
    }
  }, [inView, currentMessageIndex]);

  useEffect(() => {
    if (!inView || currentMessageIndex === -1) return;

    const timer = setInterval(() => {
      if (currentMessageIndex < conversation.length - 1) {
        setCurrentMessageIndex(prev => prev + 1);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [currentMessageIndex, inView, conversation.length]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const scrollContainer = scrollContainerRef.current as HTMLDivElement;

    // Get the current scroll position
    const { scrollHeight, scrollTop, clientHeight } = scrollContainer;
    const isScrolledToBottom = scrollHeight - scrollTop - clientHeight <= 150;

    // Only auto-scroll if:
    // 1. User was already at the bottom
    // 2. This is the first message (currentMessageIndex === 0)
    if (isScrolledToBottom || currentMessageIndex === 0) {
      // Use requestAnimationFrame to ensure smooth scrolling after render
      requestAnimationFrame(() => {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  }, [currentMessageIndex]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      transition={{ duration: 0.6 }}
      className="bg-[#313338] rounded-xl p-6 max-w-2xl mx-auto my-18 shadow-2xl"
    >
      <div className="bg-[#2B2D31] p-2 rounded-t-xl mb-4 flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-400 text-sm ml-2"># dnd-campaign</span>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="space-y-4 h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
      >
        {conversation.slice(0, currentMessageIndex + 1).map((msg, i) => (
          <Message
            key={i}
            content={msg.content}
            isBot={msg.isBot}
            delay={0.3}
            reactions={msg.reactions}
            timestamp={new Date(Date.now() + i * 2000).toLocaleTimeString()}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-6 p-4 bg-[#2B2D31] rounded-lg">
        <p className="text-sm text-gray-400">
          💡 Tip: React with 🔥 to generate images and 🔊 to hear narration
        </p>
      </div>
    </motion.div>
  );
}