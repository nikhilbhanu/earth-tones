export const SCALES = {
    pentatonic: {
        name: 'Pentatonic',
        intervals: [0, 2, 4, 7, 9]
    },
    major: {
        name: 'Major',
        intervals: [0, 2, 4, 5, 7, 9, 11]
    },
    minor: {
        name: 'Minor',
        intervals: [0, 2, 3, 5, 7, 8, 10]
    },
    dorian: {
        name: 'Dorian',
        intervals: [0, 2, 3, 5, 7, 9, 10]
    },
    mixolydian: {
        name: 'Mixolydian',
        intervals: [0, 2, 4, 5, 7, 9, 10]
    },
    blues: {
        name: 'Blues',
        intervals: [0, 3, 5, 6, 7, 10]
    },
    harmonicMinor: {
        name: 'Harmonic Minor',
        intervals: [0, 2, 3, 5, 7, 8, 11]
    },
    wholeTone: {
        name: 'Whole Tone',
        intervals: [0, 2, 4, 6, 8, 10]
    },
    chromatic: {
        name: 'Chromatic',
        intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
};

export const DEFAULT_SCALE = 'pentatonic';
