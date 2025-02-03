import React, { createContext, useContext, useEffect, useState } from 'react';
import { AudioCore } from '../audio/AudioCore';
import { AudioScheduler } from '../audio/AudioScheduler';
import { AudioSynth } from '../audio/AudioSynth';
import { Sequencer } from '../audio/Sequencer';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
    const [contextValue, setContextValue] = useState(null);
    const [error, setError] = useState(null);

    const initializeAudio = async () => {
        if (contextValue?.isInitialized) return;

        try {
            const audioCore = new AudioCore();
            const scheduler = new AudioScheduler(audioCore);
            const synth = new AudioSynth(audioCore);
            const sequencer = new Sequencer(audioCore, scheduler, synth);

            await audioCore.initialize();

            setContextValue({
                audioCore,
                scheduler,
                synth,
                sequencer,
                isInitialized: true,
                error: null,
                initializeAudio
            });
        } catch (err) {
            setError('Failed to initialize audio system');
            // console.error('Audio initialization error:', err);
            throw err;
        }
    };

    useEffect(() => {
        return () => {
            contextValue?.audioCore.dispose();
        };
    }, [contextValue]);

    return (
        <AudioContext.Provider value={{ ...contextValue, initializeAudio }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioContext must be used within an AudioProvider');
    }
    return context;
};
