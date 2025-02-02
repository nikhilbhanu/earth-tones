import React, { useEffect, useRef } from 'react';
import { Box, Paper, ToggleButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { COLORS } from '../../constants/colors';
import useAudioStore from '../../stores/audioStore';
import useTransportStore from '../../stores/transportStore';

const StepButton = styled(ToggleButton)(({ theme, iscurrent }) => ({
    flex: '1 0 auto',
    minWidth: '36px',
    maxWidth: '48px',
    aspectRatio: '1',
    padding: 0,
    margin: '2px',
    borderRadius: '6px',
    border: `1px solid ${alpha(COLORS.background.elevated, 0.3)}`,
    transition: 'all 0.15s ease',
    '&.Mui-selected': {
        border: 'none',
        '&:hover': {
            opacity: 0.9,
        },
    },
    '&:hover': {
        borderColor: alpha(COLORS.background.elevated, 0.5),
    },
    transform: 'scale(1)',
    boxShadow: 'none',
}));

const StepRow = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '8px',
    backgroundColor: alpha(COLORS.background.secondary, 0.3),
    width: '100%',
    overflowX: 'auto',
});

const StepSequencerPanel = () => {
    const { sequence, currentStep, toggleStep, analyserNode } = useAudioStore();
    const isPlaying = useTransportStore(state => state.isPlaying);
    const audioDataRef = useRef(new Uint8Array(128));

    useEffect(() => {
        if (!isPlaying || !analyserNode) return;

        const animate = () => {
            // Get audio data for visualization only
            analyserNode.getByteTimeDomainData(audioDataRef.current);
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [isPlaying, analyserNode]);

    return (
        <Paper
            elevation={3}
            sx={{
                width: '100%',
                padding: '6px 12px',
                backgroundColor: 'transparent',
                borderRadius: '20px',
                border: 'none',
                boxShadow: 'none',
                position: 'relative',
                zIndex: 1,
                margin: '0 auto'
            }}
        >
            <StepRow>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    minWidth: 'min-content',
                    width: '100%',
                    justifyContent: 'space-between'
                }}>
                    {sequence.map((isActive, stepIndex) => (
                        <StepButton
                            key={stepIndex}
                            value={stepIndex}
                            selected={isActive}
                            onChange={() => toggleStep(stepIndex)}
                            iscurrent={(stepIndex === currentStep && isPlaying).toString()}
                            sx={{
                                backgroundColor: isActive
                                    ? COLORS.viz.A
                                    : alpha(COLORS.background.elevated, 0.3),
                                '&:hover': {
                                    backgroundColor: isActive
                                        ? COLORS.viz.A
                                        : alpha(COLORS.background.elevated, 0.4),
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    opacity: isActive ? 1 : 0.3,
                                    transition: 'all 0.2s ease',
                                    backgroundColor: 'transparent',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: COLORS.text.primary,
                                        opacity: stepIndex === currentStep && isPlaying ?
                                            Math.max(
                                                0.3, // Minimum opacity for current step
                                                Math.max(...Array.from(audioDataRef.current).slice(0, 10)) / 255
                                            ) : 0,
                                        transition: 'opacity 0.1s ease'
                                    }
                                }}
                            />
                        </StepButton>
                    ))}
                </Box>
            </StepRow>
        </Paper>
    );
};

export default StepSequencerPanel;
