# Changelog

## [Unreleased]

### Added
- Note length control for sequencer steps
  - Individual note length control per step
  - Integration with existing step timing system
  - Enhanced playback precision for varied note lengths
  - Added swing
- Enhanced note mapping algorithm with:
  - Multiple coordinate system support (Cartesian, Spherical, Cylindrical)
  - Flexible distribution patterns (Linear, Exponential, Logarithmic, Sinusoidal)
  - Microtonal precision with cents offset
  - Dynamic scale modulation based on depth
  - Organic octave distribution using sine wave patterns
  - Backward compatible implementation with opt-in features

### Changed
- Improved UI component styling
  - Refined slider control layout
  - Enhanced typography and spacing
  - Better component organization

## [0.1.5] - 2025-02-03

### Added
- Added six new musical scales:
  - Dorian (minor scale with raised 6th)
  - Mixolydian (major scale with lowered 7th)
  - Blues (pentatonic with blue notes)
  - Harmonic Minor (minor scale with raised 7th)
  - Whole Tone (uses only whole steps)
  - Chromatic (all 12 notes)
- Enhanced step sequencer UI with improved visual feedback
  - Step buttons with dynamic highlighting for active state
  - Current step indicator with glow effect
  - Responsive layout with proper spacing and elevation
- Advanced timing coordination in sequencer engine
  - Precise BPM-aware subdivision calculations
  - Optimized note triggering with timing offsets
  - Improved state synchronization between UI and audio engine

### Changed
- Refined sequencer state management
  - Optimized row and step data structure
  - Improved step toggle and subdivision handling
  - Enhanced performance with memoized callbacks
  - Better state synchronization across components

## [0.1.4] - 2025-02-03

### Added
- New MicroTimingControl component for precise step timing adjustments
  - Supports fine-grained timing control with 1/128 note precision
  - Range of -8 to +8 steps (equivalent to -23 to +23 1/128 notes)
  - Real-time BPM-aware timing calculations
  - Visual feedback with increment/decrement controls
  - Simplified styling
- Multi-row step sequencer support
  - Independent step sequences per row
  - Synchronized playback across all rows
  - Individual timing control per row
  - Dynamic row management system

### Changed
- Enhanced sequencer architecture
  - Refactored state management for multiple sequences
  - Improved step timing coordination
  - Better row organization and layout
  - Responsive container sizing

## [0.1.3] - 2025-02-02

### Added
- New note mapping design documentation (docs/note-mapping-design.md)
- Enhanced note mapping system with advanced coordinate transformations
- Improved audio synthesis capabilities in AudioSynth.js
- Extended sequencer functionality for complex patterns

### Changed
- Refined AudioCore implementation for better performance
- Updated audio parameter management and store integration
- Enhanced fractal visualization synchronization with audio
- Improved sphere activation rendering and timing
- Updated global controls for new note mapping features
- Modified control configurations for expanded functionality

## [0.1.2] - 2025-02-02

### Added
- BaseControl component for standardized control behavior
- Control configurations centralized in controlConfigs.js

### Changed
- Enhanced audio core functionality with improved scheduling
- Updated audio management and sequencing capabilities
- Improved error boundary implementation
- Enhanced fractal visualization synchronization
- Refined slider control behavior
- Updated audio context and store management
- Reduced console logging across audio system for cleaner developer tools output

## [0.1.1] - 2025-02-02

### Added
- SelectControl component for dropdown-style selections
- SynthControlsPanel component for synth parameter adjustments
- Musical scale definitions in scales.js

### Changed
- Updated AudioManager with new synth control capabilities
- Modified TransportControls for improved playback control
- Updated FractalComponent to sync with new audio features
- Enhanced GlobalControlsPanel with additional parameters
- Improved audio store state management
- Updated transport store with new control features
- Refined note mapping and sphere activation timing

## [0.1.0] - 2025-02-02

### Added
- New documentation directory with architecture documentation
- Architecture diagrams for better project visualization
- Dedicated audio module for centralized audio processing
- State management directory for better organization of stores

### Changed
- Major project restructuring:
  - Moved all UI components to dedicated 'ui' directory
  - Reorganized components into logical subdirectories (Controls, Panels, shared)
  - Centralized audio-related code in 'audio' directory
  - Consolidated state management in 'state' directory
  - Improved code organization with clearer separation of concerns

### Removed
- Deprecated components directory structure
- Old utils directory in favor of more specific organization
- Unused TypeScript configuration
- Legacy scales.js from constants directory
