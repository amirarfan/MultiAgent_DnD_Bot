import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Player from '@vimeo/player';

interface VideoPlayerProps {
  videoId: string;
  onExpand?: () => void;
  onMinimize?: () => void;
}

export default function VideoPlayer({ videoId, onExpand, onMinimize }: VideoPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef<Player | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (!iframeRef.current) return;

    playerRef.current = new Player(iframeRef.current);

    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isExpanded) {
        const scrollThreshold = 50;
        if (window.scrollY > scrollThreshold) {
          handleMinimize();
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isExpanded && event.key === 'Escape') {
        handleMinimize();
      }
    };

    if (isExpanded) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isExpanded]);

  const handleExpand = async () => {
    scrollPositionRef.current = window.scrollY;

    await new Promise<void>((resolve) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      setTimeout(resolve, 400);
    });

    await new Promise(resolve => setTimeout(resolve, 10));

    requestAnimationFrame(() => {
      setIsExpanded(true);
      onExpand?.();
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    if (playerRef.current) {
      try {
        await playerRef.current.play();
      } catch (error) {
        console.error('Failed to play video:', error);
      }
    }
  };

  const handleMinimize = async () => {
    if (playerRef.current) {
      try {
        await playerRef.current.pause();
      } catch (error) {
        console.error('Failed to pause video:', error);
      }
    }
    
    setIsExpanded(false);
    onMinimize?.();

    window.scrollTo({
      top: scrollPositionRef.current,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`video-player-container relative ${isExpanded ? 'fixed inset-0 z-100' : ''}`}>
      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-100" 
          onClick={handleMinimize}
        />
      )}
      
      <motion.div 
        ref={isExpanded ? expandedContainerRef : containerRef}
        layout
        transition={{
          layout: { duration: 0.5, ease: 'anticipate' }
        }}
        className={`
          ${isExpanded 
            ? 'fixed inset-0 z-110 flex items-center justify-center p-4 md:p-8 mt-16' 
            : 'relative w-full'
          }
        `}
        onClick={isExpanded ? handleMinimize : undefined}
      >
        <motion.div 
          layout
          transition={{
            layout: { duration: 0.5, ease: 'anticipate' }
          }}
          className={`
            ${isExpanded 
              ? 'w-full max-w-[85vw] aspect-video' 
              : 'relative pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-black/95'
            }
            group
          `}
          onClick={(e) => isExpanded && e.stopPropagation()}
        >
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${videoId}?loop=1&title=0&byline=0&portrait=0`}
            className={`
              ${isExpanded 
                ? 'w-full h-full rounded-xl' 
                : 'absolute top-0 left-0 w-full h-full'
              }
            `}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
          
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:opacity-90 transition-opacity duration-300"
            >
              <motion.button
                onClick={handleExpand}
                className="play-button absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg overflow-hidden group-hover:bg-white/15 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 via-purple-400/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <svg
                      className="w-10 h-10 text-white relative z-10 transform translate-x-0.5 group-hover:scale-110 transition-transform duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}