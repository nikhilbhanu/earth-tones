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
        this.isInitialized = true;
    }

    async start() {
        if (!this.synth) {
            const context = this.audioCore.getContext();
            const masterGain = this.audioCore.getMasterGain();

            if (!context || !masterGain) {
                throw new Error('AudioCore not properly initialized');
            }

            // Initialize Tone.js with our context
            Tone.setContext(context);

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

            // Start Tone.js after synth is configured (will be resumed by AudioContext)
            await Tone.start();
        }
    }

    /**
     * Triggers a note with the synth
     */
    /**
     * Triggers a note with the synth
     * @param {number} note - MIDI note number
     * @param {number} duration - Note duration in seconds
     * @param {number} time - When to trigger the note
     * @param {number} velocity - Note velocity (0-1)
     * @param {number} cents - Microtonal offset in cents (-50 to +50)
     */
    triggerNote(note, duration, time, velocity = 1, cents = 0) {
        if (!this.isInitialized || !this.synth) return;

        // Validate inputs
        if (note === null || note === undefined || isNaN(note)) return;
        if (time === null || time === undefined || isNaN(time)) return;

        // Ensure note is within MIDI range (0-127)
        note = Math.max(0, Math.min(127, Math.round(note)));

        // Ensure cents is valid (-50 to +50)
        cents = cents || 0;
        cents = Math.max(-50, Math.min(50, cents));

        // Convert MIDI note to frequency
        let freq = Tone.Frequency(note, "midi").toFrequency();

        // Apply microtonal offset if any
        if (cents !== 0) {
            // Cents to frequency multiplier formula: 2^(cents/1200)
            const multiplier = Math.pow(2, cents / 1200);
            freq *= multiplier;
        }

        // Ensure velocity is valid (0-1)
        velocity = Math.max(0, Math.min(1, velocity));

        try {
            this.synth.triggerAttackRelease(freq, duration, time, velocity);
        } catch (error) {
            console.warn('Failed to trigger note:', { note, freq, duration, time, velocity, cents });
        }
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
