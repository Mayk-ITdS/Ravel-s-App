export const formStyles = {
  dialog: {
    ".MuiDialog-paper": {
      backgroundColor: "#EDEDED",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.1)",
    },
  },
  title: {
    color: "#6CA0DC",
    fontSize: "1.75rem",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: "16px",
    fontFamily: "'Roboto', sans-serif",
  },
  label: {
    color: "#FFB6C1",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  textField: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6CA0DC",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFB6C1",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FFB6C1",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#A9A9A9",
      opacity: 1,
    },
    backgroundColor: "#FFF9F0",
    borderRadius: "8px",
  },
  buttonCancel: {
    backgroundColor: "#FFB6C1",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#F2A2B5",
    },
  },
  buttonSave: {
    backgroundColor: "#6CA0DC",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#588EBC",
    },
  },
};
