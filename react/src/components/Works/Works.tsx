import React, { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import ColapsibleTable from "./ColapisbleTable";
import { AddWork } from "./AddWork";

const Works: React.FC = () => {
  const [works, setWorks] = useState<
    {
      title: string;
      genre: string;
      compositionDate: string;
      premiere: string;
      description: string;
      spotifyLink: string;
      details: {
        importantPerformancePlace: string;
        date: string;
        performers: string;
        coworkers: string;
      };
    }[]
  >([]);

  const [isNewWorkOpen, setIsNewWorkOpen] = useState(false);

  const handleClose = () => setIsNewWorkOpen(false);

  const handleSave = (
    title: string,
    genre: string,
    compositionDate: string,
    premiere: string,
    description: string,
    spotifyLink: string,
    details: {
      importantPerformancePlace: string;
      date: string;
      performers: string;
      coworkers: string;
    }
  ) => {
    setWorks((prevWorks) => [
      ...prevWorks,
      {
        title,
        genre,
        compositionDate,
        premiere,
        description,
        spotifyLink,
        details,
      },
    ]);
    setIsNewWorkOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginTop: "20px" }}>
        List of Ravel Works
      </Typography>
      <Button
        sx={{ marginTop: "100px", marginBottom: "30px" }}
        variant="contained"
        onClick={() => setIsNewWorkOpen(true)}
      >
        Add work
      </Button>
      {/* Dynamiczna tabela */}
      <ColapsibleTable works={works} />
      {/* Formularz do dodawania utworów */}
      <AddWork open={isNewWorkOpen} onClose={handleClose} onSave={handleSave} />
    </Container>
  );
};

export default Works;
