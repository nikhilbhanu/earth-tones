import useAudioStore from '../../stores/audioStore';
import useTransportStore from '../../stores/transportStore';

let activeSpheres = new Set();
let sphereCount = 0;
let samplingInterval = null;

export const initializeSphereActivationClock = (allSpheres) => {
    sphereCount = allSpheres.length;

    // Clean up any existing interval
    if (samplingInterval) {
        clearInterval(samplingInterval);
        samplingInterval = null;
    }

    const audioStore = useAudioStore.getState();
    const transportStore = useTransportStore.getState();
    let numberOfNotes = audioStore.numberOfNotes || 1;
    let cubeSamplingRate = audioStore.cubeSamplingRate || 1;
    let isPlaying = transportStore.isPlaying;

    // Function to update active spheres
    const updateActiveSpheres = () => {
        if (!isPlaying) return;

        try {
            // Create array of all possible indices and shuffle
            const availableIndices = Array.from({ length: sphereCount }, (_, i) => i);
            for (let i = availableIndices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [availableIndices[i], availableIndices[j]] = [availableIndices[j], availableIndices[i]];
            }

            // Update active spheres with new Set to ensure reference change
            const selectedIndices = availableIndices.slice(0, numberOfNotes);
            console.log('Sphere activation update:', JSON.stringify({
                numberOfNotes,
                selectedIndices,
                timestamp: new Date().toISOString()
            }, null, 2));
            activeSpheres = new Set(selectedIndices);
        } catch (error) {
            console.error('Error in sphere activation:', error);
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
            console.log('Sphere sampling started:', JSON.stringify({
                cubeSamplingRate,
                intervalMs: intervalMs.toFixed(2),
                timestamp: new Date().toISOString()
            }, null, 2));
        }
    };

    // Subscribe to store changes
    const unsubscribeAudio = useAudioStore.subscribe((state) => {
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
            activeSpheres.clear();
        }
    };
};
