/**
 * Handles core Web Audio API context and nodes.
 * Single source of truth for audio context and main routing.
 */
export class AudioCore {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.analyserNode = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Don't auto-resume, wait for user gesture

            // Create and configure analyzer node
            this.analyserNode = this.audioContext.createAnalyser();
            this.analyserNode.fftSize = 2048;

            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.75;

            // Connect audio graph
            this.masterGain.connect(this.analyserNode);
            this.analyserNode.connect(this.audioContext.destination);

            this.isInitialized = true;
        } catch (error) {
            // console.error('Failed to initialize audio context:', error);
            throw new Error('Failed to initialize audio system');
        }
    }

    getContext() {
        return this.audioContext;
    }

    getMasterGain() {
        return this.masterGain;
    }

    getAnalyser() {
        return this.analyserNode;
    }

    setMasterVolume(value) {
        if (this.masterGain && this.audioContext) {
            const safeValue = Math.max(0, Math.min(1, value));
            this.masterGain.gain.setValueAtTime(safeValue, this.audioContext.currentTime);
        }
    }

    async resume() {
        if (this.audioContext && this.audioContext.state !== 'running') {
            await this.audioContext.resume();
        }
    }

    dispose() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.audioContext = null;
        this.masterGain = null;
        this.analyserNode = null;
        this.isInitialized = false;
    }

    getState() {
        return this.audioContext?.state || 'closed';
    }
}

// For testing
export class MockAudioCore extends AudioCore {
    async initialize() {
        // Mock initialization
    }

    getContext() {
        return null;
    }

    getMasterGain() {
        return null;
    }

    getAnalyser() {
        return null;
    }
}
