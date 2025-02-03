import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import SliderControl from '../Controls/SliderControl';
import { CompactIconButton } from '../shared/StyledComponents';
import TuneIcon from '@mui/icons-material/Tune';
import { COLORS } from '../../constants/colors';
import useAudioParametersStore from '../../state/audioParametersStore';
import useSequencerStore from '../../state/sequencerStore';

const SynthControlsPanel = () => {
    const {
        attack, setAttack,
        decay, setDecay,
        sustain, setSustain,
        release, setRelease
    } = useAudioParametersStore();

    const { swing, setSwing } = useSequencerStore();

    const commonProps = {
        min: 0.001,
        max: 1,
        step: 0.01,
        valueLabelDisplay: "auto",
        valueLabelFormat: (value) => `${value.toFixed(3)}s`
    };

    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            p: 1
        }}>
            <Stack spacing={0.5} sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CompactIconButton sx={{ color: COLORS.primary, mr: 0.5 }}>
                        <TuneIcon />
                    </CompactIconButton>
                    <></>
                    <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                        Envelope
                    </Typography>
                </Box>
                <SliderControl
                    label="Attack"
                    value={attack}
                    onChange={(_, value) => setAttack(value)}
                    aria-label="Attack Time"
                    {...commonProps}
                />

                <SliderControl
                    label="Decay"
                    value={decay}
                    onChange={(_, value) => setDecay(value)}
                    aria-label="Decay Time"
                    {...commonProps}
                />

                <SliderControl
                    label="Sustain"
                    value={sustain}
                    onChange={(_, value) => setSustain(value)}
                    min={0}
                    max={1}
                    step={0.01}
                    aria-label="Sustain Level"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => value.toFixed(2)}
                />

                <SliderControl
                    label="Release"
                    value={release}
                    onChange={(_, value) => setRelease(value)}
                    aria-label="Release Time"
                    {...commonProps}
                />
            </Stack>

            <Stack spacing={0.5} sx={{ width: '100%', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        Timing
                    </Typography>
                </Box>
                <SliderControl
                    label="Swing"
                    value={swing}
                    onChange={(_, value) => setSwing(value)}
                    min={0}
                    max={1}
                    step={0.01}
                    aria-label="Swing Amount"
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                />
            </Stack>
        </Box>
    );
};

export default SynthControlsPanel;
