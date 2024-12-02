import { motion } from 'framer-motion';
import { useChristmasMode } from '../hooks/useChristmasMode';
import ChristmasTreeIcon from './ChristmasTreeIcon';
import '@/app/styles/christmas.css';

export default function Header() {
  const { isChristmas, toggleChristmas } = useChristmasMode();
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed w-full bg-black/50 backdrop-blur-md z-50"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-4"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            D&D AI Master
          </span>
        </motion.div>
        <nav className="flex items-center space-x-8">
          <ul className="flex space-x-8">
            <li>
              <a 
                href="#features" 
                onClick={(e) => scrollToSection(e, 'features')}
                className="text-white hover:text-purple-400 transition"
              >
                Features
              </a>
            </li>
            <li>
              <a 
                href="#Concept" 
                onClick={(e) => scrollToSection(e, 'demo')}
                className="text-white hover:text-purple-400 transition"
              >
                Concept
              </a>
            </li>
          </ul>
          <div className="flex items-center space-x-4">
            <motion.a
              href="https://github.com/amirarfan/MultiAgent_DnD_Bot"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-purple-400 transition"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </motion.a>
            <motion.button
              onClick={toggleChristmas}
              whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
              whileTap={{ scale: 0.95 }}
              className={`relative text-2xl transition-all duration-300 ease-in-out group ${isChristmas ? 'active' : ''}`}
            >
              <span className="relative z-10">
                <ChristmasTreeIcon />
              </span>
              {isChristmas && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-full blur-lg"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-green-500/0 hover:from-red-500/20 hover:to-green-500/20 rounded-full transition-all duration-300 blur-md" />
            </motion.button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}