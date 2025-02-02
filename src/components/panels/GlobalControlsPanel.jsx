import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import SliderControl from '../controls/SliderControl';
import { styled } from '@mui/material/styles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { COLORS } from '../../constants/colors';
import useAudioStore from '../../stores/audioStore';

// Using default MUI Slider styling from theme.js

const CompactIconButton = styled(IconButton)({
    padding: '4px',
    '& .MuiSvgIcon-root': {
        fontSize: '1.2rem',
    },
});

const GlobalControlsPanel = () => {
    const {
        cubeSamplingRate,
        setCubeSamplingRate,
        numberOfNotes,
        setNumberOfNotes,
        setMasterVolume
    } = useAudioStore();

    return (
        <Box sx={{ height: '100%' }}>
            <Stack spacing={2}>
                {/* Master Volume Section */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <VolumeUpIcon />
                        </CompactIconButton>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Master Volume
                        </Typography>
                    </Box>
                    <SliderControl
                        defaultValue={75}
                        aria-label="Master Volume"
                        valueLabelDisplay="auto"
                        onChange={(_, value) => setMasterVolume(value / 100)} // Convert 0-100 to 0-1
                    />
                </Box>

                {/* Cube Sampling Rate Section */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <SpeedIcon />
                        </CompactIconButton>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Cube Sampling Rate
                        </Typography>
                    </Box>
                    <SliderControl
                        value={cubeSamplingRate}
                        onChange={(_, value) => setCubeSamplingRate(value)}
                        min={0.01}
                        max={2}
                        step={0.01}
                        aria-label="Cube Sampling Rate"
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => value.toFixed(2)}
                    />
                </Box>

                {/* Number of Notes Section */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <MusicNoteIcon />
                        </CompactIconButton>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Number of Notes
                        </Typography>
                    </Box>
                    <SliderControl
                        value={numberOfNotes}
                        onChange={(_, value) => setNumberOfNotes(value)}
                        min={1}
                        max={4}
                        step={1}
                        marks
                        aria-label="Number of Notes"
                        valueLabelDisplay="auto"
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default GlobalControlsPanel;
