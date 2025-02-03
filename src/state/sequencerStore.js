import { create } from 'zustand';

// Simple store focused on sequencer-specific state
const useSequencerStore = create((set) => ({
    // Array of step data including subdivisions
    steps: Array(16).fill().map(() => ({
        active: false,
        subdivision: 0, // -23 to +23 for timing offsets
    })),

    // Actions
    toggleStep: (index) => set((state) => ({
        steps: state.steps.map((step, i) =>
            i === index ? { ...step, active: !step.active } : step
        )
    })),

    setSubdivision: (index, value) => set((state) => ({
        steps: state.steps.map((step, i) =>
            i === index ? { ...step, subdivision: value } : step
        )
    })),

    // Current step tracking
    currentStep: 0,
    setCurrentStep: (step) => set({ currentStep: step }),

    // Reset all steps
    clearSteps: () => set((state) => ({
        steps: state.steps.map(step => ({ ...step, active: false }))
    })),
}));

export default useSequencerStore;
