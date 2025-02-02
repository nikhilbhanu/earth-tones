# Earth Tones Architecture Documentation

## System Overview

Earth Tones is a web-based audio-visual application that combines 3D visualization with generative music. The system transforms spatial coordinates into musical notes while providing an interactive visual experience synchronized with audio playback.

## Core Architecture

The application is built using a modern React-based architecture with the following key layers:

### 1. Core Application Layer
- **App Container**: Main application entry point managing global state and layout
- **Error Boundary**: Global error handling and graceful degradation
- **Loading Overlay**: Manages loading states and initialization feedback

### 2. State Management
The application uses Zustand for state management, divided into three main stores:

- **AudioStore**:
  - Manages audio state and synthesis parameters
  - Controls audio routing and processing
  - Handles note triggering and parameter changes

- **TransportStore**:
  - Controls playback state (play/pause/stop)
  - Manages timing and synchronization
  - Handles tempo and time signature settings

- **VisualizationStore**:
  - Manages 3D visualization state
  - Controls visual parameters and animations
  - Handles user interaction with visual elements

### 3. UI Component Architecture

#### Visualization Components
- **FractalComponent**: Core 3D visualization using WebGL
- **SphereActivation**: Handles note trigger visualization
- **SyncedAnimation**: Manages animation synchronization with audio

#### Control Panels
- **FractalPanel**: Main visualization controls
- **AudioVizPanel**: Audio visualization and monitoring
- **GlobalControlsPanel**: Application-wide settings
- **StepSequencerPanel**: Pattern sequencing interface
- **SynthControlsPanel**: Synthesis parameter controls
- **StepControlsPanel**: Individual step parameter controls

#### Basic Controls
- **TransportControls**: Playback control interface
- **SelectControl**: Reusable dropdown component
- **SliderControl**: Reusable parameter slider

### 4. Audio System

#### Core Audio Components
- **AudioManager**:
  - Central audio processing unit
  - Manages Web Audio API context
  - Handles audio scheduling and routing

- **ClockSync**:
  - Coordinates timing between audio and visual systems
  - Manages precise scheduling of events

- **SphereActivationClock**:
  - Synchronizes visual sphere activations with audio events
  - Handles timing offsets and compensation

#### Audio Libraries Integration
- **Tone.js**: Primary synthesis engine
- **Web Audio API**: Low-level audio processing

### 5. Note Mapping System

The note mapping system transforms 3D spatial coordinates into musical notes through a sophisticated algorithm:

#### Coordinate Systems
- **Cartesian (x,y,z)**: Default system for direct mapping
- **Spherical (r,θ,φ)**: Maps radius to amplitude, angles to notes
- **Cylindrical (r,θ,h)**: Maps radius to octaves, height to scale degrees

#### Musical Parameters
- **Distribution Patterns**:
  - Linear (1:1 mapping)
  - Exponential (emphasis on lower values)
  - Logarithmic (higher resolution in lower ranges)
  - Sinusoidal (smooth cyclic distribution)

- **Microtonal System**:
  - Base note selection from scales/modes
  - Cents offset (-50 to +50)
  - Continuous interpolation between notes
  - Position-based microtuning

#### Depth-Based Modulation
- Scale/mode cycling based on depth
- Sine wave pattern for octave distribution
- Smooth transitions between modes

### 6. Utility Layer

#### Core Utilities
- **Geometry**: 3D mathematical calculations and transformations
- **NoteMapping**: Note generation and musical calculations

#### Custom Hooks
- **useAudioManager**: Audio system integration hook
- **useClockSync**: Timing synchronization hook
- **useKeyboardShortcuts**: Global keyboard control hook

## Data Flow

1. User interactions trigger state changes in stores
2. State updates flow to audio and visual components
3. AudioManager schedules and processes audio events
4. Visual components sync with audio through ClockSync
5. SphereActivation provides visual feedback for notes
6. Note mapping system translates positions to musical events

## Technical Stack

- **Frontend**: React
- **State Management**: Zustand
- **Audio**: Tone.js + Web Audio API
- **Visualization**: WebGL
- **Build System**: Vite
- **Language**: TypeScript/JavaScript

## Performance Considerations

1. **Audio Timing**
   - Precise scheduling using Web Audio API clock
   - Lookahead scheduling for smooth playback
   - Buffer management for optimal performance

2. **Visual Performance**
   - WebGL optimization for 3D rendering
   - RAF (RequestAnimationFrame) synchronization
   - Efficient state updates to prevent re-renders

3. **State Management**
   - Selective store subscriptions
   - Batched updates for performance
   - Memoization of complex calculations

## Future Extensibility

The architecture supports future enhancements through:

1. **Modular Component Design**
   - Easy addition of new control panels
   - Pluggable visualization components
   - Extensible audio processing chain

2. **Flexible Note Mapping**
   - Support for new coordinate systems
   - Additional distribution patterns
   - Extended musical parameter mapping

3. **Audio System**
   - Additional synthesis methods
   - External audio input processing
   - Advanced audio analysis features
