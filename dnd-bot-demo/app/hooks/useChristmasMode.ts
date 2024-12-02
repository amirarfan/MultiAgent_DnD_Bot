import { useState, useCallback, useEffect } from 'react';
import { audioService } from '../services/audioService';

export function useChristmasMode() {
  const [isChristmas, setIsChristmas] = useState(false);

  useEffect(() => {
    audioService.initializeChristmasAudio();
    
    return () => {
      audioService.cleanup();
    };
  }, []);

  const toggleChristmas = useCallback(() => {
    setIsChristmas(!isChristmas);
    document.body.classList.toggle('christmas-mode');

    if (!isChristmas) {
      audioService.play().catch(error => {
        console.error('Audio playback failed:', error);
      });
    } else {
      audioService.pause();
    }
  }, [isChristmas]);

  return {
    isChristmas,
    toggleChristmas
  };
}
