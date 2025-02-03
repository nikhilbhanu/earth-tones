import { Box, IconButton, Paper } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { COLORS } from '../../constants/colors';

// Common layout components
export const FlexBox = styled(Box)({
    display: 'flex',
    alignItems: 'center',
});

export const FlexColumn = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});

// Panel base component
export const PanelContainer = styled(Paper)(({ theme }) => ({
    width: 'fit-content',
    padding: '12px 12px',
    backgroundColor: 'transparent',
    borderRadius: '20px',
    border: 'none',
    boxShadow: 'none',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column'
}));

// Common control components
export const CompactIconButton = styled(IconButton)({
    padding: '2px',
    '& .MuiSvgIcon-root': {
        fontSize: '1rem',
    },
});

// Control container
export const ControlContainer = styled(Box)({
    width: '100%',
    marginBottom: '8px',
});

// Section container
export const SectionContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    width: '100%',
    overflowX: 'auto',
});

// Scrollable container
export const ScrollContainer = styled(Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 48px)', // 8 steps per row
    gap: '8px',
    padding: '8px 4px 16px 4px',
    width: 'fit-content'
});
