# Changelog

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
