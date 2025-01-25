import React, { useState } from "react";
import { Container, Typography, Button, Paper, Grid } from "@mui/material";
import { AddWork } from "../components/Works/AddWork";
import styles from "../components/scss/Works.module.scss";
const Works: React.FC = () => {
  const [works, setWorks] = useState([
    {
      title: "Bolero",
      genre: "orchestral",
      compositionDate: "1928",
      premiere: "11/22/1928",
      description:
        "A one-movement orchestral piece famous for its repetitive melody.",
      spotifyLink:
        "https://open.spotify.com/intl-fr/album/4eGxY7valsJbD7bX0yUwPM?si=cn4Jb7xxQMK2mFtppRgGIw",
    },
  ]);
  const [isNewWorkOpen, setIsNewWorkOpen] = useState(false);

  const handleClose = () => setIsNewWorkOpen(false);

  const handleSave = (
    title: string,
    genre: string,
    compositionDate: string,
    premiere: string,
    description: string,
    spotifyLink: string
  ) => {
    setWorks([
      ...works,
      { title, genre, compositionDate, premiere, description, spotifyLink },
    ]);
    setIsNewWorkOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ marginTop: "20px" }}>
        List of Ravel Works
      </Typography>
      <Button
        sx={{ marginTop: "20px" }}
        variant="contained"
        onClick={() => setIsNewWorkOpen(true)}
      >
        Add work
      </Button>
      <Paper>
        <Grid container className={styles.gridHeader}>
          <Grid item xs={2}>
            Title
          </Grid>
          <Grid item xs={2}>
            Genre
          </Grid>
          <Grid item xs={2}>
            Composition Date
          </Grid>
          <Grid item xs={2}>
            Premiere
          </Grid>
          <Grid item xs={2}>
            Description
          </Grid>
          <Grid item xs={2}>
            SpotifyLink
          </Grid>
        </Grid>
        {works.map((work, index) => (
          <Grid container spacing={2} key={index} className={styles.gridItem}>
            <Grid item xs={2}>
              {work.title}
            </Grid>
            <Grid item xs={2}>
              {work.genre}
            </Grid>
            <Grid item xs={2}>
              {work.compositionDate}
            </Grid>
            <Grid item xs={2}>
              {work.premiere}
            </Grid>
            <Grid item xs={2}>
              {work.description}
            </Grid>
            <Grid item xs={2}>
              <a
                href={work.spotifyLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "lightblue" }}
              >
                Listen
              </a>
            </Grid>
          </Grid>
        ))}
      </Paper>
      <AddWork open={isNewWorkOpen} onClose={handleClose} onSave={handleSave} />
    </Container>
  );
};

export { Works };
