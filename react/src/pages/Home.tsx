import React from "react";
import { Container, Typography } from "@mui/material";
import styles from "../components/scss/Home.module.scss";
const Home: React.FC = () => {
  return (
    <Container className={styles.container}>
      <Typography variant="h2" gutterBottom>
        Witamy w aplikacji o Maurice'u Ravelu
      </Typography>
      <Typography variant="body1">
        Odkryj biografię i muzykę Ravela. Skorzystaj z menu, aby przejść do
        zarządzania jego dziełami.
      </Typography>
    </Container>
  );
};

export { Home };
