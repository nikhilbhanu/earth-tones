import { useEffect } from 'react';
import useTransportStore from '../state/transportStore';

export const useKeyboardShortcuts = () => {
    const { isPlaying, setIsPlaying } = useTransportStore();

    useEffect(() => {
        const handleKeyPress = (event) => {
            switch (event.key.toLowerCase()) {
                case ' ':  // Spacebar
                    event.preventDefault();
                    setIsPlaying(!isPlaying);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isPlaying, setIsPlaying]);
};
