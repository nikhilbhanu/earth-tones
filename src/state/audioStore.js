import { create } from 'zustand';
import { DEFAULT_SCALE } from '../audio/scales';
import { AudioCore } from '../audio/AudioCore';
import { AudioScheduler } from '../audio/AudioScheduler';
import { AudioSynth } from '../audio/AudioSynth';
import { Sequencer } from '../audio/Sequencer';

const useAudioStore = create((set, get) => {
    // Audio components will be initialized on demand
    let audioCore = null;
    let scheduler = null;
    let synth = null;
    let sequencer = null;

    return {
        // Initial state
        isLoading: false,
        error: null,
        isRunning: false,
        isInitialized: false,
        sequence: Array(16).fill(false),
        currentStep: 0,
        activeSphereNotes: [], // Array of {noteNumber: number, cents: number}
        masterVolume: 0.75, // Initial volume (0-1)

        // Initialize audio components
        initializeAudio: async () => {
            if (get().isInitialized) return;
            set({ isLoading: true, error: null });
            set({ isInitialized: true, isLoading: false });
        },

        // Volume control
        setMasterVolume: (volume) => {
            if (audioCore) {
                audioCore.setMasterVolume(volume);
                set({ masterVolume: volume });
            }
        },

        // Sequencer controls
        setSequence: (sequence) => {
            if (sequencer) {
                sequencer.setSequence(sequence);
                set({ sequence });
            }
        },

        toggleStep: (stepIndex) => {
            set((state) => {
                const newSequence = [...state.sequence];
                newSequence[stepIndex] = !newSequence[stepIndex];
                if (sequencer) {
                    sequencer.setSequence(newSequence);
                }
                return { sequence: newSequence };
            });
        },

        start: async () => {
            try {
                if (!get().isInitialized) {
                    await get().initializeAudio();
                }

                // Create audio components on first start (after user gesture)
                if (!audioCore) {
                    audioCore = new AudioCore();
                    scheduler = new AudioScheduler(audioCore);
                    synth = new AudioSynth(audioCore);
                    sequencer = new Sequencer(audioCore, scheduler, synth);

                    // Initialize audio core and sequencer
                    await audioCore.initialize();
                    await sequencer.initialize();

                    // Set up step change callback
                    sequencer.setStepChangeCallback((step) => {
                        set({ currentStep: step });
                    });
                }

                // Resume AudioContext (needed after user gesture)
                await audioCore.resume();
                await sequencer.start();
                set({ isRunning: true, error: null });
            } catch (error) {
                set({ error: 'Failed to start audio playback.' });
                // console.error('Audio start error:', error);
            }
        },

        stop: () => {
            try {
                if (sequencer) {
                    sequencer.stop();
                }
                set({ isRunning: false, currentStep: 0 });
            } catch (error) {
                set({ error: 'Failed to stop audio playback.' });
                // console.error('Audio stop error:', error);
            }
        },

        // Update synth parameters from audioParametersStore
        updateSynthParameters: (params) => {
            if (sequencer) {
                sequencer.setBpm(params.bpm);
                sequencer.updateSynthEnvelope({
                    attack: params.attack,
                    decay: params.decay,
                    sustain: params.sustain,
                    release: params.release
                });
            }
        },

        // Update active sphere notes
        setActiveSphereNotes: (notes) => {
            // Ensure each note has both noteNumber and cents properties
            const validatedNotes = notes.map(note =>
                typeof note === 'object' ? note : { noteNumber: note, cents: 0 }
            );
            set({ activeSphereNotes: validatedNotes });
        },

        // Cleanup
        dispose: () => {
            if (sequencer) {
                sequencer.dispose();
            }
            set({ isRunning: false });
        },

        // Error handling
        clearError: () => set({ error: null }),

        // Audio core access
        getAudioCore: () => audioCore
    };
});

export default useAudioStore;
