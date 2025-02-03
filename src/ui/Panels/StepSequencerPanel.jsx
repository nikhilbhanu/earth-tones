import React, { useCallback, memo } from 'react';
import { ToggleButton, Box, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { COLORS } from '../../constants/colors';
import { PanelContainer } from '../shared/StyledComponents';
import MicroTimingControl from '../Controls/MicroTimingControl';
import SliderControl from '../Controls/SliderControl';

/** @type {React.FC<{stepIndex: number, active: boolean, isCurrent: boolean, onClick: () => void}>} */
const StepButton = memo(({ stepIndex, active, isCurrent, onClick }) => (
    <ToggleButton
        value={stepIndex}
        selected={active}
        onChange={onClick}
        sx={{
            width: '100%',
            height: '100%',
            padding: 0,
            border: 'none',
            borderRadius: '6px',
            backgroundColor: active ? COLORS.viz.A : alpha(COLORS.background.elevated, 0.3),
            '&.Mui-selected': {
                border: 'none',
                '&:hover': {
                    opacity: 0.9
                }
            },
            '&:hover': {
                backgroundColor: active
                    ? COLORS.viz.A
                    : alpha(COLORS.background.elevated, 0.4),
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundColor: COLORS.background.primary,
                opacity: isCurrent ? 1 : 0,
                transition: 'opacity 0.1s ease',
                borderRadius: '6px',
                boxShadow: isCurrent ? `0 0 8px ${COLORS.background.primary}` : 'none',
                pointerEvents: 'none'
            }
        }}
    >
        <div className="step-indicator" />
    </ToggleButton>
));

/** @type {React.FC<{
    rowId: number,
    steps: Array<{ active: boolean, subdivision: number }>,
    currentStep: number,
    isPlaying: boolean,
    onToggleStep: (rowId: number, stepIndex: number) => void,
    onSetSubdivision: (rowId: number, stepIndex: number, value: number) => void,
    onSetNoteLength: (rowId: number, stepIndex: number, value: number) => void
}>>} */
const StepSequencerPanel = memo(({
    rowId,
    steps,
    currentStep,
    isPlaying,
    onToggleStep,
    onSetSubdivision,
    onSetNoteLength
}) => {
    // Memoize callbacks
    const toggleStepCallback = useCallback((stepIndex) => {
        onToggleStep(rowId, stepIndex);
    }, [onToggleStep, rowId]);

    const setSubdivisionCallback = useCallback((stepIndex, value) => {
        onSetSubdivision(rowId, stepIndex, value);
    }, [onSetSubdivision, rowId]);

    const setNoteLengthCallback = useCallback((stepIndex, value) => {
        onSetNoteLength(rowId, stepIndex, value);
    }, [onSetNoteLength, rowId]);

    if (!steps) return null;

    return (
        <Paper elevation={3} sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '16px',
            gap: '8px',
            backgroundColor: alpha(COLORS.background.elevated, 0.95)
        }}>
            {steps.map((step, stepIndex) => (
                <Box
                    key={stepIndex}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '110px',
                        position: 'relative',
                        width: '48px',
                        justifyContent: 'center'
                    }}
                >
                    <Paper
                        elevation={2}
                        sx={{
                            flex: '1 0 auto',
                            minWidth: '36px',
                            maxWidth: '48px',
                            aspectRatio: '1',
                            margin: '1px',
                            borderRadius: '6px',
                            transition: 'all 0.15s ease',
                            overflow: 'hidden'
                        }}
                    >
                        <StepButton
                            stepIndex={stepIndex}
                            active={step.active}
                            isCurrent={stepIndex === currentStep && isPlaying}
                            onClick={() => toggleStepCallback(stepIndex)}
                        />
                    </Paper>
                    <Box sx={{
                        display: 'flex', alignItems: 'center',
                        height: '20px',
                        pt: 2,
                        position: 'relative',
                        width: '48px',
                        justifyContent: 'center'
                    }}>
                        <MicroTimingControl
                            value={step.subdivision}
                            onChange={(_, value) => setSubdivisionCallback(stepIndex, value)}
                            stepIndex={stepIndex}
                            sx={{
                                width: '48px',
                                '& .MuiSlider-markLabel': {
                                    transform: 'rotate(-45deg) translate(10px, 10px)',
                                    whiteSpace: 'nowrap'
                                }
                            }}
                        />
                    </Box>
                    <Box sx={{
                        display: 'flex', alignItems: 'center',
                        height: '20px',
                        pt: 1,
                        ml: 1, mr: 1,
                        position: 'relative',
                        width: '48px',
                        justifyContent: 'center'
                    }}>
                        <SliderControl
                            value={step.noteLength}
                            onChange={(_, value) => setNoteLengthCallback(stepIndex, value)}
                            min={0.25}
                            max={4}
                            step={0.25}
                            sx={{
                                width: '48px',
                                '& .MuiSlider-markLabel': {
                                    transform: 'rotate(-45deg) translate(10px, 10px)',
                                    whiteSpace: 'nowrap'
                                },
                                '& .MuiSlider-track': {
                                    backgroundColor: COLORS.viz.A,
                                },
                                '& .MuiSlider-thumb': {
                                    backgroundColor: COLORS.success,
                                    height: 10,
                                    width: 10,
                                }
                            }}
                        />
                    </Box>
                </Box>
            ))}
        </Paper >
    );
});

export default StepSequencerPanel;
