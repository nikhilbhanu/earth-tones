import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
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
});

const SelectControl = ({ value, onChange, options, ...props }) => {
    return (
        <FormControl fullWidth size="small">
            <StyledSelect
                value={value}
                onChange={onChange}
                {...props}
            >
                {options.map(option => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{ fontSize: '0.75rem' }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </StyledSelect>
        </FormControl>
    );
};

export default SelectControl;
