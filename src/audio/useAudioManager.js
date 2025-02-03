import { useEffect } from 'react';
import useAudioStore from '../state/audioStore';
import useAudioParametersStore from '../state/audioParametersStore';

export function useAudioManager() {
  const {
    initializeAudio,
    start,
    stop,
    setTempo,
    dispose,
    updateSynthParameters
  } = useAudioStore();

  const { attack, decay, sustain, release, bpm } = useAudioParametersStore();

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      stop();
      dispose();
    };
  }, []);

  // Update synth parameters when they change
  useEffect(() => {
    updateSynthParameters({
      attack,
      decay,
      sustain,
      release,
      bpm
    });
  }, [attack, decay, sustain, release, bpm, updateSynthParameters]);

  return {
    start,
    stop,
    setTempo
  };
}
