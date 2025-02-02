import * as Tone from 'tone';
import { AudioCore } from './AudioCore';

/**
 * Manages synthesis and audio routing.
 * Takes AudioCore as a dependency for audio context and routing.
 */
export class AudioSynth {
    constructor(audioCore) {
        this.audioCore = audioCore;
        this.synth = null;
        this.isInitialized = false;
    }

    /**
     * Initializes the synth with Tone.js
     */
    async initialize() {
        if (this.isInitialized) return;

        const context = this.audioCore.getContext();
        const masterGain = this.audioCore.getMasterGain();

        if (!context || !masterGain) {
            throw new Error('AudioCore not properly initialized');
        }

        // Initialize Tone.js with our context
        Tone.setContext(context);
        await Tone.start();

        // Create and configure synth
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.synth.set({
            envelope: {
                attack: 0.005,
                decay: 0.1,
                sustain: 0.3,
                release: 0.1
            }
        });

        // Connect to master gain
        this.synth.disconnect();
        this.synth.connect(masterGain);

        this.isInitialized = true;
    }

    /**
     * Triggers a note with the synth
     */
    triggerNote(note, duration, time, velocity = 1) {
        if (!this.isInitialized || !this.synth) return;

        const freq = Tone.Frequency(note, "midi").toFrequency();
        this.synth.triggerAttackRelease(freq, duration, time, velocity);
    }

    /**
     * Updates synth envelope parameters
     */
    updateEnvelope(params = {}) {
        if (!this.synth) return;

        const envelope = {
            attack: Math.max(0.001, Math.min(2, params.attack ?? 0.005)),
            decay: Math.max(0.001, Math.min(2, params.decay ?? 0.1)),
            sustain: Math.max(0, Math.min(1, params.sustain ?? 0.3)),
            release: Math.max(0.001, Math.min(2, params.release ?? 0.1))
        };

        this.synth.set({ envelope });
    }

    /**
     * Gets the current synth instance
     */
    getSynth() {
        return this.synth;
    }

    /**
     * Cleanup
     */
    dispose() {
        if (this.synth) {
            this.synth.dispose();
            this.synth = null;
        }
        this.isInitialized = false;
    }
}

// For testing
export class MockAudioSynth extends AudioSynth {
    constructor() {
        super(new AudioCore());
    }

    async initialize() {
        // Mock implementation
    }

    triggerNote() {
        // Mock implementation
    }

    updateEnvelope() {
        // Mock implementation
    }
}
