import { AudioCore } from './AudioCore';
import { AudioScheduler } from './AudioScheduler';
import { AudioSynth } from './AudioSynth';
import useAudioStore from '../state/audioStore';
import useSequencerStore from '../state/sequencerStore';

/**
 * Coordinates between audio components and handles sequencing logic.
 */
export class Sequencer {
    constructor(audioCore, scheduler, synth) {
        this.audioCore = audioCore;
        this.scheduler = scheduler;
        this.synth = synth;
        this.sequence = useSequencerStore.getState().steps;

        // Subscribe to sequencer store changes and store unsubscribe function
        this.unsubscribeStore = useSequencerStore.subscribe(
            (state) => {
                this.sequence = state.steps;
            }
        );
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
     * Starts playback
     */
    async start() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        // Start synth (initializes Tone.js after user interaction)
        await this.synth.start();

        // Start the scheduler with our tick callback
        this.scheduler.start((time) => this.tick(time));
        // console.log('[Sequencer] Started playback');
    }

    /**
     * Stops playback
     */
    stop() {
        this.scheduler.stop();
        // console.log('[Sequencer] Stopped playback');
    }

    /**
     * Called by scheduler on each tick
     */
    tick(time) {
        const context = this.audioCore.getContext();
        if (!context) return;

        // Get current step data
        const currentStepData = this.sequence[this.currentStep];

        // Only play notes if this step is active
        if (currentStepData.active) {
            // Calculate timing offset from subdivision
            const stepDuration = 60 / (this.scheduler.getBpm() * 4); // Duration of a 16th note in seconds
            const subdivisionOffset = (currentStepData.subdivision / 23) * (stepDuration / 2); // Max ±50% of step duration
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

                // Trigger each active note with offset timing
                activeNotes.forEach(note => {
                    this.synth.triggerNote(note.noteNumber, "32n", time + subdivisionOffset, velocity, note.cents);
                });
            }
        }

        // Advance step
        this.currentStep = (this.currentStep + 1) % 16;
        // Update store and legacy callback
        useSequencerStore.getState().setCurrentStep(this.currentStep);
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
        if (this.unsubscribeStore) {
            this.unsubscribeStore(); // Clean up store subscription
        }
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
