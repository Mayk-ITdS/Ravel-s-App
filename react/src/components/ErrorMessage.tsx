import { Typography } from "@mui/material";
import { ErrorMessageProps } from "../types/errorMessage";

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  <Typography
    color="error"
    sx={{
      mt: 2,
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: "1.2rem",
    }}
  >
    {message}
  </Typography>;
};
