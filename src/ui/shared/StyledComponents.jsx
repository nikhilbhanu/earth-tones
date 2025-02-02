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
    width: '100%',
    padding: '6px 12px',
    backgroundColor: 'transparent',
    borderRadius: '20px',
    border: 'none',
    boxShadow: 'none',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto'
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

// Section container with background
export const SectionContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '8px',
    backgroundColor: alpha(COLORS.background.secondary, 0.3),
    width: '100%',
    overflowX: 'auto',
});

// Scrollable container
export const ScrollContainer = styled(Box)({
    display: 'flex',
    flexWrap: 'nowrap',
    minWidth: 'min-content',
    width: '100%',
    justifyContent: 'space-between'
});
