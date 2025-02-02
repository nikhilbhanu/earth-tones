import React from 'react';
import { Box, CircularProgress, Typography, styled, alpha } from '@mui/material';
import { COLORS } from '../constants/colors';

const OverlayContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: alpha(COLORS.background.primary, 0.9),
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    gap: '16px',
});

const LoadingOverlay = ({ message }) => (
    <OverlayContainer>
        <CircularProgress size={48} />
        <Typography variant="h6" color="white">
            {message}
        </Typography>
    </OverlayContainer>
);

export default LoadingOverlay;
