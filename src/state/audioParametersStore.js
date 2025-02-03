import { create } from 'zustand';
import { DEFAULT_SCALE } from '../audio/scales';
import { COORDINATE_SYSTEMS, DISTRIBUTION_PATTERNS } from '../constants/controlConfigs';

const useAudioParametersStore = create((set) => ({
    // Initial state
    bpm: 120.0,
    cubeSamplingRate: 120,
    numberOfNotes: 1,
    scaleType: DEFAULT_SCALE,
    baseFrequency: 261.63,
    octaveRange: 4,
    curvature: 0.5,
    attack: 0.005,
    decay: 0.1,
    sustain: 0.3,
    release: 0.1,
    coordinateSystem: 'cartesian',
    distribution: 'linear',
    enableMicrotonal: false,
    enableDepthModulation: false,

    // Parameter setters with validation
    setBpm: (bpm) =>
        set({ bpm: Math.max(60, Math.min(200, bpm)) }),

    setCubeSamplingRate: (rate) =>
        set({ cubeSamplingRate: Math.max(30, Math.min(600, rate)) }),

    setNumberOfNotes: (count) =>
        set({ numberOfNotes: Math.max(1, Math.min(16, count)) }),

    setScaleType: (scaleType) =>
        set({ scaleType }),

    setBaseFrequency: (freq) =>
        set({ baseFrequency: Math.max(20, Math.min(20000, freq)) }),

    setOctaveRange: (range) =>
        set({ octaveRange: Math.max(1, Math.min(8, range)) }),

    setCurvature: (value) =>
        set({ curvature: Math.max(0, Math.min(1, value)) }),

    setAttack: (value) =>
        set({ attack: Math.max(0.001, Math.min(2, value)) }),

    setDecay: (value) =>
        set({ decay: Math.max(0.001, Math.min(2, value)) }),

    setSustain: (value) =>
        set({ sustain: Math.max(0, Math.min(1, value)) }),

    setRelease: (value) =>
        set({ release: Math.max(0.001, Math.min(2, value)) }),

    setCoordinateSystem: (system) =>
        set({ coordinateSystem: Object.keys(COORDINATE_SYSTEMS).includes(system) ? system : 'cartesian' }),

    setDistribution: (pattern) =>
        set({ distribution: Object.keys(DISTRIBUTION_PATTERNS).includes(pattern) ? pattern : 'linear' }),

    setEnableMicrotonal: (enabled) =>
        set({ enableMicrotonal: Boolean(enabled) }),

    setEnableDepthModulation: (enabled) =>
        set({ enableDepthModulation: Boolean(enabled) })
}));

export default useAudioParametersStore;
