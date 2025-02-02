import React from 'react';
import { Slider } from '@mui/material';

const SliderControl = (props) => {
    return (
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
    );
};

export default SliderControl;
