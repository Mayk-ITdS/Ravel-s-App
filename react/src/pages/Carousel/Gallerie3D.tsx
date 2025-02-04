import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
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

  // Wczytujemy tekstury statycznie
  const textures = React.useMemo(() => {
    try {
      return images.map((src) => new THREE.TextureLoader().load(src));
    } catch (error) {
      console.error("Error loading texture:", error);
      return [];
    }
  }, [images]);

  useFrame(() => {
    if (groupRef.current) {
      const targetRotation = (activeIndex * -(Math.PI * 2)) / images.length;
      groupRef.current.rotation.y +=
        (targetRotation - groupRef.current.rotation.y) * 0.1;
    }
  });

  return (
    <>
      {/* Dodajemy oświetlenie */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <group ref={groupRef}>
        {images.map((_, index) => {
          const angle = (index / images.length) * Math.PI * 2;
          const x = Math.cos(angle) * 5;
          const z = Math.sin(angle) * 5;

          return (
            <group key={index}>
              <mesh position={[x, 0, z]}>
                <planeGeometry args={[3, 2]} />
                <meshStandardMaterial
                  map={textures[index]}
                  side={THREE.DoubleSide} // Ustawienie widoczności z obu stron
                />
              </mesh>
              <Html position={[x, -1.5, z]} center transform>
                <Button
                  onClick={() => onDeleteImage(index)}
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{
                    fontSize: "0.75rem",
                    padding: "5px",
                    backgroundColor: "#490D2D",
                    color: "#E5B05E",
                    "&:hover": {
                      backgroundColor: "#6F1B43",
                    },
                  }}
                >
                  Usuń
                </Button>
              </Html>
            </group>
          );
        })}
        <OrbitControls makeDefault enableZoom={false} enablePan={false} />
      </group>
    </>
  );
};

export { Gallerie3D };
