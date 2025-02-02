import { useEffect } from 'react';
import useAudioStore from '../state/audioStore';

export function useAudioManager() {
  const {
    initializeAudio,
    start,
    stop,
    setTempo,
    dispose
  } = useAudioStore();

  useEffect(() => {
    // Initialize audio when hook is first used
    initializeAudio().catch(console.error);

    // Cleanup when component unmounts
    return () => {
      stop();
      dispose();
    };
  }, []);

  return {
    start,
    stop,
    setTempo
  };
}
