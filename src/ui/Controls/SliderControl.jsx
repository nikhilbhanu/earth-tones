import React, { useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';

const SliderControl = ({ label, value, onChange, ...props }) => {
    const [localValue, setLocalValue] = useState(value);

    // Update local value when prop value changes
    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <Box sx={{ width: '100%' }}>
            {label && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {label}
                </Typography>
            )}
            <Slider
                {...props}
                value={localValue}
                onChange={(event, newValue) => {
                    setLocalValue(newValue);
                }}
                onChangeCommitted={(event, newValue) => {
                    onChange(event, newValue);
                }}
                sx={{
                    width: '100%',
                    padding: '0px 0px',
                    '& .MuiSlider-thumb': {
                        height: 10,
                        width: 10,
                    },
                    '& .MuiSlider-rail, & .MuiSlider-track': {
                        height: 2,
                    },
                    ...props.sx
                }}
            />
        </Box>
    );
};

export default SliderControl;
