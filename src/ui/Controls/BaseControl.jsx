import React from 'react';
import { Box, Slider, Select, MenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLORS } from '../../constants/colors';

const StyledSelect = styled(Select)({
    '& .MuiSelect-select': {
        padding: '4px 8px',
        fontSize: '0.75rem',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: COLORS.primary,
    },
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: '100%'
});

const ControlContainer = styled(Box)({
    width: '100%',
    marginBottom: '8px',
    '& .MuiTypography-root': {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: '4px',
        fontSize: '0.7rem',
        color: COLORS.primary
    }
});

const BaseControl = ({
    type = 'slider',
    label,
    icon: Icon,
    options,
    ...props
}) => {
    const Control = type === 'select' ? (
        <StyledSelect
            size="small"
            {...props}
        >
            {options?.map(option => (
                <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{ fontSize: '0.75rem' }}
                >
                    {option.label}
                </MenuItem>
            ))}
        </StyledSelect>
    ) : (
        <Slider
            {...props}
            sx={{
                width: '100%',
                padding: '8px 0',
                margin: '4px 0',
                '& .MuiSlider-thumb': {
                    height: 14,
                    width: 14,
                    '&:hover, &.Mui-focusVisible': {
                        boxShadow: 'none'
                    }
                },
                '& .MuiSlider-rail, & .MuiSlider-track': {
                    height: 2
                },
                '& .MuiSlider-valueLabel': {
                    fontSize: '0.65rem',
                    padding: '2px 4px'
                },
                ...props.sx
            }}
        />
    );

    return (
        <ControlContainer>
            {(label || Icon) && (
                <Typography component="div">
                    {Icon && <Icon />}
                    {label}
                </Typography>
            )}
            {Control}
        </ControlContainer>
    );
};

export default BaseControl;
