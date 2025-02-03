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
        this.activeNotes = [];
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
            throw error;
        }
    }

    /**
     * Maps current step to notes
     */
    mapStepToNotes(step, sequencerRows, activeSphereNotes) {
        return sequencerRows.map((row, index) => {
            const sphereNote = activeSphereNotes[index];
            if (!sphereNote || !row.steps[step]) return null;

            return row.steps[step].active ? {
                noteNumber: sphereNote.noteNumber,
                cents: sphereNote.cents,
                subdivision: row.steps[step].subdivision,
                noteLength: row.steps[step].noteLength
            } : null;
        }).filter(Boolean);
    }

    /**
     * Called by scheduler on each tick
     */
    tick(time) {
        const context = this.audioCore.getContext();
        if (!context) return;

        // Get all required state at once to avoid multiple store accesses
        const sequencerState = useSequencerStore.getState();
        const audioState = useAudioStore.getState();
        const currentStep = sequencerState.currentStep;

        // Process current step's notes
        for (const note of this.activeNotes) {
            const stepDuration = 60 / (this.scheduler.getBpm() * 4); // Duration of a 16th note in seconds

            // Calculate timing offsets
            const subdivisionOffset = (note.subdivision / 23) * (stepDuration / 2); // Max ±50% of step duration
            const swingOffset = currentStep % 2 === 1 ? sequencerState.swing * (stepDuration / 2) : 0; // Apply swing to odd steps
            const totalOffset = subdivisionOffset + swingOffset;

            // Calculate note duration based on noteLength (0.25 to 4)
            const baseDuration = 60 / (this.scheduler.getBpm() * 4); // Duration of a 16th note
            const noteDuration = baseDuration * (note.noteLength || 1);

            // Play this specific note
            const velocity = 0.8; // Fixed velocity for now
            this.synth.triggerNote(note.noteNumber, noteDuration, time + totalOffset, velocity, note.cents);
        }

        // Calculate next step
        const nextStep = (currentStep + 1) % 16;

        // Update step first so UI highlights match audio
        sequencerState.setCurrentStep(nextStep);

        // Map next step to notes after updating step
        this.activeNotes = this.mapStepToNotes(nextStep, sequencerState.rows, audioState.activeSphereNotes);

        // Call legacy step change callback with current step
        if (this.onStepChange) {
            this.onStepChange(nextStep);
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

        // Map initial step
        const sequencerState = useSequencerStore.getState();
        const audioState = useAudioStore.getState();
        this.activeNotes = this.mapStepToNotes(
            sequencerState.currentStep,
            sequencerState.rows,
            audioState.activeSphereNotes
        );

        // Start the scheduler with our tick callback
        this.scheduler.start((time) => this.tick(time));
    }

    /**
     * Stops playback
     */
    stop() {
        this.scheduler.stop();
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
