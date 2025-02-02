import { create } from 'zustand';

const useTransportStore = create((set) => ({
    isPlaying: false,
    bpm: 120,
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setBpm: (bpm) => set({ bpm }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    stop: () => set({ isPlaying: false })
}));

export default useTransportStore;
