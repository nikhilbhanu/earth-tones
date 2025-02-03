import { create } from 'zustand';
import useAudioStore from './audioStore';

// Store focused on multi-row sequencer state
const useSequencerStore = create((set, get) => ({
    // Array of rows, each containing step data
    rows: [],
    // Global current step shared across all rows
    currentStep: 0,

    // Actions
    toggleStep: (rowId, index) => {
        set((state) => ({
            rows: state.rows.map(row =>
                row.id === rowId
                    ? {
                        ...row,
                        steps: row.steps.map((step, i) =>
                            i === index ? { ...step, active: !step.active } : step
                        )
                    }
                    : row
            )
        }));
    },

    setSubdivision: (rowId, index, value) => {
        set((state) => ({
            rows: state.rows.map(row =>
                row.id === rowId
                    ? {
                        ...row,
                        steps: row.steps.map((step, i) =>
                            i === index ? { ...step, subdivision: value } : step
                        )
                    }
                    : row
            )
        }));
    },

    // Global current step tracking
    setCurrentStep: (step) => {
        const currentStep = get().currentStep;
        // Only update if step actually changed
        if (currentStep === step) return;

        // Use a function to ensure we're not stale
        set(() => ({ currentStep: step }));
    },

    // Reset all steps in a row
    clearSteps: (rowId) => set((state) => ({
        rows: state.rows.map(row =>
            row.id === rowId
                ? {
                    ...row,
                    steps: row.steps.map(step => ({ ...step, active: false }))
                }
                : row
        )
    })),

    // Add a new row
    addRow: () => set((state) => ({
        rows: [
            ...state.rows,
            {
                id: state.rows.length,
                steps: Array(16).fill().map(() => ({
                    active: false,
                    subdivision: 0,
                }))
            }
        ]
    })),

    // Remove a row
    removeRow: (rowId) => set((state) => ({
        rows: state.rows.filter(row => row.id !== rowId)
    }))
}));

export default useSequencerStore;
