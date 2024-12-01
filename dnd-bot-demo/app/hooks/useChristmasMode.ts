import { useState, useCallback } from 'react';

export function useChristmasMode() {
  const [isChristmas, setIsChristmas] = useState(false);

  const toggleChristmas = useCallback(() => {
    setIsChristmas(!isChristmas);
    document.body.classList.toggle('christmas-mode');
  }, [isChristmas]);

  return {
    isChristmas,
    toggleChristmas
  };
}
