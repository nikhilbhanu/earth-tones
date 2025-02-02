import { create } from 'zustand';
import audioManager from '../utils/audio/AudioManager';
import * as Tone from 'tone';

const useAudioStore = create((set, get) => ({
  // Audio context and nodes
  audioContext: null,
  analyserNode: null,
  masterGain: null,

  // State
  isLoading: false,
  error: null,
  isRunning: false,
  isInitialized: false,

  // Initialize audio context with error handling
  initializeAudio: async () => {
    // Only initialize if not already initialized
    if (get().isInitialized) return;

    try {
      set({ isLoading: true, error: null });

      // Initialize audio context and Tone.js
      await audioManager.initialize();
      await Tone.start();
      Tone.setContext(audioManager.audioContext);

      // Create master gain node
      const masterGain = audioManager.audioContext.createGain();
      masterGain.connect(audioManager.getAnalyserNode());
      masterGain.gain.value = 0.75; // Default to 75%

      // Create and connect synth through master gain with optimized settings
      const synth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 0.1
        }
      });
      synth.connect(masterGain);

      set({
        isLoading: false,
        isInitialized: true,
        audioContext: audioManager.audioContext,
        analyserNode: audioManager.analyserNode,
        masterGain,
        synth
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to initialize audio. Please check your browser permissions.'
      });
      console.error('Audio initialization error:', error);
    }
  },

  // Audio parameters
  lookAheadMs: 15.0,
  scheduleAheadTime: 0.05,
  tempo: 120.0, // Default tempo
  cubeSamplingRate: 30, // Default cube sampling rate in BPM
  numberOfNotes: 1, // Default number of notes (1-4)

  // Sequencer state
  sequence: Array(16).fill(false),
  currentStep: 0,

  // Synth instance - will be properly connected in initializeAudio
  synth: null,

  // Create synth sound
  createTestOscillator: (audioContext, time, params) => {
    // Convert Web Audio API time to Tone.js time
    const toneTime = Tone.now() + (time - audioContext.currentTime);

    // Convert MIDI note number to frequency
    const frequency = Tone.Frequency(params.noteNumber, "midi");

    // Scale velocity based on number of active notes (in dB)
    const numNotes = audioManager.activeSphereNotes.length;
    const velocityScale = Math.max(0.2, 1 / Math.sqrt(numNotes)); // Prevent going too quiet

    // Play a note with the PolySynth with scaled velocity
    get().synth.triggerAttackRelease(frequency, '32n', toneTime, velocityScale);

    console.log(`Note played at step ${params.step + 1}, note: ${params.noteNumber}, velocity: ${velocityScale.toFixed(2)}, time: ${time.toFixed(3)}`);
  },

  // Set master volume (0-1)
  setMasterVolume: (volume) => {
    if (get().masterGain) {
      get().masterGain.gain.value = volume;
    }
  },

  // Sequencer methods
  setSequence: (sequence) => {
    set({ sequence });
    audioManager.setSequence(sequence);
  },

  toggleStep: (stepIndex) => {
    set((state) => {
      const newSequence = [...state.sequence];
      newSequence[stepIndex] = !newSequence[stepIndex];
      audioManager.setSequence(newSequence);
      return { sequence: newSequence };
    });
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  // Methods that wrap AudioManager functionality
  start: async () => {
    try {
      // Initialize audio on first start
      if (!get().isInitialized) {
        await get().initializeAudio();
      }

      if (get().error) {
        await get().initializeAudio();
      }

      // Set the sequence in AudioManager
      audioManager.setSequence(get().sequence);

      // Set up step change callback
      audioManager.onStepChange = (step) => {
        set({ currentStep: step });
      };

      await audioManager.start(get().createTestOscillator);
      set({ isRunning: true, error: null });
    } catch (error) {
      set({ error: 'Failed to start audio playback.' });
      console.error('Audio start error:', error);
    }
  },

  stop: () => {
    try {
      audioManager.stop();
      audioManager.onStepChange = null;
      set({ isRunning: false, currentStep: 0 });
    } catch (error) {
      set({ error: 'Failed to stop audio playback.' });
      console.error('Audio stop error:', error);
    }
  },

  setTempo: (tempo) => {
    audioManager.setTempo(tempo);
    set({ tempo });
  },

  setCubeSamplingRate: (rate) => {
    set({ cubeSamplingRate: rate });
  },

  setNumberOfNotes: (count) => {
    set({ numberOfNotes: count });
  },

  scheduleEvent: (callback, time, params) => {
    audioManager.scheduleEvent(callback, time, params);
  },

  // Get timing verification data
  getTimingVerification: () => {
    return audioManager.getTimingVerification();
  },

  // Cleanup
  dispose: () => {
    if (get().synth) {
      get().synth.dispose();
    }
    if (get().masterGain) {
      get().masterGain.disconnect();
    }
    audioManager.dispose();
    set({ isRunning: false });
  },

  // Clear error state
  clearError: () => set({ error: null }),
}));

export default useAudioStore;
