import React from 'react';
import { Box, Stack } from '@mui/material';
import SliderControl from '../Controls/SliderControl';
import { CompactIconButton } from '../shared/StyledComponents';
import TuneIcon from '@mui/icons-material/Tune';
import { COLORS } from '../../constants/colors';
import useAudioParametersStore from '../../state/audioParametersStore';

const SynthControlsPanel = () => {
    const {
        attack, setAttack,
        decay, setDecay,
        sustain, setSustain,
        release, setRelease
    } = useAudioParametersStore();

    const commonProps = {
        min: 0.001,
        max: 2,
        step: 0.001,
        valueLabelDisplay: "auto",
        valueLabelFormat: (value) => `${value.toFixed(3)}s`
    };

    return (
        <Box sx={{ height: '100%', width: '100%', p: 0.5 }}>
            <Stack spacing={0.5} sx={{ width: '100%' }}>
                <SliderControl
                    label={
                        <>
                            <CompactIconButton sx={{ color: COLORS.primary, mr: 0.5 }}>
                                <TuneIcon />
                            </CompactIconButton>
                            Synth Envelope
                        </>
                    }
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
        </Box>
    );
};

export default SynthControlsPanel;
