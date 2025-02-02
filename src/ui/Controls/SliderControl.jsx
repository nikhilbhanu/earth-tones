import React from 'react';
import { Box, Slider, Typography } from '@mui/material';

const SliderControl = ({ label, ...props }) => {
    return (
        <Box sx={{ width: '100%', mb: 1 }}>
            {label && (
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {label}
                </Typography>
            )}
            <Slider
                {...props}
                sx={{
                    width: '100%',
                    padding: '10px 0',
                    '& .MuiSlider-thumb': {
                        height: 16,
                        width: 16,
                    },
                    '& .MuiSlider-rail, & .MuiSlider-track': {
                        height: 3,
                    },
                    ...props.sx
                }}
            />
        </Box>
    );
};

export default SliderControl;
