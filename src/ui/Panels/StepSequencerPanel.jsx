import React, { useEffect, useRef } from 'react';
import { ToggleButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { COLORS } from '../../constants/colors';
import useAudioStore from '../../state/audioStore';
import useTransportStore from '../../state/transportStore';
import { PanelContainer, SectionContainer, ScrollContainer } from '../shared/StyledComponents';

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

const StepSequencerPanel = () => {
    const { sequence, currentStep, toggleStep, analyserNode } = useAudioStore();
    const isPlaying = useTransportStore(state => state.isPlaying);
    const audioDataRef = useRef(new Uint8Array(128));

    useEffect(() => {
        if (!isPlaying || !analyserNode) return;

        const animate = () => {
            analyserNode.getByteTimeDomainData(audioDataRef.current);
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [isPlaying, analyserNode]);

    const getStepOpacity = (stepIndex) => {
        if (stepIndex !== currentStep || !isPlaying) return 0;
        return Math.max(0.3, Math.max(...Array.from(audioDataRef.current).slice(0, 10)) / 255);
    };

    return (
        <PanelContainer>
            <SectionContainer>
                <ScrollContainer>
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
                                '& .step-indicator': {
                                    width: '100%',
                                    height: '100%',
                                    opacity: isActive ? 1 : 0.3,
                                    transition: 'all 0.2s ease',
                                    backgroundColor: 'transparent',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: COLORS.text.primary,
                                        opacity: getStepOpacity(stepIndex),
                                        transition: 'opacity 0.1s ease'
                                    }
                                }
                            }}
                        >
                            <div className="step-indicator" />
                        </StepButton>
                    ))}
                </ScrollContainer>
            </SectionContainer>
        </PanelContainer>
    );
};

export default StepSequencerPanel;
