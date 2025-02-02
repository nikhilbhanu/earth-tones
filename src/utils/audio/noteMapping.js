/**
 * Maps positions in 3D space to musical note numbers using a pentatonic scale
 * Note numbers follow MIDI convention (0-127)
 */

// Pentatonic scale intervals (in semitones)
const PENTATONIC_SCALE = [0, 2, 4, 7, 9];

/**
 * Converts a 3D position and depth to a musical note number
 * @param {[number, number, number]} position - [x, y, z] coordinates
 * @param {number} depth - Current recursion depth
 * @returns {number} MIDI note number (0-127)
 */
export function positionToNoteNumber(position, depth) {
    const [x, y, z] = position;

    // Base octave (MIDI note 48 = C3)
    const baseNote = 48;

    // Use depth to determine octave shift (each depth level = one octave up)
    const octaveShift = depth * 12;

    // Convert position to an index in the pentatonic scale
    // Using a combination of x, y, z to create variation
    const positionSum = Math.abs(x) + Math.abs(y) + Math.abs(z);
    const scaleIndex = Math.floor(positionSum * 100) % PENTATONIC_SCALE.length;

    // Get the note interval from the pentatonic scale
    const noteInterval = PENTATONIC_SCALE[scaleIndex];

    // Combine all components to get final note number
    const noteNumber = baseNote + octaveShift + noteInterval;

    // Ensure note stays within MIDI range (0-127)
    return Math.min(Math.max(noteNumber, 0), 127);
}

/**
 * Maps an entire Menger sponge structure to note numbers
 * @param {Array<{position: [number, number, number], scale: number}>} spongePositions
 * @param {number} depth - Current recursion depth
 * @returns {Array<{position: [number, number, number], scale: number, noteNumber: number}>}
 */
export function mapSpongeToNotes(spongePositions, depth) {
    return spongePositions.map(cube => ({
        ...cube,
        noteNumber: positionToNoteNumber(cube.position, depth)
    }));
}
