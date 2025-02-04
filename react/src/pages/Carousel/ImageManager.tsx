import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { AddImageDialog } from "./AddImageDialog";
import { Canvas } from "@react-three/fiber";
import { Gallerie3D } from "./Gallerie3D";
import ravelBckg from "../../assets/ravelBckg.webp";
import ravel1 from "../../assets/ravel1.png";
import ravel3 from "../../assets/ravel3.jpg";
import ravel4 from "../../assets/ravel4.jpg";
const ImageManager: React.FC = () => {
  const [images, setImages] = useState<string[]>([
    ravelBckg,
    ravel1,
    ravel3,
    ravel4,
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddImage = (imageUrl: string) => {
    if (imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      setImages((prev) => [...prev, imageUrl]);
      setIsDialogOpen(false);
    } else {
      alert("Invalid image URL. Please use a valid image link.");
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setActiveIndex((prevIndex) =>
      prevIndex >= index ? Math.max(0, prevIndex - 1) : prevIndex
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <Box sx={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Galeria 3D
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#490D2D",
          color: "#E5B05E",
          "&:hover": { backgroundColor: "#6F1B43" },
          marginBottom: 2,
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        Dodaj obraz
      </Button>
      <Box
        sx={{
          width: "100%",
          height: "800px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Gallerie3D
            images={images}
            onDeleteImage={handleDeleteImage}
            activeIndex={activeIndex}
          />
        </Canvas>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            marginRight: 2,
            borderColor: "#490D2D",
            color: "#490D2D",
            "&:hover": { backgroundColor: "#FBE4D4" },
          }}
          onClick={handlePrev}
        >
          Poprzedni
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            borderColor: "#490D2D",
            color: "#490D2D",
            "&:hover": { backgroundColor: "#FBE4D4" },
          }}
          onClick={handleNext}
        >
          Następny
        </Button>
      </Box>
      <AddImageDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddImage={handleAddImage}
      />
    </Box>
  );
};

export { ImageManager };
