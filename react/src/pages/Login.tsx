import React, { useState } from "react";
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
  Collapse,
} from "@mui/material";
import { loginUser } from "../Store/authSlice";
import Register from "./Register";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store/store";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup
    .string()
    .email("Nieprawidłowy email")
    .required("Email jest wymagany"),
  password: yup.string().required("Hasło jest wymagane"),
});

const Login: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const resultAction = await dispatch(loginUser(data));
      console.log("to jest obiekt z danymi", resultAction.payload);
      if (loginUser.fulfilled.match(resultAction)) {
        console.log("✅ Logowanie powiodło się:", resultAction.payload);
        navigate("/");
        console.log("Stan Redux po logowaniu:", resultAction.payload);
      } else {
        console.error("❌ Logowanie nie powiodło się:", resultAction.payload);
      }
    } catch (error) {
      console.error("⚠️ Wystąpił błąd logowania:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 10,
          height: "100vh",

          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Logowanie
        </Typography>

        <Box
          component="form"
          sx={{ width: "100%" }}
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Zaloguj się
          </Button>
        </Box>

        <Button
          sx={{ mt: 2, textTransform: "none" }}
          color="secondary"
          onClick={() => setShowRegister(!showRegister)}
        >
          Not registered yet?
        </Button>

        <Collapse in={showRegister} timeout="auto" unmountOnExit>
          <Register />
        </Collapse>
      </Box>
    </Container>
  );
};

export default Login;
