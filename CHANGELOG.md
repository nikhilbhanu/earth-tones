# Changelog

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

## [Unreleased]

### Added
- Enhanced note mapping algorithm with:
  - Multiple coordinate system support (Cartesian, Spherical, Cylindrical)
  - Flexible distribution patterns (Linear, Exponential, Logarithmic, Sinusoidal)
  - Microtonal precision with cents offset
  - Dynamic scale modulation based on depth
  - Organic octave distribution using sine wave patterns
  - Backward compatible implementation with opt-in features
