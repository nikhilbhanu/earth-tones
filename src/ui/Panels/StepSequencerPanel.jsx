import React, { useEffect, useRef } from 'react';
import { ToggleButton, Box, Paper } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { COLORS } from '../../constants/colors';
import useSequencerStore from '../../state/sequencerStore';
import useTransportStore from '../../state/transportStore';
import useAudioStore from '../../state/audioStore';
import { PanelContainer, ScrollContainer } from '../shared/StyledComponents';
import MicroTimingControl from '../Controls/MicroTimingControl';

const StepButtonContainer = styled(Paper)(({ theme }) => ({
    flex: '1 0 auto',
    minWidth: '36px',
    maxWidth: '48px',
    aspectRatio: '1',
    margin: '2px',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
    overflow: 'hidden',
}));

StepButtonContainer.defaultProps = {
    elevation: 3
};


const StepButton = styled(ToggleButton)(({ theme, iscurrent }) => ({
    width: '100%',
    height: '100%',
    padding: 0,
    border: 'none',
    borderRadius: '6px',
    '&.Mui-selected': {
        border: 'none',
        '&:hover': {
            opacity: 0.9,
        },
    },
    '&:hover': {
        opacity: 0.8,
    },
}));

const StepSequencerPanel = () => {
    const { steps, toggleStep, setSubdivision, currentStep } = useSequencerStore();
    const isPlaying = useTransportStore(state => state.isPlaying);

    return (
        <PanelContainer>
            <ScrollContainer>
                {steps.map((step, stepIndex) => (
                    <Box
                        key={stepIndex}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            height: '120px', // Ensure enough height for knob
                            position: 'relative'
                        }}
                    >
                        <StepButtonContainer elevation={2}>
                            <StepButton
                                value={stepIndex}
                                selected={step.active}
                                onChange={() => toggleStep(stepIndex)}
                                iscurrent={(stepIndex === currentStep && isPlaying).toString()}
                                sx={{
                                    backgroundColor: step.active
                                        ? COLORS.viz.A
                                        : alpha(COLORS.background.elevated, 0.3),
                                    '&:hover': {
                                        backgroundColor: step.active
                                            ? COLORS.viz.A
                                            : alpha(COLORS.background.elevated, 0.4),
                                    },
                                    '& .step-indicator': {
                                        width: '100%',
                                        height: '100%',
                                        opacity: step.active ? 1 : 0.3,
                                        transition: 'all 0.2s ease',
                                        backgroundColor: 'transparent',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            inset: 0,
                                            backgroundColor: COLORS.text.primary,
                                            opacity: stepIndex === currentStep ? 0.8 : 0,
                                            transition: 'opacity 0.1s ease',
                                            borderRadius: '6px'
                                        }
                                    }
                                }}
                            >
                                <div className="step-indicator" />
                            </StepButton>
                        </StepButtonContainer>
                        <MicroTimingControl
                            value={step.subdivision}
                            onChange={(_, value) => setSubdivision(stepIndex, value)}
                            sx={{
                                width: '48px',
                                mt: 1,
                                position: 'absolute',
                                bottom: 0,
                                '& .MuiSlider-markLabel': {
                                    transform: 'rotate(-45deg) translate(10px, 10px)',
                                    whiteSpace: 'nowrap'
                                }
                            }}
                        />
                    </Box>
                ))}
            </ScrollContainer>
        </PanelContainer>
    );
};

export default StepSequencerPanel;
