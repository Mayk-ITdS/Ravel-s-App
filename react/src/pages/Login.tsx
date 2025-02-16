import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../Store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Collapse,
} from "@mui/material";
import Register from "./Register";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        loginUser({ email, password }) as any
      );
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/");
      } else {
        setError("Nieprawidłowy email lub hasło");
      }
    } catch (err) {
      setError("Wystąpił błąd logowania.");
    }
  };

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
            Zaloguj się
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{
                sx: {
                  fontSize: "0.7rem",
                  color: "#00A2FF",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  marginBottom: "70px",
                },
              }}
              InputProps={{
                sx: {
                  color: "#fff",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "1.2rem",
                  border: "1px solid #00A2FF",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 15px rgba(0, 162, 255, 0.6)",
                },
              }}
              sx={{
                "& label.Mui-focused": { color: "#00A2FF" },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#00A2FF" },
                },
              }}
            />
            <TextField
              label="Hasło"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{
                sx: {
                  fontSize: "0.7rem",
                  color: "#00A2FF",
                  fontWeight: "bold",
                  letterSpacing: "1px",
                  marginBottom: "70px",
                },
              }}
              InputProps={{
                sx: {
                  color: "#fff",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "1.2rem",
                  border: "1px solid #00A2FF",
                  borderRadius: "8px",
                  boxShadow: "0px 0px 15px rgba(0, 162, 255, 0.6)",
                },
              }}
              sx={{
                "& label.Mui-focused": { color: "#00A2FF" },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": { borderColor: "#00A2FF" },
                },
              }}
            />
            {error && (
              <Typography
                color="error"
                sx={{
                  mt: 2,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "1.2rem",
                }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: "#00A2FF",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.2rem",
                fontFamily: "'Orbitron', sans-serif",
                boxShadow: "0px 0px 20px rgba(0, 162, 255, 0.8)",
                "&:hover": { backgroundColor: "#0080C0" },
              }}
            >
              ZALOGUJ SIĘ
            </Button>
          </form>
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
          <Collapse in={showRegister}>
            <Register />
          </Collapse>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
