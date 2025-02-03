import { AudioCore } from './AudioCore';

/**
 * Handles precise timing and scheduling of audio events.
 * Takes AudioCore as a dependency for timing reference.
 */
export class AudioScheduler {
    constructor(audioCore) {
        this.audioCore = audioCore;
        this.nextNoteTime = 0;
        this.schedulerTimer = null;
        this.isRunning = false;
        this.bpm = 120.0;
        this.lookAheadMs = 15.0;
        this.scheduleAheadTime = 0.1;
        this.onTick = null;
        this.timingLogs = [];
        this.scheduledEvents = new Map();
    }

    /**
     * Starts the scheduling loop
     */
    start(onTick) {
        if (this.isRunning) return;

        const context = this.audioCore.getContext();
        if (!context) {
            throw new Error('AudioContext not initialized');
        }

        // console.log(`[Scheduler] Starting at ${this.bpm} BPM`);
        // console.log(`[Scheduler] Look-ahead: ${this.lookAheadMs}ms, Schedule-ahead: ${this.scheduleAheadTime}s`);

        this.isRunning = true;
        this.onTick = onTick;
        this.nextNoteTime = context.currentTime;
        this.scheduleLoop();
    }

    /**
     * Stops the scheduling loop
     */
    stop() {
        // console.log('[Scheduler] Stopping');
        this.isRunning = false;
        if (this.schedulerTimer !== null) {
            window.clearTimeout(this.schedulerTimer);
            this.schedulerTimer = null;
        }
    }

    /**
     * Sets the BPM (Beats Per Minute)
     */
    setBpm(bpm) {
        this.bpm = Math.max(30, Math.min(300, bpm));
        // console.log(`[Scheduler] BPM set to ${this.bpm}`);
    }

    /**
     * Gets the current BPM
     */
    getBpm() {
        return this.bpm;
    }

    /**
     * Schedules a one-time event
     */
    scheduleEvent(callback, time) {
        const eventId = Date.now() + Math.random().toString();
        this.scheduledEvents.set(eventId, { callback, time });

        const context = this.audioCore.getContext();
        if (context) {
            this.logTiming({
                type: 'schedule',
                scheduledTime: time,
                actualTime: context.currentTime
            });
        }

        return eventId;
    }

    /**
     * Main scheduling loop
     */
    scheduleLoop() {
        const context = this.audioCore.getContext();
        if (!context || !this.isRunning) return;

        const currentTime = context.currentTime;

        // Schedule notes until we reach the look-ahead time
        while (this.nextNoteTime < currentTime + this.scheduleAheadTime) {
            // Call the tick callback
            if (this.onTick) {
                this.onTick(this.nextNoteTime);
                this.logTiming({
                    type: 'tick',
                    scheduledTime: this.nextNoteTime,
                    actualTime: currentTime,
                    delta: this.nextNoteTime - currentTime,
                    bpm: this.bpm
                });
            }

            // Process any scheduled events
            this.processScheduledEvents(context);

            // Advance time
            const secondsPerBeat = 60.0 / this.bpm;
            this.nextNoteTime += secondsPerBeat / 4; // 16th notes
        }

        // Schedule next loop
        this.schedulerTimer = window.setTimeout(
            () => this.scheduleLoop(),
            this.lookAheadMs
        );
    }

    /**
     * Process any events that are due
     */
    processScheduledEvents(context) {
        const currentTime = context.currentTime;
        for (const [eventId, event] of this.scheduledEvents.entries()) {
            if (event.time <= currentTime) {
                event.callback(event.time);
                this.scheduledEvents.delete(eventId);

                this.logTiming({
                    type: 'process',
                    scheduledTime: event.time,
                    actualTime: currentTime,
                    delta: currentTime - event.time
                });
            }
        }
    }

    /**
     * Logs timing information
     */
    logTiming(log) {
        this.timingLogs.push(log);

        // Format times to 3 decimal places
        const scheduled = log.scheduledTime.toFixed(3);
        const actual = log.actualTime.toFixed(3);
        const delta = log.delta ? log.delta.toFixed(3) : 'N/A';

        // console.log(
        //     `[Scheduler] ${log.type.toUpperCase()} - ` +
        //     `Scheduled: ${scheduled}s, ` +
        //     `Actual: ${actual}s, ` +
        //     `Delta: ${delta}s` +
        //     (log.bpm ? `, BPM: ${log.bpm}` : '')
        // );
    }

    /**
     * Gets timing logs for analysis
     */
    getTimingLogs() {
        return this.timingLogs;
    }

    /**
     * Gets timing statistics
     */
    getTimingStats() {
        const deltas = this.timingLogs
            .filter(log => log.delta !== undefined)
            .map(log => log.delta);

        if (deltas.length === 0) return null;

        const average = deltas.reduce((a, b) => a + b, 0) / deltas.length;
        const max = Math.max(...deltas);
        const min = Math.min(...deltas);
        const jitter = max - min;

        return {
            averageDelta: average,
            maxDelta: max,
            minDelta: min,
            jitter,
            totalEvents: this.timingLogs.length
        };
    }

    /**
     * Cleanup
     */
    dispose() {
        this.stop();
        this.scheduledEvents.clear();
        this.timingLogs = [];
    }
}

// For testing
export class MockAudioScheduler extends AudioScheduler {
    constructor() {
        super(new AudioCore());
    }

    start() {
        // Mock implementation
    }

    stop() {
        // Mock implementation
    }
}
