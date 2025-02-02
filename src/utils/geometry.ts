interface CubePosition {
    position: [number, number, number];
    scale: number;
}

// Cache for memoization
const memoCache = new Map<string, CubePosition[]>();

/**
 * Validates input parameters for Menger Sponge generation
 * @param depth - Recursion depth
 * @param size - Initial size of the cube
 * @throws Error if parameters are invalid
 */
function validateInput(depth: number, size: number): void {
    if (!Number.isInteger(depth) || depth < 0 || depth > 4) {
        throw new Error('Depth must be an integer between 0 and 4');
    }
    if (typeof size !== 'number' || size <= 0) {
        throw new Error('Size must be a positive number');
    }
}

/**
 * Creates a key for memoization cache
 */
function createCacheKey(depth: number, size: number): string {
    return `${depth}-${size}`;
}

/**
 * Generates a Menger Sponge fractal structure recursively
 *
 * @description Creates a 3D Menger Sponge fractal by recursively subdividing cubes
 * and removing center pieces. The resulting structure is used for both visualization
 * and musical parameter generation.
 *
 * @param depth - Recursion depth (0-4 recommended)
 * @param size - Initial size of the cube
 * @returns Array of cube positions and scales
 *
 * @example
 * // Create a depth-2 Menger Sponge
 * const sponge = createMengerSponge(2, 3.0);
 * // Returns array of {position: [x, y, z], scale: s} objects
 */
export function createMengerSponge(depth: number, size: number): CubePosition[] {
    validateInput(depth, size);

    const cacheKey = createCacheKey(depth, size);
    const cached = memoCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    if (depth === 0) {
        const result: CubePosition[] = [{ position: [0, 0, 0], scale: size }];
        memoCache.set(cacheKey, result);
        return result;
    }

    const newSize = size / 3;
    const positions: CubePosition[] = [];
    const coordinates = [-1, 0, 1];

    // Pre-calculate recursive results for reuse
    const subSponge = createMengerSponge(depth - 1, newSize);

    // Use iterative approach instead of nested loops for better performance
    for (const x of coordinates) {
        for (const y of coordinates) {
            for (const z of coordinates) {
                if (Math.abs(x) + Math.abs(y) + Math.abs(z) > 1) {
                    // Create new cubes by mapping the sub-sponge positions
                    const newCubes: CubePosition[] = subSponge.map(cube => ({
                        position: [
                            x * newSize * 2 + cube.position[0],
                            y * newSize * 2 + cube.position[1],
                            z * newSize * 2 + cube.position[2]
                        ] as [number, number, number],
                        scale: cube.scale
                    }));
                    positions.push(...newCubes);
                }
            }
        }
    }

    // Cache the result before returning
    memoCache.set(cacheKey, positions);
    return positions;
}

// Clear cache if memory needs to be freed
export function clearGeometryCache(): void {
    memoCache.clear();
}
