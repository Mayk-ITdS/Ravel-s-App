import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup.object({
  username: yup.string().required("Nazwa użytkownika jest wymagana"),
  email: yup
    .string()
    .email("Nieprawidłowy email")
    .required("Email jest wymagany"),
  password: yup
    .string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .required("Hasło jest wymagane"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Hasła muszą być identyczne")
    .required("Potwierdzenie hasła jest wymagane"),
});
const API_URL = import.meta.env.VITE_API_URL;
const Register: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      console.log("Dane wysyłane do backendu:", data);

      const response = await axios.post(
        `${API_URL}/register`,
        {
          username: data.username,
          email: data.email,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        console.log(" Rejestracja powiodła się:", response.data);
        navigate("/");
      } else {
        console.error(" Rejestracja nie powiodła się:", response.data);
      }
    } catch (error) {
      console.error(" Wystąpił błąd podczas rejestracji:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 4, textAlign: "center" }}>
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
          Rejestracja
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel
            htmlFor="username"
            sx={{
              fontSize: "0.7rem",
              fontWeight: "500",
              color: "#00A2FF",
              letterSpacing: "1px",
              margin: "5px 10px ",
              "&.Mui-focused": {
                color: "#00A2FF",
                textShadow: "0px 0px 10px rgba(0, 162, 255, 0.8)",
                border: "none",
              },
            }}
          >
            Nazwa użytkownika
          </InputLabel>
          <Input
            id="username"
            {...register("username")}
            inputProps={{
              sx: {
                color: "#00A2FF",
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
          <FormHelperText error>{errors.username?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel
            htmlFor="email"
            sx={{
              fontSize: "0.7rem",
              fontWeight: "500",
              color: "#00A2FF",
              letterSpacing: "1px",
              margin: "5px 10px ",
            }}
          >
            Email
          </InputLabel>
          <Input
            id="email"
            type="email"
            {...register("email")}
            inputProps={{
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
          <FormHelperText error>{errors.email?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel
            htmlFor="password"
            sx={{
              fontSize: "0.7rem",
              fontWeight: "500",
              color: "#00A2FF",
              letterSpacing: "1px",
              margin: "5px 10px ",
            }}
          >
            Hasło
          </InputLabel>
          <Input
            id="password"
            type="password"
            {...register("password")}
            inputProps={{
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
                "&:hover fieldset": {
                  borderColor: "#00A2FF",
                },
              },
            }}
          />
          <FormHelperText error>{errors.password?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel
            htmlFor="confirmPassword"
            sx={{
              fontSize: "0.7rem",
              fontWeight: "500",
              color: "#00A2FF",
              letterSpacing: "1px",
              margin: "5px 10px ",
            }}
          >
            Potwierdź hasło
          </InputLabel>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            inputProps={{
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
          <FormHelperText error>
            {errors.confirmPassword?.message}
          </FormHelperText>
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
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
          Zarejestruj się
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
