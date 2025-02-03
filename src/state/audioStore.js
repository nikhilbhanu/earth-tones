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
        activeSphereNotes: [], // Array of {noteNumber: number, cents: number}
        masterVolume: 0.5, // Initial volume (0-1)

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
                    // Sync master volume from store
                    audioCore.setMasterVolume(get().masterVolume);
                    await sequencer.initialize();

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
                set({ isRunning: false });
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
            // Only update if notes actually changed
            const currentNotes = get().activeSphereNotes;
            if (currentNotes.length === notes.length &&
                currentNotes.every((note, i) =>
                    note.noteNumber === notes[i].noteNumber &&
                    note.cents === notes[i].cents
                )) {
                return;
            }

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
