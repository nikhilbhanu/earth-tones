// Musical scale definitions (intervals in semitones)
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
    chromatic: {
        name: 'Chromatic',
        intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    }
};

export const DEFAULT_SCALE = 'pentatonic';
