import { create } from 'zustand';
import audioManager from '../utils/audio/AudioManager';
import * as Tone from 'tone';
import { DEFAULT_SCALE } from '../constants/scales';

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

      // Initialize audio context and ensure it's running
      const context = await audioManager.initialize();
      await context.resume();

      // Initialize Tone.js with our audio context
      Tone.setContext(context);
      await Tone.start();

      // Create master gain node after context is ready
      const masterGain = context.createGain();
      masterGain.connect(audioManager.getAnalyserNode());
      masterGain.gain.value = 0.75; // Default to 75%

      // Create and connect synth after Tone.js is ready
      const synth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 0.1
        },
        context: context // Explicitly pass our context
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

  // Synth parameters
  attack: 0.005,
  decay: 0.1,
  sustain: 0.3,
  release: 0.1,

  // Audio parameters
  lookAheadMs: 15.0,
  scheduleAheadTime: 0.05,
  tempo: 120.0, // Default tempo in BPM
  cubeSamplingRate: 120, // Default cube sampling rate in BPM (synced with tempo)
  numberOfNotes: 1, // Default number of notes (1-4)
  scaleType: DEFAULT_SCALE, // Musical scale type
  baseFrequency: 261.63, // Base frequency in Hz (C4)
  octaveRange: 4, // Number of octaves to span
  curvature: 0.5, // Non-linear distribution factor (0-1)

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
    // Clamp rate between 30 BPM (0.5 Hz) and 300 BPM (5 Hz)
    const clampedRate = Math.max(30, Math.min(600, rate));
    set({ cubeSamplingRate: clampedRate });
  },

  setNumberOfNotes: (count) => {
    set({ numberOfNotes: count });
  },

  setScaleType: (scaleType) => {
    set({ scaleType });
  },

  setBaseFrequency: (freq) => {
    set({ baseFrequency: Math.max(20, Math.min(20000, freq)) }); // Clamp to audible range
  },

  setOctaveRange: (range) => {
    set({ octaveRange: Math.max(1, Math.min(8, range)) }); // Clamp between 1-8 octaves
  },

  setCurvature: (value) => {
    set({ curvature: Math.max(0, Math.min(1, value)) }); // Clamp between 0-1
  },

  // Synth envelope controls
  setAttack: (value) => {
    const clampedValue = Math.max(0.001, Math.min(2, value));
    set((state) => {
      if (state.synth) {
        state.synth.set({
          envelope: { attack: clampedValue }
        });
      }
      return { attack: clampedValue };
    });
  },

  setDecay: (value) => {
    const clampedValue = Math.max(0.001, Math.min(2, value));
    set((state) => {
      if (state.synth) {
        state.synth.set({
          envelope: { decay: clampedValue }
        });
      }
      return { decay: clampedValue };
    });
  },

  setSustain: (value) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    set((state) => {
      if (state.synth) {
        state.synth.set({
          envelope: { sustain: clampedValue }
        });
      }
      return { sustain: clampedValue };
    });
  },

  setRelease: (value) => {
    const clampedValue = Math.max(0.001, Math.min(2, value));
    set((state) => {
      if (state.synth) {
        state.synth.set({
          envelope: { release: clampedValue }
        });
      }
      return { release: clampedValue };
    });
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
