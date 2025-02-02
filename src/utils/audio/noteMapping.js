import { SCALES, DEFAULT_SCALE } from '../../constants/scales';

/**
 * Maps positions in 3D space to musical note numbers using configurable scales
 * Note numbers follow MIDI convention (0-127)
 */

/**
 * Converts a 3D position and depth to a musical note number
 * @param {[number, number, number]} position - [x, y, z] coordinates
 * @param {number} depth - Current recursion depth
 * @param {Object} params - Note mapping parameters
 * @param {string} params.scaleType - Type of scale to use (defaults to pentatonic)
 * @param {number} params.baseFrequency - Base frequency in Hz (default 261.63 = C4)
 * @param {number} params.octaveRange - Number of octaves to span (default 4)
 * @param {number} params.curvature - Non-linear distribution factor (0-1, default 0.5)
 * @returns {number} MIDI note number (0-127)
 */
export function positionToNoteNumber(position, depth, params = {}) {
    const [x, y, z] = position;
    const {
        scaleType = DEFAULT_SCALE,
        baseFrequency = 261.63, // C4
        octaveRange = 4,
        curvature = 0.5
    } = params;

    // Convert base frequency to MIDI note number
    // Start two octaves lower than the base frequency
    const adjustedBaseFreq = baseFrequency / 4; // Divide by 4 to go down 2 octaves
    const baseNote = Math.round(12 * Math.log2(adjustedBaseFreq / 440) + 69);

    // Calculate octave range distribution - scale down the shift
    const octaveShift = Math.floor(depth * (octaveRange / 4)) * 12;

    // Get the scale intervals (fallback to pentatonic if invalid scale type)
    const scale = SCALES[scaleType] || SCALES[DEFAULT_SCALE];

    // Convert position to a normalized value (0-1)
    const positionSum = Math.abs(x) + Math.abs(y) + Math.abs(z);

    // Apply curvature to the position value for non-linear distribution
    const curvedPosition = Math.pow(positionSum, 1 + curvature * 2);
    const normalizedPosition = curvedPosition % 1;

    // Map to scale index
    const scaleIndex = Math.floor(normalizedPosition * scale.intervals.length);
    const noteInterval = scale.intervals[scaleIndex];

    // Combine all components to get final note number
    const noteNumber = baseNote + octaveShift + noteInterval;

    // Ensure note stays within MIDI range (0-127)
    return Math.min(Math.max(noteNumber, 0), 127);
}

/**
 * Maps an entire Menger sponge structure to note numbers
 * @param {Array<{position: [number, number, number], scale: number}>} spongePositions
 * @param {number} depth - Current recursion depth
 * @param {Object} params - Note mapping parameters
 * @returns {Array<{position: [number, number, number], scale: number, noteNumber: number}>}
 */
export function mapSpongeToNotes(spongePositions, depth, params = {}) {
    return spongePositions.map(cube => ({
        ...cube,
        noteNumber: positionToNoteNumber(cube.position, depth, params)
    }));
}
