import { styled, Box, ThemeProvider, alpha, Snackbar, Alert } from '@mui/material';
import { useEffect } from 'react';
import logo from './assets/earth-tones-logo.svg';
import useTransportStore from './stores/transportStore';
import useVisualizationStore from './stores/visualizationStore';
import useAudioStore from './stores/audioStore';
import FractalPanel from './components/panels/FractalPanel';
import TransportControls from './components/controls/TransportControls';
import AudioVizPanel from './components/panels/AudioVizPanel';
import StepSequencerPanel from './components/panels/StepSequencerPanel';
import GlobalControlsPanel from './components/panels/GlobalControlsPanel';
import StepControlsPanel from './components/panels/StepControlsPanel';
import { useKeyboardShortcuts } from './utils/hooks/useKeyboardShortcuts';
import LoadingOverlay from './components/LoadingOverlay';
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
    / minmax(180px, 250px) 1fr minmax(180px, 250px)
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
  padding: 0,
  display: 'flex',
  justifyContent: 'stretch',
  width: '100%',
  marginTop: '-8px'
});

function App() {
  const { isPlaying } = useTransportStore();
  const { isLoading, error, clearError, initializeAudio } = useAudioStore();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();


  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Logo src={logo} alt="Earth Tones" />
        {isLoading && <LoadingOverlay message="Initializing Audio..." />}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={clearError}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={clearError}>
            {error}
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
          <StepControlsPanel />
        </ControlsPanel>

        <SequencerPanel>
          <StepSequencerPanel />
        </SequencerPanel>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
