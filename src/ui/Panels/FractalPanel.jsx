import React, { Suspense, memo } from 'react';
import useTransportStore from '../../state/transportStore';
import useVisualizationStore from '../../state/visualizationStore';
import { styled, CircularProgress, Box, Typography, useTheme } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import FractalComponent from '../FractalComponent';
import ErrorBoundary from '../ErrorBoundary';

const CanvasContainer = styled('div')(({ theme }) => ({
    gridArea: 'fractal',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    background: '#000',
    zIndex: 0,
    transition: 'all 0.3s ease-in-out'
}));

const LoadingFallback = () => (
    <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
        }}
    >
        <CircularProgress size={40} />
        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
            Loading 3D Scene...
        </Typography>
    </Box>
);

const ErrorFallback = () => (
    <Box
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            p: 3
        }}
    >
        <Typography variant="h6" sx={{ color: 'error.main', mb: 1 }}>
            Error Loading 3D Scene
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Please try refreshing the page
        </Typography>
    </Box>
);

const FractalPanel = memo(() => {
    const theme = useTheme();
    const { isPlaying, bpm } = useTransportStore();
    const { scale, steps, frequency } = useVisualizationStore();
    return (
        <ErrorBoundary fallback={<ErrorFallback />}>
            <CanvasContainer>
                <Canvas
                    gl={{
                        antialias: true,
                        alpha: false,
                        powerPreference: 'high-performance',
                        stencil: false,
                        depth: true
                    }}
                    dpr={[1, 2]} // Adaptive resolution
                    performance={{ min: 0.5 }} // Allow frame drops for better performance
                    onCreated={({ gl }) => {
                        gl.setClearColor('#000000');
                    }}
                >
                    <PerspectiveCamera
                        makeDefault
                        position={[3, 3, 3]}
                        fov={75}
                        near={0.1}
                        far={1000}
                    />
                    <Suspense fallback={<LoadingFallback />}>
                        <ambientLight intensity={0.6} />
                        <pointLight position={[10, 10, 10]} intensity={1.2} castShadow />
                        <hemisphereLight
                            intensity={0.3}
                            groundColor={theme.palette.primary.dark}
                        />
                        <FractalComponent />
                    </Suspense>
                    <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                        zoomSpeed={0.6}
                        rotateSpeed={0.5}
                        minDistance={2}
                        maxDistance={20}
                        enableDamping={true}
                        dampingFactor={0.05}
                    />
                </Canvas>
            </CanvasContainer>
        </ErrorBoundary>
    );
});

FractalPanel.displayName = 'FractalPanel';

export default FractalPanel;
