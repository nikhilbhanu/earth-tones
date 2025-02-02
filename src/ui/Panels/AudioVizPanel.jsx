import React, { useEffect, useRef, memo, useCallback, useMemo, useState } from 'react';
import useTransportStore from '../../state/transportStore';
import useAudioStore from '../../state/audioStore';
import { Paper, styled, useTheme, Box, Typography, CircularProgress } from '@mui/material';

const VizContainer = styled(Paper)(({ theme }) => ({
    width: '100%',
    height: '100%',
    position: 'relative',
    background: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    boxShadow: theme.shadows[4],
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[8]
    }
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2)
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    padding: theme.spacing(3)
}));

const Canvas = styled('canvas')({
    width: '100%',
    height: '100%',
    display: 'block'
});

const AudioVizPanel = memo(() => {
    const { isPlaying } = useTransportStore();
    const { audioContext, analyserNode } = useAudioStore();
    const theme = useTheme();
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const previousTimeRef = useRef(0);
    const [error, setError] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // Memoize display dimensions calculation
    const getDisplayDimensions = useCallback(() => {
        if (!canvasRef.current) return null;
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            centerY: rect.height / 2,
            waveformHeight: rect.height * 0.6,
            width: rect.width
        };
    }, []);

    useEffect(() => {
        if (!audioContext || !analyserNode || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', {
            alpha: true,
            willReadFrequently: true
        });

        if (!ctx) {
            setError(new Error('Could not initialize visualization context'));
            return;
        }

        let resizeObserver;
        try {
            // Optimize canvas size
            const setCanvasSize = () => {
                const rect = canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
            };

            setCanvasSize();
            resizeObserver = new ResizeObserver(setCanvasSize);
            resizeObserver.observe(canvas);

            if (!analyserNode) {
                setError(new Error('Audio analyzer not available'));
                return () => {
                    if (resizeObserver) {
                        resizeObserver.disconnect();
                    }
                };
            }

            // Configure analyzer settings
            analyserNode.fftSize = 2048;
            analyserNode.smoothingTimeConstant = 0.5;
            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // Get actual display dimensions
            const getDisplayDimensions = () => {
                const rect = canvas.getBoundingClientRect();
                return {
                    centerY: rect.height / 2,
                    waveformHeight: rect.height * 0.6, // Scale of the waveform
                    width: rect.width
                };
            };
            const fps = 60;
            const frameInterval = 1000 / fps;

            const drawWaveform = (timestamp) => {
                const elapsed = timestamp - previousTimeRef.current;

                if (elapsed > frameInterval) {
                    previousTimeRef.current = timestamp - (elapsed % frameInterval);

                    analyserNode.getByteTimeDomainData(dataArray);

                    // Clear the canvas
                    ctx.fillStyle = theme.palette.background.default;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw the waveform
                    ctx.beginPath();
                    ctx.strokeStyle = theme.palette.primary.main;
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.8;

                    const { centerY, waveformHeight, width } = getDisplayDimensions();
                    const sliceWidth = width / bufferLength;
                    let x = 0;

                    for (let i = 0; i < bufferLength; i++) {
                        const v = dataArray[i] / 128.0 - 1; // Convert to range [-1, 1]
                        const y = centerY + v * (waveformHeight / 2);

                        if (i === 0) {
                            ctx.moveTo(x, y);
                        } else {
                            ctx.lineTo(x, y);
                        }

                        x += sliceWidth;
                    }

                    ctx.stroke();
                }

                animationFrameRef.current = requestAnimationFrame(drawWaveform);
            };

            // Use RAF only when component is mounted and visible
            if (document.visibilityState === 'visible') {
                animationFrameRef.current = requestAnimationFrame(drawWaveform);
            }
        } catch (err) {
            setError(err);
            console.error('Visualization error:', err);
        }

        // Add visibility change listener
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            } else if (document.visibilityState === 'visible') {
                animationFrameRef.current = requestAnimationFrame(drawWaveform);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [audioContext, analyserNode, isPlaying, theme]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (error) {
        return (
            <VizContainer elevation={3}>
                <ErrorContainer>
                    <Typography variant="h6" color="error" gutterBottom>
                        Visualization Error
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {error.message}
                    </Typography>
                </ErrorContainer>
            </VizContainer>
        );
    }

    if (isInitializing) {
        return (
            <VizContainer elevation={3}>
                <LoadingContainer>
                    <CircularProgress size={40} />
                    <Typography variant="subtitle2" color="text.secondary">
                        Initializing Audio Visualization
                    </Typography>
                </LoadingContainer>
            </VizContainer>
        );
    }

    return (
        <VizContainer
            elevation={3}
            role="region"
            aria-label="Audio Visualization"
        >
            <Canvas ref={canvasRef} />
        </VizContainer>
    );
});

AudioVizPanel.displayName = 'AudioVizPanel';

export default AudioVizPanel;
