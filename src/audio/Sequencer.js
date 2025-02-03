import { AudioCore } from './AudioCore';
import { AudioScheduler } from './AudioScheduler';
import { AudioSynth } from './AudioSynth';
import useAudioStore from '../state/audioStore';

/**
 * Coordinates between audio components and handles sequencing logic.
 */
export class Sequencer {
    constructor(audioCore, scheduler, synth) {
        this.audioCore = audioCore;
        this.scheduler = scheduler;
        this.synth = synth;
        this.sequence = Array(16).fill(false);
        this.currentStep = 0;
        this.isInitialized = false;
        this.onStepChange = null;
    }

    /**
     * Initializes all audio components
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            await this.audioCore.initialize();
            await this.synth.initialize();
            this.isInitialized = true;
        } catch (error) {
            // console.error('Failed to initialize sequencer:', error);
            throw error;
        }
    }

    /**
     * Sets the sequence pattern
     */
    setSequence(sequence) {
        if (sequence.length !== 16) {
            throw new Error('Sequence must be 16 steps');
        }
        this.sequence = sequence;
    }

    /**
     * Starts playback
     */
    async start() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        // Start the scheduler with our tick callback
        this.scheduler.start((time) => this.tick(time));
        // console.log('[Sequencer] Started playback');
    }

    /**
     * Stops playback
     */
    stop() {
        this.scheduler.stop();
        this.currentStep = 0;
        if (this.onStepChange) {
            this.onStepChange(this.currentStep);
        }
        // console.log('[Sequencer] Stopped playback');
    }

    /**
     * Called by scheduler on each tick
     */
    tick(time) {
        const context = this.audioCore.getContext();
        if (!context) return;

        // Only play notes if this step is active in the sequence
        if (this.sequence[this.currentStep]) {
            // Get active notes from store
            const activeNotes = useAudioStore.getState().activeSphereNotes;
            if (activeNotes && activeNotes.length > 0) {
            const velocity = Math.max(0.2, 1 / Math.sqrt(activeNotes.length));

                // Log timing information
                // console.log(
                //     `[Sequencer] Step ${this.currentStep + 1}/16 - ` +
                //     `Notes: ${activeNotes.join(', ')}, ` +
                //     `Velocity: ${velocity.toFixed(2)}, ` +
                //     `Scheduled: ${time.toFixed(3)}s, ` +
                //     `Current: ${context.currentTime.toFixed(3)}s, ` +
                //     `Look-ahead: ${(time - context.currentTime).toFixed(3)}s`
                // );

                // Trigger each active note
                activeNotes.forEach(note => {
                    this.synth.triggerNote(note.noteNumber, "32n", time, velocity, note.cents);
                });
            }
        }

        // Advance step
        this.currentStep = (this.currentStep + 1) % 16;
        if (this.onStepChange) {
            this.onStepChange(this.currentStep);
        }
    }

    /**
     * Sets the BPM (Beats Per Minute)
     */
    setBpm(bpm) {
        this.scheduler.setBpm(bpm);
    }

    /**
     * Updates synth parameters
     */
    updateSynthEnvelope(envelope) {
        this.synth.updateEnvelope(envelope);
    }

    /**
     * Sets step change callback
     */
    setStepChangeCallback(callback) {
        this.onStepChange = callback;
    }

    /**
     * Cleans up all components
     */
    dispose() {
        this.stop();
        this.synth.dispose();
        this.audioCore.dispose();
        this.isInitialized = false;
    }
}

// For testing
export class MockSequencer extends Sequencer {
    constructor() {
        const audioCore = new AudioCore();
        const scheduler = new AudioScheduler(audioCore);
        const synth = new AudioSynth(audioCore);
        super(audioCore, scheduler, synth);
    }

    async initialize() {
        // Mock implementation
        return Promise.resolve();
    }

    async start() {
        // Mock implementation
        return Promise.resolve();
    }

    stop() {
        // Mock implementation
    }
}
