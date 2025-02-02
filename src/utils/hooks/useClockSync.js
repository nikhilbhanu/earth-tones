import { useEffect, useRef, useState } from "react";
import clockSync from "../audio/clock-sync";

/**
 * Hook to subscribe to synchronized audio-visual timing updates
 * @param {Object} options
 * @param {boolean} options.autoStart - Whether to automatically start sync on mount
 * @param {Function} options.onFrame - Optional callback for frame updates
 * @returns {Object} Timing information and control functions
 */
export function useClockSync({ autoStart = true, onFrame } = {}) {
  const [timing, setTiming] = useState({
    audioTime: 0,
    systemTime: 0,
    frameDelta: 0,
    drift: 0,
    correctedTime: 0,
    needsCorrection: false
  });

  const frameCallbackRef = useRef(onFrame);

  // Update callback ref when onFrame changes
  useEffect(() => {
    frameCallbackRef.current = onFrame;
  }, [onFrame]);

  useEffect(() => {
    // Frame update handler
    const handleFrame = (frameTiming) => {
      setTiming(frameTiming);
      if (frameCallbackRef.current) {
        frameCallbackRef.current(frameTiming);
      }
    };

    // Subscribe to clock sync updates
    const unsubscribe = clockSync.subscribe(handleFrame);

    // Start if autoStart is true
    if (autoStart) {
      clockSync.start();
    }

    // Cleanup
    return () => {
      unsubscribe();
      if (autoStart) {
        clockSync.stop();
      }
    };
  }, [autoStart]);

  // Return timing info and control functions
  return {
    ...timing,
    start: clockSync.start,
    stop: clockSync.stop,
    getCurrentDrift: clockSync.getCurrentDrift
  };
}
