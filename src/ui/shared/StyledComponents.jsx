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
    padding: '12px 12px',
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
    display: 'flex',
    flexWrap: 'nowrap',
    minWidth: 'min-content',
    width: '100%',
    justifyContent: 'space-between',
    padding: '8px 4px 16px 4px', // Reduced bottom padding for better visual consistency
    '& > *': {
        flex: '1 0 auto',
        minWidth: '48px',
        maxWidth: '64px',
        marginRight: '4px',
        '&:last-child': {
            marginRight: 0
        }
    }
});
