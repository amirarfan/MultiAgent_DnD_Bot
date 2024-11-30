import { motion } from 'framer-motion';

export default function Header() {
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
          className="text-2xl font-bold text-white"
        >
          D&D AI Master
        </motion.div>
        <nav>
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
        </nav>
      </div>
    </motion.header>
  );
}