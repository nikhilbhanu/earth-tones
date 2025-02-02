/**
 * AudioManager class that handles global audio context and precise scheduling
 * using a look-ahead mechanism for accurate timing of audio events.
 */
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.analyserNode = null;

    // Scheduler parameters
    this.lookAheadMs = 25.0; // How far ahead to schedule audio (in milliseconds)
    this.scheduleAheadTime = 0.025; // How far ahead to schedule audio (in seconds)
    this.nextNoteTime = 0.0; // When the next note is due
    this.timerID = null; // The ID for the audio scheduler timer
    this.tempo = 120.0; // Default tempo in BPM

    // Step sequencer parameters
    this.currentStep = 0;
    this.numSteps = 16; // Default number of steps
    this.sequence = new Array(this.numSteps).fill(false);
    this.stepStartTimes = new Array(this.numSteps).fill(0);

    // Active sphere notes
    this.activeSphereNotes = [];

    // Event queue for scheduled events
    this.scheduledEvents = [];

    // Step change callback
    this.onStepChange = null;

    // Store the sound generator callback
    this.soundCallback = null;

    // Bind methods
    this.scheduler = this.scheduler.bind(this);
    this.nextNote = this.nextNote.bind(this);
    this.scheduleNote = this.scheduleNote.bind(this);
  }

  /**
   * Initialize the audio context and analyzer
   */
  async initialize() {
    try {
      // Create new context if none exists
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create and configure analyzer node
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 2048;
        this.analyserNode.smoothingTimeConstant = 0.8;

        // Connect analyzer to destination
        this.analyserNode.connect(this.audioContext.destination);
      }

      // Ensure context is running
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();

        // Double-check the state after resume
        if (this.audioContext.state !== 'running') {
          throw new Error('Failed to resume AudioContext');
        }
      }

      // Add error handler for context state changes
      this.audioContext.onstatechange = () => {
        console.log('AudioContext state changed to:', this.audioContext.state);
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(console.error);
        }
      };

      return this.audioContext;
    } catch (error) {
      console.error('Error initializing audio context:', error);
      throw error;
    }
  }

  /**
   * Dispose of audio resources
   */
  dispose() {
    if (this.timerID) {
      clearInterval(this.timerID);
      this.timerID = null;
    }

    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
  }

  /**
   * Start the audio scheduler
   */
  async start(soundCallback) {
    await this.initialize();

    // Ensure audio context is resumed
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Wait a small amount of time to ensure context is fully resumed
    await new Promise(resolve => setTimeout(resolve, 100));

    this.currentStep = 0; // Reset step counter
    this.stepStartTimes = new Array(this.numSteps).fill(0); // Reset timing data using current numSteps
    this.nextNoteTime = this.audioContext.currentTime;
    this.timerID = setInterval(this.scheduler, this.lookAheadMs);
    this.soundCallback = soundCallback;
    console.log('Sequence started at:', this.audioContext.currentTime.toFixed(3), 'Context state:', this.audioContext.state);
  }

  /**
   * Stop the audio scheduler and reset timing
   */
  stop() {
    if (this.timerID) {
      clearInterval(this.timerID);
      this.timerID = null;
    }

    if (this.audioContext) {
      this.nextNoteTime = this.audioContext.currentTime;
      this.currentStep = 0;
    }

    this.scheduledEvents = [];

    // Ensure step change callback is triggered for reset
    if (this.onStepChange) {
      this.onStepChange(0);
    }
  }

  /**
   * Schedule a new audio event
   * @param {Function} callback - Function to be called to create and schedule the audio node
   * @param {number} time - When to schedule the event (in seconds from now)
   * @param {Object} params - Additional parameters for the event
   */
  scheduleEvent(callback, time, params = {}) {
    if (!this.audioContext) return;

    const event = {
      callback,
      time: this.audioContext.currentTime + time,
      params
    };
    this.scheduledEvents.push(event);
  }

  /**
   * Calculate the time for the next note based on current tempo
   */
  nextNote() {
    // Add time for one 16th note (1/4 of a beat)
    const secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime += secondsPerBeat * 0.25; // Divide by 4 for 16th notes
  }

  /**
   * Schedule a note to play at a specific time
   * @param {number} time - When to play the note (in seconds)
   */
  scheduleNote(time) {
    if (!this.audioContext) return;

    // Store the actual start time for this step
    this.stepStartTimes[this.currentStep] = time;

    // Notify step change
    if (this.onStepChange) {
      this.onStepChange(this.currentStep);
    }

    // Execute scheduled events regardless of step state
    this.scheduledEvents = this.scheduledEvents.filter(event => {
      if (event.time <= time) {
        try {
          event.callback(this.audioContext, time, {
            ...event.params,
            step: this.currentStep
          });
        } catch (error) {
          console.error('Error executing scheduled event:', error);
        }
        return false; // Remove the event from the queue
      }
      return true;
    });

    // Play active sphere notes only when sequence step is active
    if (this.sequence[this.currentStep] && this.soundCallback && this.activeSphereNotes.length > 0) {
      try {
        console.log(`Playing notes at step ${this.currentStep}:`, this.activeSphereNotes);
        this.activeSphereNotes.forEach(noteNumber => {
          this.soundCallback(this.audioContext, time, {
            step: this.currentStep,
            noteNumber: noteNumber
          });
        });
      } catch (error) {
        console.error('Error executing sound callback:', error);
      }
    }

    // Advance to next step
    this.currentStep = (this.currentStep + 1) % this.numSteps;
  }

  /**
   * Set the sequence pattern
   * @param {boolean[]} pattern - Array of boolean values representing active steps
   */
  setSequence(pattern) {
    // Update numSteps to match the pattern length
    this.numSteps = pattern.length;
    this.sequence = [...pattern];
    this.stepStartTimes = new Array(this.numSteps).fill(0);
  }

  /**
   * Get timing verification data
   * @returns {Object} Timing verification data
   */
  getTimingVerification() {
    const stepTimes = this.stepStartTimes.map(time => time.toFixed(3));
    const intervals = [];
    for (let i = 1; i < this.stepStartTimes.length; i++) {
      intervals.push((this.stepStartTimes[i] - this.stepStartTimes[i-1]).toFixed(3));
    }

    return {
      stepTimes,
      intervals,
      expectedInterval: (60 / this.tempo * 0.25).toFixed(3) // 0.25 for 16th notes
    };
  }

  /**
   * The main scheduler function that runs periodically to schedule audio events
   */
  scheduler() {
    // Check if audio context exists and is running
    if (!this.audioContext || this.audioContext.state !== 'running') {
      return;
    }

    // While there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.nextNoteTime);
      this.nextNote();
    }
  }

  /**
   * Set the tempo of the scheduler
   * @param {number} newTempo - The new tempo in BPM
   */
  setTempo(newTempo) {
    if (!this.audioContext) return;

    const timeElapsed = this.audioContext.currentTime - this.nextNoteTime;
    const beatsElapsed = timeElapsed / (60.0 / this.tempo);
    this.tempo = newTempo;
    // Recalculate nextNoteTime based on new tempo
    this.nextNoteTime = this.audioContext.currentTime - (beatsElapsed * 60.0 / this.tempo);
  }

  /**
   * Get the current audio context time
   * @returns {number} Current audio context time in seconds
   */
  getCurrentTime() {
    return this.audioContext ? this.audioContext.currentTime : 0;
  }

  /**
   * Get the analyzer node for visualization
   * @returns {AnalyserNode} The analyzer node
   */
  getAnalyserNode() {
    return this.analyserNode;
  }

  /**
   * Check if audio context is initialized
   * @returns {boolean} Whether the audio context is initialized
   */
  isInitialized() {
    return !!this.audioContext && this.audioContext.state === 'running';
  }

  /**
   * Update the active sphere notes
   * @param {Array} spheres - Array of active sphere objects with noteNumber property
   */
  updateActiveSphereNotes(spheres) {
    this.activeSphereNotes = spheres.map(sphere => sphere.noteNumber);
    console.log('AudioManager received notes:', this.activeSphereNotes);
  }
}

// Create a singleton instance
const audioManager = new AudioManager();
export default audioManager;
