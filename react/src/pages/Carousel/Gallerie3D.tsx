import React, { useRef, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@mui/material";

interface Gallerie3DProps {
  images: string[];
  onDeleteImage: (index: number) => void;
  activeIndex: number;
}

const Gallerie3D: React.FC<Gallerie3DProps> = ({
  images,
  onDeleteImage,
  activeIndex,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        (activeIndex * -(Math.PI * 2)) / images.length;
    }
  });

  return (
    <group ref={groupRef}>
      {images.map((src, index) => {
        console.log(images);
        const angle = (index / images.length) * Math.PI * 2;
        const x = Math.cos(angle) * 5;
        const z = Math.sin(angle) * 5;
        const texture = useLoader(THREE.TextureLoader, src);

        useEffect(() => {
          return () => {
            texture.dispose(); // Zwolnienie pamięci
          };
        }, [texture]);

        return (
          <group key={index}>
            <mesh position={[x, 0, z]}>
              <planeGeometry args={[3, 2]} />
              <meshStandardMaterial map={texture} />
            </mesh>
            <Html position={[x, -1.5, z]} center>
              <Button
                onClick={() => onDeleteImage(index)}
                variant="contained"
                color="error"
                size="small"
                sx={{ fontSize: "0.75rem", padding: "5px" }}
              >
                Usuń
              </Button>
            </Html>
          </group>
        );
      })}
      <OrbitControls makeDefault enableZoom={false} enablePan={false} />
    </group>
  );
};

export { Gallerie3D };
