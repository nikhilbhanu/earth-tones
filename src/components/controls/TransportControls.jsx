import { Box, IconButton, Typography, useTheme } from '@mui/material';
import SliderControl from './SliderControl';
import useTransportStore from '../../stores/transportStore';
import useAudioStore from '../../stores/audioStore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

const TransportControls = () => {
    const { isPlaying, togglePlay, stop, bpm, setBpm } = useTransportStore();
    const audioStore = useAudioStore();

    const handlePlayPause = async (event) => {
        event.preventDefault();
        try {
            if (!isPlaying) {
                // Ensure audio is initialized on first play
                if (!audioStore.isInitialized) {
                    await audioStore.initializeAudio();
                }
                togglePlay(); // Update UI state first
                await audioStore.start();
            } else {
                togglePlay(); // Update UI state first
                audioStore.stop();
            }
        } catch (error) {
            console.error('Failed to toggle playback:', error);
            // Revert UI state if audio operation failed
            if (!isPlaying) {
                togglePlay();
            }
        }
    };

    const handleStop = () => {
        stop(); // Update UI state first
        audioStore.stop();
    };

    const handleBpmChange = (event, newValue) => {
        if (newValue >= 60 && newValue <= 200) {
            setBpm(newValue);
            audioStore.setTempo(newValue);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: '100%',
        }}>
            <IconButton
                onClick={handlePlayPause}
                aria-label={isPlaying ? "Pause" : "Play"}
                color="primary"
            >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton
                onClick={handleStop}
                aria-label="Stop"
                color="primary"
            >
                <StopIcon />
            </IconButton>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flex: 1,
                maxWidth: '200px'
            }}>
                <Typography variant="subtitle1" sx={{
                    whiteSpace: 'nowrap',
                    minWidth: '60px'
                }}>
                    {bpm} BPM
                </Typography>
                <Box sx={{
                    width: '100px',
                    padding: '0 8px'
                }}>
                    <SliderControl
                        value={bpm}
                        onChange={handleBpmChange}
                        min={60}
                        max={200}
                        step={1}
                        aria-label="BPM control"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default TransportControls;
