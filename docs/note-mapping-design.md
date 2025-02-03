# Enhanced Note Mapping Algorithm Design

## Overview
The enhanced note mapping system transforms 3D spatial coordinates into musical notes with increased sophistication through multiple coordinate systems, microtonal precision, and dynamic scale modulation.

## Core Components

### 1. Coordinate Systems
- **Cartesian (x,y,z)**: Default system, uses sum of absolute coordinates
- **Spherical (r,θ,φ)**:
  - Radius (r) → amplitude/velocity
  - Azimuth (θ) → note selection
  - Elevation (φ) → microtonal variation
- **Cylindrical (r,θ,h)**:
  - Radius (r) → octave selection
  - Azimuth (θ) → note selection
  - Height (h) → scale degree weighting

### 2. Distribution Patterns
- **Linear**: Direct 1:1 mapping (default)
- **Exponential**: Emphasizes lower values, spreads out higher ones
- **Logarithmic**: More resolution in lower ranges
- **Sinusoidal**: Smooth cyclic distribution with natural clustering

### 3. Microtonal System
- Base note selection from scale/mode
- Cents offset (-50 to +50)
- Continuous interpolation between scale degrees
- Position-based microtuning for expressive pitch bending

### 4. Depth-Based Modulation
- **Scale Modulation**: Cycles through available modes based on depth
- **Octave Distribution**: Sine wave pattern for organic octave changes
- **Mode Transitions**: Smooth crossfading between adjacent modes

## Algorithm Flow

1. **Input Processing**
   ```
   position (x,y,z) → coordinate system conversion → normalized position (0-1)
   ```

2. **Distribution Mapping**
   ```
   normalized position → distribution function → mapped value
   ```

3. **Note Selection**
   ```
   mapped value → scale index → base note
   fractional remainder → microtonal offset
   ```

4. **Depth Processing**
   ```
   depth → octave shift
   depth → mode selection
   ```

5. **Final Output**
   ```
   {
     noteNumber: 0-127 (MIDI standard)
     cents: -50 to +50 (microtonal offset)
   }
   ```

## Benefits

- More musical 3D space mapping
- Increased expressiveness through microtonality
- Natural-feeling note progressions
- Rich harmonic possibilities through mode cycling
- Flexible distribution patterns for different musical contexts

## Implementation Notes

- Maintains backward compatibility with existing parameters
- All new features are opt-in through parameters
- Computationally efficient coordinate transformations
- Smooth interpolation between all musical parameters
