import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const seededPoint = (index, axis) => {
    const value = Math.sin((index + 1) * (axis + 2) * 12.9898) * 43758.5453;
    return ((value - Math.floor(value)) - 0.5) * 20;
};

const Particles = ({ count = 500 }) => {
    const points = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = seededPoint(i, 0);
            const y = seededPoint(i, 1);
            const z = seededPoint(i, 2);
            temp.push(x, y, z);
        }
        return new Float32Array(temp);
    }, [count]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        points.current.rotation.y = time * 0.05;
        points.current.rotation.x = time * 0.02;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#ff6a00"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};

const ParticleBackground = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)'
        }}>
            <Canvas camera={{ position: [0, 0, 10] }}>
                <Particles />
            </Canvas>
        </div>
    );
};

export default ParticleBackground;
