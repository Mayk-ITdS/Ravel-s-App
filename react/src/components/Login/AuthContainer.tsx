import { Box, Container, Paper, Typography, Button } from "@mui/material";
import Register from "../../pages/Register";
import LoginForm from "./LoginForm";
import { useState } from "react";

export const AuthContainer = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #050505, #1a1a1a)",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={15}
          sx={{
            padding: 5,
            borderRadius: 3,
            backgroundColor: "#121212",
            color: "#fff",
            boxShadow: "0px 0px 30px 5px rgba(0, 162, 255, 0.8)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "#00A2FF",
              fontWeight: "bold",
              textShadow: "0px 0px 15px rgba(0, 162, 255, 1)",
              letterSpacing: "2px",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            {showRegister ? "Register" : "Login"}
          </Typography>
          {showRegister ? <Register /> : <LoginForm />}
          <Button
            sx={{
              mt: 3,
              backgroundColor: "#00A2FF",
              color: "#fff",
              fontWeight: "500",
              fontSize: "1rem",
              fontFamily: "'Orbitron', sans-serif",
              boxShadow: "0px 0px 20px rgba(0, 162, 255, 0.8)",
              "&:hover": { backgroundColor: "#0080C0" },
            }}
            onClick={() => setShowRegister((prev) => !prev)}
          >
            {showRegister ? "Login if You have an account" : "register"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};
