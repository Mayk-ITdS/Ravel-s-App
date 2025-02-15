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
      console.log("📩 Dane wysyłane do backendu:", data);

      const response = await axios.post(
        "http://localhost:5000/register",
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
        <Typography variant="h5">Rejestracja</Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="username">Nazwa użytkownika</InputLabel>
          <Input id="username" {...register("username")} />
          <FormHelperText error>{errors.username?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" type="email" {...register("email")} />
          <FormHelperText error>{errors.email?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="password">Hasło</InputLabel>
          <Input id="password" type="password" {...register("password")} />
          <FormHelperText error>{errors.password?.message}</FormHelperText>
        </FormControl>

        <FormControl fullWidth margin="normal" variant="standard">
          <InputLabel htmlFor="confirmPassword">Potwierdź hasło</InputLabel>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
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
          sx={{ mt: 2 }}
        >
          Zarejestruj się
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
