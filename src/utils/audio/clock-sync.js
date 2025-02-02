/**
 * ClockSync provides synchronization between Web Audio API's timing and requestAnimationFrame,
 * using the audio clock as the primary timing source to ensure precise visual animations.
 */
import audioManager from './AudioManager';

class ClockSync {
  constructor() {
    this.animationFrameId = null;
    this.lastFrameTime = 0;
    this.subscribers = new Set();
    this.isRunning = false;

    // Configuration
    this.driftThreshold = 0.016; // ~16ms threshold for drift correction
    this.smoothingFactor = 0.1; // For drift compensation
    this.accumulatedDrift = 0;

    // Bind methods
    this.animationLoop = this.animationLoop.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  /**
   * Calculate timing information for the current frame
   * @param {DOMHighResTimeStamp} timestamp - requestAnimationFrame timestamp
   * @returns {Object} Timing information for the frame
   */
  calculateTiming(timestamp) {
    const audioTime = audioManager.getCurrentTime();
    const systemTime = timestamp / 1000; // Convert to seconds

    // Calculate various timing metrics
    const frameDelta = this.lastFrameTime ? systemTime - this.lastFrameTime : 0;
    const drift = systemTime - audioTime;

    // Update drift tracking
    this.accumulatedDrift = (this.accumulatedDrift * (1 - this.smoothingFactor)) +
                           (drift * this.smoothingFactor);

    // Store frame time for next calculation
    this.lastFrameTime = systemTime;

    return {
      audioTime,
      systemTime,
      frameDelta,
      drift,
      correctedTime: audioTime + this.accumulatedDrift,
      needsCorrection: Math.abs(drift) > this.driftThreshold
    };
  }

  /**
   * The main animation loop that synchronizes with audio timing
   * @param {DOMHighResTimeStamp} timestamp - requestAnimationFrame timestamp
   */
  animationLoop(timestamp) {
    if (!this.isRunning) return;

    const timing = this.calculateTiming(timestamp);

    // Notify all subscribers with timing information
    this.subscribers.forEach(callback => {
      try {
        callback(timing);
      } catch (error) {
        console.error('Error in animation frame subscriber:', error);
      }
    });

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.animationLoop);
  }

  /**
   * Start the synchronized animation loop
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastFrameTime = 0;
    this.accumulatedDrift = 0;
    this.animationFrameId = requestAnimationFrame(this.animationLoop);
  }

  /**
   * Stop the synchronized animation loop
   */
  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Subscribe to synchronized animation frames
   * @param {Function} callback - Function to call on each frame with timing information
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get the current drift between system time and audio time
   * @returns {number} Current drift in seconds
   */
  getCurrentDrift() {
    return this.accumulatedDrift;
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.stop();
    this.subscribers.clear();
  }
}

// Create a singleton instance
const clockSync = new ClockSync();
export default clockSync;
