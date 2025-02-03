import { SCALES } from '../audio/scales';

export const TIME_CONTROL_CONFIG = {
    min: 0.001,
    max: 2,
    step: 0.001,
    valueLabelDisplay: "auto",
    valueLabelFormat: (value) => `${value.toFixed(3)}s`
};

export const SUSTAIN_CONTROL_CONFIG = {
    min: 0,
    max: 1,
    step: 0.01,
    valueLabelDisplay: "auto",
    valueLabelFormat: (value) => value.toFixed(2)
};

export const ENVELOPE_CONTROLS = [
    {
        id: 'attack',
        label: 'Attack',
        config: TIME_CONTROL_CONFIG,
        isHeader: true
    },
    {
        id: 'decay',
        label: 'Decay',
        config: TIME_CONTROL_CONFIG
    },
    {
        id: 'sustain',
        label: 'Sustain',
        config: SUSTAIN_CONTROL_CONFIG
    },
    {
        id: 'release',
        label: 'Release',
        config: TIME_CONTROL_CONFIG
    }
];

export const COORDINATE_SYSTEMS = {
    cartesian: 'Cartesian',
    spherical: 'Spherical',
    cylindrical: 'Cylindrical'
};

export const DISTRIBUTION_PATTERNS = {
    linear: 'Linear',
    exponential: 'Exponential',
    logarithmic: 'Logarithmic',
    sinusoidal: 'Sinusoidal'
};

export const GLOBAL_CONTROLS = [
    {
        id: 'masterVolume',
        label: 'Master Volume',
        config: {
            defaultValue: 75,
            valueLabelDisplay: "auto",
            min: 0,
            max: 100,
            step: 1,
            transform: (value) => value / 100 // Convert 0-100 to 0-1
        }
    },
    {
        id: 'cubeSamplingRate',
        label: 'Cube Sampling Rate (BPM)',
        config: {
            min: 30,
            max: 600,
            step: 1,
            valueLabelDisplay: "auto",
            valueLabelFormat: (value) => `${value} BPM`
        }
    },
    {
        id: 'numberOfNotes',
        label: 'Number of Notes',
        config: {
            min: 1,
            max: 4,
            step: 1,
            marks: true,
            valueLabelDisplay: "auto"
        }
    },
    {
        id: 'scaleType',
        label: 'Scale Type',
        type: 'select',
        config: {
            options: Object.entries(SCALES).map(([value, scale]) => ({
                value,
                label: scale.name
            }))
        }
    },
    {
        id: 'baseFrequency',
        label: 'Base Frequency (Hz)',
        config: {
            min: 20,
            max: 2000,
            step: 1,
            valueLabelDisplay: "auto",
            valueLabelFormat: (value) => `${value} Hz`
        }
    },
    {
        id: 'octaveRange',
        label: 'Octave Range',
        config: {
            min: 1,
            max: 8,
            step: 1,
            marks: true,
            valueLabelDisplay: "auto"
        }
    },
    {
        id: 'curvature',
        label: 'Note Distribution Curve',
        config: {
            min: 0,
            max: 1,
            step: 0.01,
            valueLabelDisplay: "auto",
            valueLabelFormat: (value) => value.toFixed(2)
        }
    },
    {
        id: 'coordinateSystem',
        label: 'Coordinate System',
        type: 'select',
        config: {
            options: Object.entries(COORDINATE_SYSTEMS).map(([value, label]) => ({
                value,
                label
            }))
        }
    },
    {
        id: 'distribution',
        label: 'Distribution Pattern',
        type: 'select',
        config: {
            options: Object.entries(DISTRIBUTION_PATTERNS).map(([value, label]) => ({
                value,
                label
            }))
        }
    },
    {
        id: 'enableMicrotonal',
        label: 'Enable Microtonal',
        type: 'select',
        config: {
            options: [
                { value: false, label: 'Off' },
                { value: true, label: 'On' }
            ]
        }
    },
    {
        id: 'enableDepthModulation',
        label: 'Enable Depth Modulation',
        type: 'select',
        config: {
            options: [
                { value: false, label: 'Off' },
                { value: true, label: 'On' }
            ]
        }
    }
];
