import React, { useState, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { COLORS } from '../../constants/colors';
import useTransportStore from '../../state/transportStore';

const formatValue = (value) => {
    if (value === 0) return '0';
    return value > 0 ? `+${value}` : `${value}`;
};

const MicroTimingControl = React.memo(({ label, value, onChange, stepIndex, ...props }) => {
    const [localValue, setLocalValue] = useState(value);
    const bpm = useTransportStore(state => state.bpm);

    const updateValue = useCallback((newValue) => {
        // Clamp to -8 to +8 range
        const clampedValue = Math.max(-8, Math.min(8, newValue));

        // Calculate step offset (maps -8 to +8 to -23 to +23)
        const stepOffset = Math.round((clampedValue / 8) * 23);

        // Calculate timing values
        const beatDuration = 60 / bpm; // seconds per beat
        const oneTwentyEighthNote = beatDuration / 32; // duration of 1/128 note
        const offsetInSeconds = stepOffset * oneTwentyEighthNote;

        console.log('Micro Timing Update:', {
            step: stepIndex,
            value: clampedValue,
            stepOffset,
            timing: {
                bpm,
                offsetInSeconds: offsetInSeconds.toFixed(6) + 's',
                subdivision: stepOffset === 0 ? '0' :
                    (stepOffset > 0 ? '+' : '-') + '1/128 × ' + Math.abs(stepOffset)
            }
        });

        setLocalValue(clampedValue);
        onChange?.(null, clampedValue);
    }, [onChange, stepIndex, bpm]);

    const handleIncrement = useCallback(() => {
        updateValue(localValue + 1);
    }, [localValue, updateValue]);

    const handleDecrement = useCallback(() => {
        updateValue(localValue - 1);
    }, [localValue, updateValue]);

    return (
        <Box sx={{
            width: '100%',
            mb: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none',
            padding: '8px'
        }}>
            {label && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem', mb: 1, color: COLORS.text.secondary }}>
                    {label}
                </Typography>
            )}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                width: '100%',
                maxWidth: '100px'
            }}>
                <IconButton
                    size="small"
                    onClick={handleDecrement}
                    disabled={localValue <= -8}
                    sx={{
                        color: COLORS.text.primary,
                        padding: '4px',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    <RemoveIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '0.75rem',
                        color: COLORS.text.primary,
                        width: '24px',
                        textAlign: 'center',
                        fontWeight: 500
                    }}
                >
                    {formatValue(localValue)}
                </Typography>
                <IconButton
                    size="small"
                    onClick={handleIncrement}
                    disabled={localValue >= 8}
                    sx={{
                        color: COLORS.text.primary,
                        padding: '4px',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    <AddIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
            </Box>
        </Box>
    );
});

export default MicroTimingControl;
