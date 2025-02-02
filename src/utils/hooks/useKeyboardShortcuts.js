import { useEffect } from 'react';
import useTransportStore from '../../stores/transportStore';

export const useKeyboardShortcuts = () => {
  const { togglePlay, stop } = useTransportStore();

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ignore key events if target is an input or textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          event.preventDefault();
          stop();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, stop]);
};
