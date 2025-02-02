import { create } from 'zustand';

const useTransportStore = create((set) => ({
  isPlaying: false,
  bpm: 120,
  setIsPlaying: (isPlaying) => {
    console.log('Transport play state changing to:', isPlaying);
    set({ isPlaying });
  },
  setBpm: (bpm) => set({ bpm }),
  togglePlay: () => set((state) => {
    const newState = !state.isPlaying;
    console.log('Transport play state toggling to:', newState);
    return { isPlaying: newState };
  }),
  stop: () => {
    console.log('Transport stopping');
    set({ isPlaying: false });
  },
}));

export default useTransportStore;
