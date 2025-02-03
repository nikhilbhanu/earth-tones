import { styled, Box, ThemeProvider, alpha, Snackbar, Alert } from '@mui/material';
import { useEffect, useRef, memo, useState, useCallback, useMemo } from 'react';
import logo from './assets/earth-tones-logo.svg';
import useTransportStore from './state/transportStore';
import useVisualizationStore from './state/visualizationStore';
import useAudioStore from './state/audioStore';
import useSequencerStore from './state/sequencerStore';
import useAudioParametersStore from './state/audioParametersStore';
import { useAudioManager } from './audio/useAudioManager';
import FractalPanel from './ui/Panels/FractalPanel';
import TransportControls from './ui/Controls/TransportControls';
import AudioVizPanel from './ui/Panels/AudioVizPanel';
import StepSequencerPanel from './ui/Panels/StepSequencerPanel';
import GlobalControlsPanel from './ui/Panels/GlobalControlsPanel';
import StepControlsPanel from './ui/Panels/StepControlsPanel';
import SynthControlsPanel from './ui/Panels/SynthControlsPanel';
import { useKeyboardShortcuts } from './audio/useKeyboardShortcuts';
import LoadingOverlay from './ui/LoadingOverlay';
import theme from './theme';
import { COLORS } from './constants/colors';

const Logo = styled('img')({
  position: 'fixed',
  top: '20px',
  left: '20px',
  zIndex: 1000,
  height: '48px',
  width: 'auto',
});

const AppContainer = styled('div')({
  width: '100vw',
  height: '100vh',
  background: COLORS.background.primary,
  overflow: 'hidden',
  display: 'grid',
  gridTemplate: `
    "transport transport transport" auto
    "viz main controls" 1fr
    "viz sequencer controls" auto
    / minmax(250px, 250px) 1fr minmax(250px, 250px)
  `,
  gap: '16px',
  padding: '16px',
});

const Panel = styled(Box)(({ theme }) => ({
  background: COLORS.background.elevated,
  borderRadius: theme.shape.borderRadius,
  padding: '12px',
  border: `1px solid ${COLORS.background.elevated}`,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const TransportPanel = styled(Panel)({
  gridArea: 'transport',
  display: 'flex',
  justifyContent: 'center',
  backdropFilter: 'blur(8px)',
  background: alpha(COLORS.background.elevated, 0.9),
  maxWidth: '576px',
  margin: '0 auto',
  padding: 0
});

const MainPanel = styled(Panel)({
  gridArea: 'main',
  position: 'relative',
  minHeight: '400px',
});

const VisualizerPanel = styled(Panel)({
  gridArea: 'viz',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const ControlsPanel = styled(Panel)({
  gridArea: 'controls',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const SequencerPanel = styled(Panel)({
  gridArea: 'sequencer',
  background: alpha(COLORS.background.elevated, 0.95),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(COLORS.background.elevated, 0.3)}`,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  '& > *': {
    flex: '1 1 auto',
    minHeight: '120px'
  }
});

const App = () => {
  // Track essential sequencer state
  const [rows, setRows] = useState(useSequencerStore.getState().rows);
  const [currentStep, setCurrentStep] = useState(useSequencerStore.getState().currentStep);
  const [numberOfNotes, setNumberOfNotes] = useState(useAudioParametersStore.getState().numberOfNotes);
  const [isPlaying, setIsPlaying] = useState(useTransportStore.getState().isPlaying);

  // Track UI state for error handling
  const [audioState, setAudioState] = useState({
    isLoading: useAudioStore.getState().isLoading,
    error: useAudioStore.getState().error,
    clearError: useAudioStore.getState().clearError
  });

  // Memoize store actions
  const toggleStep = useCallback((...args) => useSequencerStore.getState().toggleStep(...args), []);
  const setSubdivision = useCallback((...args) => useSequencerStore.getState().setSubdivision(...args), []);
  const addRow = useCallback(() => useSequencerStore.getState().addRow(), []);
  const removeRow = useCallback((id) => useSequencerStore.getState().removeRow(id), []);

  // Subscribe to essential state changes
  useEffect(() => {
    const unsubscribe = [
      useSequencerStore.subscribe(state => {
        setRows(state.rows);
        setCurrentStep(state.currentStep);
      }),
      useAudioParametersStore.subscribe(state => {
        setNumberOfNotes(state.numberOfNotes);
      }),
      useAudioStore.subscribe(state => {
        setAudioState({
          isLoading: state.isLoading,
          error: state.error,
          clearError: state.clearError
        });
      }),
      useTransportStore.subscribe(state => {
        setIsPlaying(state.isPlaying);
      })
    ];

    return () => unsubscribe.forEach(unsub => unsub());
  }, []);

  // Update rows when number of notes changes
  useEffect(() => {
    const rowDiff = numberOfNotes - rows.length;
    if (rowDiff > 0) {
      // Add missing rows
      Array(rowDiff).fill().forEach(() => addRow());
    } else if (rowDiff < 0) {
      // Remove extra rows from the end
      Array(-rowDiff).fill().forEach((_, i) =>
        removeRow(rows.length - 1 - i)
      );
    }
  }, [addRow, removeRow, rows.length, numberOfNotes]);

  // Initialize audio and keyboard shortcuts
  useAudioManager();
  useKeyboardShortcuts();

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Logo src={logo} alt="Earth Tones" />
        {audioState.isLoading && <LoadingOverlay message="Initializing Audio..." />}
        <Snackbar
          open={!!audioState.error}
          autoHideDuration={6000}
          onClose={audioState.clearError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={audioState.clearError}>
            {audioState.error}
          </Alert>
        </Snackbar>
        <TransportPanel>
          <TransportControls />
        </TransportPanel>

        <VisualizerPanel>
          <AudioVizPanel />
          <GlobalControlsPanel />
        </VisualizerPanel>

        <MainPanel>
          <FractalPanel />
        </MainPanel>

        <ControlsPanel>
          <SynthControlsPanel />
          <StepControlsPanel />
        </ControlsPanel>

        <SequencerPanel>
          {useMemo(() =>
            rows.map(row => (
              <StepSequencerPanel
                key={row.id}
                rowId={row.id}
                steps={row.steps}
                currentStep={currentStep}
                isPlaying={isPlaying}
                onToggleStep={toggleStep}
                onSetSubdivision={setSubdivision}
              />
            )),
            [rows, currentStep, isPlaying]
          )}
        </SequencerPanel>
      </AppContainer>
    </ThemeProvider>
  );
};

export default memo(App);
