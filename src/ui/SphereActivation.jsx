import React from 'react';
import { Sphere } from '@react-three/drei';

const SphereActivation = React.memo(({
    position,
    scale,
    isActive,
    color,
    baseOpacity,
    material,
    noteNumber,
    cents = 0
}) => {
    return (
        <Sphere
            args={[scale * 0.8, 32, 32]}
            position={position}
        >
            <meshStandardMaterial
                color={isActive ? "#ffffff" : color}
                metalness={material.metalness}
                roughness={material.roughness}
                emissive={isActive ? "#ffffff" : color}
                emissiveIntensity={isActive ? 2 : material.emissiveIntensity}
                transparent={true}
                opacity={baseOpacity}
            >
                <primitive attach="userData" object={{ noteNumber, cents }} />
            </meshStandardMaterial>
        </Sphere>
    );
});

SphereActivation.displayName = 'SphereActivation';

export default SphereActivation;
