import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import SliderControl from '../Controls/SliderControl';
import SelectControl from '../Controls/SelectControl';
import { styled } from '@mui/material/styles';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ScaleIcon from '@mui/icons-material/Piano';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import FunctionsIcon from '@mui/icons-material/Functions';
import TuneIcon from '@mui/icons-material/Tune';
import LayersIcon from '@mui/icons-material/Layers';
import { COLORS } from '../../constants/colors';
import useAudioStore from '../../state/audioStore';
import useAudioParametersStore from '../../state/audioParametersStore';
import { SCALES } from '../../audio/scales';
import { COORDINATE_SYSTEMS, DISTRIBUTION_PATTERNS } from '../../constants/controlConfigs';

// Using default MUI Slider styling from theme.js

const CompactIconButton = styled(IconButton)({
    padding: '2px',
    '& .MuiSvgIcon-root': {
        fontSize: '1rem',
    },
});

const GlobalControlsPanel = () => {
    const { masterVolume, setMasterVolume } = useAudioStore();
    const {
        cubeSamplingRate,
        setCubeSamplingRate,
        numberOfNotes,
        setNumberOfNotes,
        scaleType,
        setScaleType,
        baseFrequency,
        setBaseFrequency,
        octaveRange,
        setOctaveRange,
        curvature,
        setCurvature,
        coordinateSystem,
        setCoordinateSystem,
        distribution,
        setDistribution,
        enableMicrotonal,
        setEnableMicrotonal,
        enableDepthModulation,
        setEnableDepthModulation
    } = useAudioParametersStore();

    return (
        <Box sx={{ height: '100%', width: '100%', p: 0.5 }}>
            <Stack spacing={0.5} sx={{ width: '100%' }}>
                {/* Master Volume Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25 }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <VolumeUpIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Master Volume
                        </Typography>
                    </Box>
                    <SliderControl
                        value={masterVolume * 100} // Convert 0-1 to 0-100
                        aria-label="Master Volume"
                        valueLabelDisplay="auto"
                        onChange={(_, value) => setMasterVolume(value / 100)}
                    />
                </Box>

                {/* Cube Sampling Rate Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <SpeedIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Cube Sampling Rate (BPM)
                        </Typography>
                    </Box>
                    <SliderControl
                        value={cubeSamplingRate}
                        onChange={(_, value) => setCubeSamplingRate(value)}
                        min={30}
                        max={600}
                        step={1}
                        aria-label="Cube Sampling Rate (BPM)"
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value} BPM`}
                    />
                </Box>

                {/* Number of Notes Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <MusicNoteIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Number of Notes
                        </Typography>
                    </Box>
                    <SliderControl
                        value={numberOfNotes}
                        onChange={(_, value) => setNumberOfNotes(value)}
                        min={1}
                        max={4}
                        step={1}
                        marks
                        aria-label="Number of Notes"
                        valueLabelDisplay="auto"
                    />
                </Box>

                {/* Scale Type Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <ScaleIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Scale Type
                        </Typography>
                    </Box>
                    <SelectControl
                        sx={{ mb: 0.75 }}
                        value={scaleType}
                        onChange={(e) => setScaleType(e.target.value)}
                        options={Object.entries(SCALES).map(([value, scale]) => ({
                            value,
                            label: scale.name
                        }))}
                        aria-label="Scale Type"
                    />
                </Box>

                {/* Base Frequency Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <MusicNoteIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Base Frequency (Hz)
                        </Typography>
                    </Box>
                    <SliderControl
                        value={baseFrequency}
                        onChange={(_, value) => setBaseFrequency(value)}
                        min={20}
                        max={2000}
                        step={1}
                        aria-label="Base Frequency"
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value} Hz`}
                    />
                </Box>

                {/* Octave Range Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <MusicNoteIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Octave Range
                        </Typography>
                    </Box>
                    <SliderControl
                        value={octaveRange}
                        onChange={(_, value) => setOctaveRange(value)}
                        min={1}
                        max={8}
                        step={1}
                        marks
                        aria-label="Octave Range"
                        valueLabelDisplay="auto"
                    />
                </Box>

                {/* Curvature Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <SpeedIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Note Distribution Curve
                        </Typography>
                    </Box>
                    <SliderControl
                        value={curvature}
                        onChange={(_, value) => setCurvature(value)}
                        min={0}
                        max={1}
                        step={0.01}
                        aria-label="Note Distribution Curve"
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => value.toFixed(2)}
                    />
                </Box>

                {/* Coordinate System Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <ThreeDRotationIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Coordinate System
                        </Typography>
                    </Box>
                    <SelectControl
                        value={coordinateSystem}
                        onChange={(e) => setCoordinateSystem(e.target.value)}
                        options={Object.entries(COORDINATE_SYSTEMS).map(([value, label]) => ({
                            value,
                            label
                        }))}
                        aria-label="Coordinate System"
                    />
                </Box>

                {/* Distribution Pattern Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <FunctionsIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Distribution Pattern
                        </Typography>
                    </Box>
                    <SelectControl
                        value={distribution}
                        onChange={(e) => setDistribution(e.target.value)}
                        options={Object.entries(DISTRIBUTION_PATTERNS).map(([value, label]) => ({
                            value,
                            label
                        }))}
                        aria-label="Distribution Pattern"
                    />
                </Box>

                {/* Microtonal Toggle Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <TuneIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Microtonal
                        </Typography>
                    </Box>
                    <SelectControl
                        value={enableMicrotonal}
                        onChange={(e) => setEnableMicrotonal(e.target.value === 'true')}
                        options={[
                            { value: 'false', label: 'Off' },
                            { value: 'true', label: 'On' }
                        ]}
                        aria-label="Enable Microtonal"
                    />
                </Box>

                {/* Depth Modulation Toggle Section */}
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.25, width: '100%' }}>
                        <CompactIconButton sx={{ color: COLORS.primary }}>
                            <LayersIcon />
                        </CompactIconButton>
                        <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                            Depth Modulation
                        </Typography>
                    </Box>
                    <SelectControl
                        value={enableDepthModulation}
                        onChange={(e) => setEnableDepthModulation(e.target.value === 'true')}
                        options={[
                            { value: 'false', label: 'Off' },
                            { value: 'true', label: 'On' }
                        ]}
                        aria-label="Enable Depth Modulation"
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default GlobalControlsPanel;
