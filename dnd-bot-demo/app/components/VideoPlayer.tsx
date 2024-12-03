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

    // Smoothly scroll to top
    await new Promise<void>((resolve) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      setTimeout(resolve, 500);
    });

    setIsExpanded(true);
    onExpand?.();

    // Ensure the player is ready before playing
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
    <div className={`relative ${isExpanded ? 'fixed inset-0 z-100' : ''}`}>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-100" 
          onClick={handleMinimize}
        />
      )}
      
      <div 
        ref={isExpanded ? expandedContainerRef : containerRef}
        className={`
          ${isExpanded 
            ? 'fixed inset-0 z-110 flex items-center justify-center p-4 md:p-8 mt-16' 
            : 'relative w-full'
          }
        `}
        onClick={isExpanded ? handleMinimize : undefined}
      >
        <div 
          className={`
            ${isExpanded 
              ? 'w-full max-w-[85vw] aspect-video' 
              : 'relative pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-black/95'
            }
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
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleExpand}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
              >
                <svg
                  className="w-10 h-10 text-black ml-1 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}