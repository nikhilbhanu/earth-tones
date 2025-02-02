import { useEffect, useCallback } from 'react';
import audioManager from '../audio/AudioManager';

export function useAudioManager() {
  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      audioManager.stop();
    };
  }, []);

  const scheduleEvent = useCallback((callback, time, params = {}) => {
    audioManager.scheduleEvent(callback, time, params);
  }, []);

  const setTempo = useCallback((tempo) => {
    audioManager.setTempo(tempo);
  }, []);

  const start = useCallback(() => {
    audioManager.start();
  }, []);

  const stop = useCallback(() => {
    audioManager.stop();
  }, []);

  return {
    audioContext: audioManager.audioContext,
    analyserNode: audioManager.getAnalyserNode(),
    scheduleEvent,
    setTempo,
    start,
    stop,
    getCurrentTime: audioManager.getCurrentTime.bind(audioManager)
  };
}
