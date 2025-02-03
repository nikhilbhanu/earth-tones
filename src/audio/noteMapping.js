import { SCALES, DEFAULT_SCALE } from './scales';

/**
 * Cube vertex definitions and neighbor relationships
 * The cube vertices are numbered 0-7, representing the corners of a cube
 * Each vertex has 3 neighbors connected by edges
 */
export const CUBE_VERTICES = {
    0: [-1, -1, -1], // vertex 0 coordinates
    1: [1, -1, -1],  // vertex 1 coordinates
    2: [1, 1, -1],   // vertex 2 coordinates
    3: [-1, 1, -1],  // vertex 3 coordinates
    4: [-1, -1, 1],  // vertex 4 coordinates
    5: [1, -1, 1],   // vertex 5 coordinates
    6: [1, 1, 1],    // vertex 6 coordinates
    7: [-1, 1, 1]    // vertex 7 coordinates
};

// Define neighbor relationships along cube edges
const CUBE_NEIGHBORS = {
    0: [1, 3, 4], // vertex 0 connects to vertices 1, 3, and 4
    1: [0, 2, 5], // vertex 1 connects to vertices 0, 2, and 5
    2: [1, 3, 6], // vertex 2 connects to vertices 1, 3, and 6
    3: [0, 2, 7], // vertex 3 connects to vertices 0, 2, and 7
    4: [0, 5, 7], // vertex 4 connects to vertices 0, 5, and 7
    5: [1, 4, 6], // vertex 5 connects to vertices 1, 4, and 6
    6: [2, 5, 7], // vertex 6 connects to vertices 2, 5, and 7
    7: [3, 4, 6]  // vertex 7 connects to vertices 3, 4, and 6
};

/**
 * Get valid neighbors for a given vertex
 * @param {number} vertex - Vertex index (0-7)
 * @returns {number[]} Array of neighboring vertex indices
 */
export function getNeighbors(vertex) {
    return CUBE_NEIGHBORS[vertex] || [];
}

/**
 * Coordinate system conversion functions
 */
function cartesianToSpherical(x, y, z) {
    const r = Math.sqrt(x * x + y * y + z * z);
    // Handle edge case when r is 0
    if (r === 0) {
        return { r: 0, θ: 0, φ: 0 };
    }
    const θ = Math.atan2(y, x);
    // Handle edge case to avoid division by zero
    const φ = r === 0 ? 0 : Math.acos(Math.max(-1, Math.min(1, z / r)));
    return { r, θ, φ };
}

function cartesianToCylindrical(x, y, z) {
    const r = Math.sqrt(x * x + y * y);
    // Handle edge case when x and y are both 0
    const θ = (x === 0 && y === 0) ? 0 : Math.atan2(y, x);
    const h = z;
    return { r, θ, h };
}

/**
 * Distribution pattern functions that map input (0-1) to output (0-1)
 */
const distributions = {
    linear: (x) => x,
    exponential: (x) => Math.pow(x, 2),
    logarithmic: (x) => Math.log(1 + x) / Math.log(2),
    sinusoidal: (x) => (Math.sin(x * Math.PI * 2 - Math.PI / 2) + 1) / 2
};

/**
 * Calculate microtonal offset in cents (-50 to +50)
 */
function calculateMicrotonalOffset(fractionalPart, φ) {
    // Use elevation angle (φ) to influence the microtonal variation
    const baseOffset = (fractionalPart * 100) - 50;
    const elevationFactor = (φ / Math.PI) * 2 - 1; // -1 to 1
    return baseOffset * elevationFactor;
}

/**
 * Calculate octave shift based on depth using a sine wave pattern
 */
function calculateOctaveShift(depth, octaveRange) {
    const normalizedDepth = depth % octaveRange;
    return Math.floor(Math.sin(normalizedDepth * Math.PI * 2) * (octaveRange / 2));
}

/**
 * Select scale/mode based on depth
 */
function selectScale(depth, scaleType) {
    const scaleKeys = Object.keys(SCALES);
    if (scaleType && SCALES[scaleType]) {
        return SCALES[scaleType];
    }
    // Cycle through scales based on depth
    const scaleIndex = Math.floor(depth) % scaleKeys.length;
    return SCALES[scaleKeys[scaleIndex]];
}

/**
 * Enhanced position to note number conversion with all new features
 * @param {[number, number, number]} position - [x, y, z] coordinates
 * @param {number} depth - Current recursion depth
 * @param {Object} params - Note mapping parameters
 * @param {string} params.scaleType - Type of scale to use
 * @param {number} params.baseFrequency - Base frequency in Hz (default 261.63 = C4)
 * @param {number} params.octaveRange - Number of octaves to span (default 4)
 * @param {number} params.curvature - Non-linear distribution factor (0-1)
 * @param {string} params.coordinateSystem - 'cartesian'|'spherical'|'cylindrical'
 * @param {string} params.distribution - 'linear'|'exponential'|'logarithmic'|'sinusoidal'
 * @param {boolean} params.enableMicrotonal - Enable microtonal variations
 * @param {boolean} params.enableDepthModulation - Enable depth-based modulation
 * @returns {{ noteNumber: number, cents: number }} MIDI note number and cents offset
 */
export function positionToNoteNumber(position, depth, params = {}) {
    const [x, y, z] = position;
    const {
        scaleType = DEFAULT_SCALE,
        baseFrequency = 261.63, // C4
        octaveRange = 4,
        curvature = 0.5,
        coordinateSystem = 'cartesian',
        distribution = 'linear',
        enableMicrotonal = false,
        enableDepthModulation = false
    } = params;

    // Convert base frequency to MIDI note number
    const adjustedBaseFreq = baseFrequency / 4; // Start two octaves lower
    const baseNote = Math.round(12 * Math.log2(adjustedBaseFreq / 440) + 69);

    // Convert coordinates based on selected system
    let normalizedPosition;
    let elevationAngle = 0;

    switch (coordinateSystem) {
        case 'spherical': {
            const { r, θ, φ } = cartesianToSpherical(x, y, z);
            // Ensure normalizedPosition is always between 0 and 1
            normalizedPosition = ((θ + Math.PI) / (2 * Math.PI)) % 1;
            elevationAngle = φ;
            break;
        }
        case 'cylindrical': {
            const { r, θ, h } = cartesianToCylindrical(x, y, z);
            // Ensure normalizedPosition is always between 0 and 1
            normalizedPosition = ((θ + Math.PI) / (2 * Math.PI)) % 1;
            break;
        }
        default: { // cartesian
            const positionSum = Math.abs(x) + Math.abs(y) + Math.abs(z);
            normalizedPosition = Math.pow(positionSum, 1 + curvature * 2) % 1;
        }
    }

    // Apply selected distribution pattern
    const distributionFunc = distributions[distribution] || distributions.linear;
    const mappedPosition = distributionFunc(normalizedPosition);

    // Get scale and calculate note
    const scale = enableDepthModulation ? selectScale(depth, scaleType) : SCALES[scaleType] || SCALES[DEFAULT_SCALE];
    const scaleIndex = Math.floor(mappedPosition * scale.intervals.length);
    const noteInterval = scale.intervals[scaleIndex];

    // Calculate octave shift
    const octaveShift = enableDepthModulation
        ? calculateOctaveShift(depth, octaveRange) * 12
        : Math.floor(depth * (octaveRange / 4)) * 12;

    // Calculate final note number
    const noteNumber = Math.min(Math.max(
        baseNote + octaveShift + noteInterval,
        0
    ), 127);

    // Calculate microtonal offset if enabled
    const cents = enableMicrotonal
        ? calculateMicrotonalOffset(mappedPosition * scale.intervals.length % 1, elevationAngle)
        : 0;

    return { noteNumber, cents };
}

/**
 * Maps an entire Menger sponge structure to notes with microtonal information
 * @param {Array<{position: [number, number, number], scale: number}>} spongePositions
 * @param {number} depth - Current recursion depth
 * @param {Object} params - Note mapping parameters
 * @returns {Array<{position: [number, number, number], scale: number, noteNumber: number, cents: number}>}
 */
export function mapSpongeToNotes(spongePositions, depth, params = {}) {
    return spongePositions.map(cube => ({
        ...cube,
        ...positionToNoteNumber(cube.position, depth, params)
    }));
}
