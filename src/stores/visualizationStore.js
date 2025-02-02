import { create } from 'zustand';

const useVisualizationStore = create((set) => ({
  // Fractal parameters
  scale: 1,
  steps: 8,
  frequency: 20,

  // Visualization settings
  rotationSpeed: 0.001,
  baseOpacity: 0.5,

  // Actions
  setScale: (scale) => set({ scale }),
  setSteps: (steps) => set({ steps }),
  setFrequency: (frequency) => set({ frequency }),
  setRotationSpeed: (rotationSpeed) => set({ rotationSpeed }),
  setBaseOpacity: (baseOpacity) => set({ baseOpacity }),

  // Reset to defaults
  resetSettings: () => set({
    scale: 1,
    steps: 8,
    frequency: 20,
    rotationSpeed: 0.001,
    baseOpacity: 0.5,
  }),
}));

export default useVisualizationStore;
