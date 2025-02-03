import useAudioParametersStore from '../state/audioParametersStore';
import useTransportStore from '../state/transportStore';

export const initializeSphereActivationClock = (allSpheres) => {
    let activeSpheres = new Set();
    let currentPosition = 0; // Track current position
    let visitedVertices = new Set(); // Track visited vertices
    let allPositions = Array.from({ length: allSpheres.length }, (_, i) => i);
    let currentSequence = []; // Current sequence of positions to visit
    let samplingInterval = null;

    // Clean up any existing interval
    if (samplingInterval) {
        clearInterval(samplingInterval);
        samplingInterval = null;
    }

    const audioParamsStore = useAudioParametersStore.getState();
    const transportStore = useTransportStore.getState();
    let numberOfNotes = audioParamsStore.numberOfNotes || 1;
    let cubeSamplingRate = audioParamsStore.cubeSamplingRate || 1;
    let isPlaying = transportStore.isPlaying;

    // Function to update active spheres
    const updateActiveSpheres = () => {
        if (!isPlaying) return;

        try {
            // Generate new sequence if current one is empty
            if (currentSequence.length === 0) {
                // Create a sequence that visits all positions
                currentSequence = [...allPositions];

                // Apply some musical variation to the sequence
                // Split into groups of 8 and shuffle each group
                for (let i = 0; i < currentSequence.length; i += 8) {
                    const group = currentSequence.slice(i, Math.min(i + 8, currentSequence.length));
                    for (let j = group.length - 1; j > 0; j--) {
                        const k = Math.floor(Math.random() * (j + 1));
                        [group[j], group[k]] = [group[k], group[j]];
                    }
                    currentSequence.splice(i, group.length, ...group);
                }
            }

            // Get next position from sequence
            currentPosition = currentSequence.shift();
            visitedVertices.add(currentPosition);

            // Find immediate neighbors in 3D space
            const currentSphere = allSpheres[currentPosition];
            const currentPos = currentSphere.position;

            // Find closest neighbors using squared distance (more efficient than sqrt)
            const neighbors = [];
            const maxNeighbors = 3;
            const processed = new Set([currentPosition]);

            // First pass: find potential neighbors within a small radius
            const radius = currentSphere.scale * 3; // Use sphere scale as reference
            const radiusSquared = radius * radius;

            for (let i = 0; i < allSpheres.length && neighbors.length < maxNeighbors; i++) {
                if (processed.has(i)) continue;

                const sphere = allSpheres[i];
                const dx = sphere.position[0] - currentPos[0];
                const dy = sphere.position[1] - currentPos[1];
                const dz = sphere.position[2] - currentPos[2];
                const distSquared = dx*dx + dy*dy + dz*dz;

                if (distSquared <= radiusSquared) {
                    neighbors.push(i);
                    processed.add(i);
                }
            }

            // Second pass: if we need more neighbors, get the next closest ones
            if (neighbors.length < maxNeighbors) {
                const remaining = allSpheres
                    .map((sphere, index) => {
                        if (processed.has(index)) return null;
                        const dx = sphere.position[0] - currentPos[0];
                        const dy = sphere.position[1] - currentPos[1];
                        const dz = sphere.position[2] - currentPos[2];
                        return {
                            index,
                            distSquared: dx*dx + dy*dy + dz*dz
                        };
                    })
                    .filter(Boolean)
                    .sort((a, b) => a.distSquared - b.distSquared)
                    .slice(0, maxNeighbors - neighbors.length)
                    .map(n => n.index);

                neighbors.push(...remaining);
            }

            // Create new Set to avoid reference issues
            activeSpheres = new Set([currentPosition, ...neighbors]);
        } catch (error) {
            // console.error('Error in sphere activation:', error);
        }
    };

    // Start/stop sampling based on play state
    const startSampling = () => {
        if (samplingInterval) {
            clearInterval(samplingInterval);
            samplingInterval = null;
        }

        if (isPlaying) {
            // Convert BPM to milliseconds, ensuring a reasonable range
            const bpmToMs = (bpm) => Math.max(Math.min(60000 / bpm, 1000), 33.33); // Clamp between 1s and 30fps
            const intervalMs = bpmToMs(cubeSamplingRate);

            samplingInterval = setInterval(updateActiveSpheres, intervalMs);
            // console.log('Sphere sampling started:', JSON.stringify({
            //     cubeSamplingRate,
            //     intervalMs: intervalMs.toFixed(2),
            //     timestamp: new Date().toISOString()
            // }, null, 2));
        }
    };

    // Subscribe to store changes
    const unsubscribeAudio = useAudioParametersStore.subscribe((state) => {
        numberOfNotes = state.numberOfNotes || 1;
        if (cubeSamplingRate !== state.cubeSamplingRate) {
            cubeSamplingRate = state.cubeSamplingRate || 1;
            startSampling(); // Restart with new rate if playing
        }
    });

    const unsubscribeTransport = useTransportStore.subscribe((state) => {
        if (isPlaying !== state.isPlaying) {
            isPlaying = state.isPlaying;
            startSampling(); // Start/stop based on play state
        }
    });

    // Initial start if playing
    if (isPlaying) {
        startSampling();
    }

    return {
        getActiveSpheres: () => activeSpheres,
        cleanup: () => {
            if (samplingInterval) {
                clearInterval(samplingInterval);
                samplingInterval = null;
            }
            unsubscribeAudio();
            unsubscribeTransport();
            currentPosition = 0; // Reset to starting position
            visitedVertices.clear(); // Clear visited tracking
            currentSequence = []; // Clear current sequence
            activeSpheres = new Set(); // Create new empty Set
        }
    };
};
