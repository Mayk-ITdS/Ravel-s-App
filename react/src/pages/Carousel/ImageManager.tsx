import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { AddImageDialog } from "./AddImageDialog";
import { Canvas } from "@react-three/fiber";
import { Gallerie3D } from "./Gallerie3D";
import ravelBckg from "../../assets/ravelBckg.webp";
import ravel1 from "../../assets/ravel1.png";

const ImageManager: React.FC = () => {
  const [images, setImages] = useState<string[]>([ravelBckg, ravel1]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddImage = (imageUrl: string) => {
    if (imageUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      setImages([...images, imageUrl]);
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
        color="primary"
        sx={{ marginBottom: 2 }}
        onClick={() => setIsDialogOpen(true)}
      >
        Add Image
      </Button>
      <Box sx={{ width: "100%", height: "500px" }}>
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
          sx={{ marginRight: 2 }}
          onClick={handlePrev}
        >
          Previous
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleNext}>
          Next
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
