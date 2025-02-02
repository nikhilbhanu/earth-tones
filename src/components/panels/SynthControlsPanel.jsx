import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import SliderControl from '../controls/SliderControl';
import { styled } from '@mui/material/styles';
import TuneIcon from '@mui/icons-material/Tune';
import { COLORS } from '../../constants/colors';
import useAudioStore from '../../stores/audioStore';

const CompactIconButton = styled(IconButton)({
    padding: '2px',
    '& .MuiSvgIcon-root': {
        fontSize: '1rem',
    },
});

const SynthControlsPanel = () => {
    const {
        attack,
        setAttack,
        decay,
        setDecay,
        sustain,
        setSustain,
        release,
        setRelease
    } = useAudioStore();

    return (
        <Box sx={{ height: '100%', width: '100%', p: 0.5 }}>
            <Stack spacing={0.5} sx={{ width: '100%' }}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <TuneIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Synth Envelope
                        </Typography>
                    </Box>

                    {/* Attack */}
                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                            Attack
                        </Typography>
                        <SliderControl
                            value={attack}
                            onChange={(_, value) => setAttack(value)}
                            min={0.001}
                            max={2}
                            step={0.001}
                            aria-label="Attack Time"
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value.toFixed(3)}s`}
                        />
                    </Box>

                    {/* Decay */}
                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                            Decay
                        </Typography>
                        <SliderControl
                            value={decay}
                            onChange={(_, value) => setDecay(value)}
                            min={0.001}
                            max={2}
                            step={0.001}
                            aria-label="Decay Time"
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value.toFixed(3)}s`}
                        />
                    </Box>

                    {/* Sustain */}
                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                            Sustain
                        </Typography>
                        <SliderControl
                            value={sustain}
                            onChange={(_, value) => setSustain(value)}
                            min={0}
                            max={1}
                            step={0.01}
                            aria-label="Sustain Level"
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => value.toFixed(2)}
                        />
                    </Box>

                    {/* Release */}
                    <Box sx={{ width: '100%', mb: 1 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                            Release
                        </Typography>
                        <SliderControl
                            value={release}
                            onChange={(_, value) => setRelease(value)}
                            min={0.001}
                            max={2}
                            step={0.001}
                            aria-label="Release Time"
                            valueLabelDisplay="auto"
                            valueLabelFormat={(value) => `${value.toFixed(3)}s`}
                        />
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default SynthControlsPanel;
