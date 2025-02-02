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
            activeSpheres = new Set(availableIndices.slice(0, numberOfNotes));
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
            const intervalMs = Math.max(1000 / cubeSamplingRate, 16); // Minimum 16ms (60fps)
            samplingInterval = setInterval(updateActiveSpheres, intervalMs);
            console.log('Started sphere sampling at rate:', cubeSamplingRate, 'Hz');
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
