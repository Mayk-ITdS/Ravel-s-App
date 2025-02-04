import React, { useEffect, useState } from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";

const Footer: React.FC = () => {
  const [date, setDate] = useState<number | null>(null);

  useEffect(() => {
    setDate(new Date().getFullYear());
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#490D2D",
        color: "white",
        py: 3,
        mt: "auto",
        textAlign: "center",
      }}
    >
      <Container>
        <Typography variant="body2" sx={{ mb: 1 }}>
          © {date} Ravel's Store. Wszystkie prawa zastrzeżone.
        </Typography>

        {/* 🔗 Ikonki social media */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
          <IconButton
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "white", "&:hover": { color: "#E5B05E" } }}
          >
            <Facebook fontSize="large" />
          </IconButton>
          <IconButton
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "white", "&:hover": { color: "#E5B05E" } }}
          >
            <Instagram fontSize="large" />
          </IconButton>
          <IconButton
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "white", "&:hover": { color: "#E5B05E" } }}
          >
            <Twitter fontSize="large" />
          </IconButton>
          <IconButton
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "white", "&:hover": { color: "#E5B05E" } }}
          >
            <YouTube fontSize="large" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
