import { Button, TextField } from "@mui/material";
import useAuthForm from "./controller";
import { ErrorMessage } from "../ErrorMessage";

const LoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,

    handleLogin,
  } = useAuthForm();
  return (
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
      {error && <ErrorMessage message={"error"} />}
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
  );
};
export default LoginForm;
