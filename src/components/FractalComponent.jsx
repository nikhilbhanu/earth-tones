import React, { useRef, useMemo, useEffect, useState } from 'react';
import useTransportStore from '../stores/transportStore';
import useVisualizationStore from '../stores/visualizationStore';
import useAudioStore from '../stores/audioStore';
import { initializeSphereActivationClock } from '../utils/audio/sphereActivationClock';
import { useFrame } from '@react-three/fiber';
import { createMengerSponge } from '../utils/geometry';
import { mapSpongeToNotes } from '../utils/audio/noteMapping';
import SphereActivation from './SphereActivation';
import audioManager from '../utils/audio/AudioManager';

const FractalComponent = React.memo(() => {
    const { isPlaying, bpm } = useTransportStore();
    const { scale, frequency, rotationSpeed, baseOpacity } = useVisualizationStore();
    const {
        cubeSamplingRate,
        numberOfNotes,
        scaleType,
        baseFrequency,
        octaveRange,
        curvature
    } = useAudioStore();
    const groupRef = useRef();
    const frameRef = useRef();
    const clockRef = useRef(null);
    const [activeSpheres, setActiveSpheres] = useState(new Set());

    // Memoize cube generation, note mapping, and properties
    const { cubes, cubeProperties } = useMemo(() => {
        const depth = 2; // Fixed depth for now
        const generatedCubes = createMengerSponge(depth, scale);
        const cubesWithNotes = mapSpongeToNotes(generatedCubes, depth, {
            scaleType,
            baseFrequency,
            octaveRange,
            curvature
        });
        console.log('Initial cube note mapping:', JSON.stringify(cubesWithNotes.map((cube, i) => ({
            index: i,
            noteNumber: cube.noteNumber,
            position: cube.position
        })), null, 2));

        const properties = cubesWithNotes.map(cube => {
            // Calculate hue based on note number (0-127 to 0-360 degrees)
            const hue = (cube.noteNumber / 127) * 360;
            const color = `hsl(${hue}, 70%, 50%)`;

            return {
                noteNumber: cube.noteNumber,
                color: color,
                baseOpacity: 0.5,
                material: {
                    metalness: 0.5,
                    roughness: 0.2,
                    emissiveIntensity: 0.5
                }
            };
        });

        return { cubes: cubesWithNotes, cubeProperties: properties };
    }, [scale, scaleType, baseFrequency, octaveRange, curvature]);

    // Initialize or reinitialize sphere activation clock when needed
    useEffect(() => {
        // Cleanup existing clock
        if (clockRef.current) {
            clockRef.current.cleanup();
            clockRef.current = null;
        }

        if (!cubes.length) return;

        // Initialize new clock with updated cube mappings
        const clock = initializeSphereActivationClock(cubes);
        clockRef.current = clock;

        // Set up interval to check for active sphere changes only if clock exists
        const intervalId = setInterval(() => {
            if (clockRef.current) {
                const newActiveSpheres = clockRef.current.getActiveSpheres();
                setActiveSpheres(prevSpheres => {
                    const newSet = new Set(newActiveSpheres);
                    // Only update if there's an actual change
                    if (newSet.size !== prevSpheres.size ||
                        [...newSet].some(sphere => !prevSpheres.has(sphere))) {
                        // Get active sphere objects with note numbers
                        const activeSphereObjects = [...newSet].map(index => {
                            const noteNumber = cubes[index].noteNumber;
                            console.log(`Active sphere update - Index: ${index}, Note: ${noteNumber}, Position:`, JSON.stringify(cubes[index].position));
                            return { noteNumber };
                        });
                        // Update audio manager with active sphere notes
                        console.log('Sending to AudioManager:', JSON.stringify(activeSphereObjects.map(obj => obj.noteNumber)));
                        audioManager.updateActiveSphereNotes(activeSphereObjects);
                        return newSet;
                    }
                    return prevSpheres;
                });
            }
        }, 16); // ~60fps

        frameRef.current = intervalId;

        return () => {
            if (frameRef.current) {
                clearInterval(frameRef.current);
                frameRef.current = null;
            }
            if (clockRef.current) {
                clockRef.current.cleanup();
                clockRef.current = null;
            }
        };
    }, [cubes.length, scaleType, baseFrequency, octaveRange, curvature]); // Re-run when note mapping parameters change

    // Update clock parameters when they change
    useEffect(() => {
        if (!clockRef.current || !cubes.length) return;

        // Store current active spheres
        const currentActiveSpheres = clockRef.current.getActiveSpheres();

        // Update cube sampling parameters
        const audioStore = useAudioStore.getState();
        audioStore.setCubeSamplingRate(cubeSamplingRate);
        audioStore.setNumberOfNotes(numberOfNotes);

        // Restore active spheres
        setActiveSpheres(new Set(currentActiveSpheres));
    }, [cubeSamplingRate, numberOfNotes, bpm]);

    // Animation frame handler
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Update rotation based on frequency
        if (isPlaying) {
            const speedMultiplier = frequency / 20;
            groupRef.current.rotation.y += rotationSpeed * speedMultiplier;
            groupRef.current.rotation.x += (rotationSpeed * 0.5) * speedMultiplier;
        }

    });


    return (
        <group ref={groupRef}>
            {cubes.map((cube, index) => {
                const isActive = activeSpheres.has(index);
                const props = cubeProperties[index];

                return (
                    <SphereActivation
                        key={index}
                        position={cube.position}
                        scale={cube.scale}
                        isActive={isActive}
                        color={props.color}
                        baseOpacity={baseOpacity}
                        material={props.material}
                        noteNumber={props.noteNumber}
                    />
                );
            })}
        </group>
    );
});


FractalComponent.displayName = 'FractalComponent';

export default FractalComponent;
