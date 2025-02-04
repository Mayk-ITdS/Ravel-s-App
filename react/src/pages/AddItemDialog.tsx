import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { SelectChangeEvent } from "@mui/material";

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSave: (item: any) => void; // Typ dynamiczny, bo obsługujemy zarówno `Product`, jak i `Event`
  type: "product" | "event";
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onClose,
  onSuccess,
  onSave,
  type,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "vinyl",
    date: "",
    location: "",
    image: null as File | null,
  });

  // 🔹 Uniwersalna obsługa zmiany wartości pól tekstowych
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Obsługa zmiany `Select`
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  // 🔹 Obsługa pliku graficznego
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  // 🔹 Obsługa wysyłki formularza
  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "image" || (key === "image" && value)) {
        formDataToSend.append(key, value as string | Blob);
      }
    });

    try {
      const response = await axios.post(
        `/api/${type === "product" ? "products" : "events"}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Odpowiedź serwera:", response.data);
      onSuccess();
      onSave(response.data); // 🔥 Zapisujemy w AdminPanel
      onClose();
    } catch (error) {
      console.error("❌ Błąd uploadu:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {type === "product" ? "Dodaj produkt" : "Dodaj wydarzenie"}
      </DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Nazwa"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Opis"
          fullWidth
          margin="dense"
          multiline
          onChange={handleChange}
        />
        {type === "product" && (
          <>
            <TextField
              name="price"
              label="Cena"
              fullWidth
              margin="dense"
              type="number"
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Kategoria</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleSelectChange}
              >
                <MenuItem value="vinyl">Winyle</MenuItem>
                <MenuItem value="merch">Merch</MenuItem>
                <MenuItem value="tickets">Bilety</MenuItem>
                <MenuItem value="notes">Nuty</MenuItem>
              </Select>
            </FormControl>
          </>
        )}
        {type === "event" && (
          <>
            <TextField
              name="date"
              label="Data"
              fullWidth
              margin="dense"
              type="date"
              onChange={handleChange}
            />
            <TextField
              name="location"
              label="Lokalizacja"
              fullWidth
              margin="dense"
              onChange={handleChange}
            />
          </>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Anuluj
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Dodaj
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;
