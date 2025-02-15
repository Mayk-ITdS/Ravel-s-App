import React, { useState, useEffect } from "react";
import { Product, Event } from "../../types/types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";

interface AddEditItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (newItem: Product | Event) => void;
  type: "product" | "event";
  item: Product | Event | null;
}

const getDefaultItem = (type: "product" | "event"): Product | Event => {
  return type === "product"
    ? ({
        id: 0,
        name: "",
        description: "",
        price: 0,
        category: "vinyl",
        image: null,
      } as Product)
    : ({
        id: 0,
        title: "",
        description: "",
        date: "",
        location: "",
        image: null,
      } as Event);
};

const AddEditItemDialog: React.FC<AddEditItemDialogProps> = ({
  open,
  onClose,
  item,
  type,
  onSave,
}) => {
  const [formData, setFormData] = useState<Product | Event>(() =>
    getDefaultItem(type)
  );
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    console.log("Aktualizacja formularza z:", item);
    if (item) {
      setFormData((prevState) =>
        type === "product"
          ? ({
              ...prevState,
              id: item.id ?? 0,
              name: (item as Product).name || "",
              description: item.description || "",
              price: (item as Product).price ?? 0,
              category: (item as Product).category || "vinyl",
              image: (item as Product).image || null,
            } as Product)
          : ({
              ...prevState,
              id: item.id ?? 0,
              title: (item as Event).title || "",
              description: item.description || "",
              date: (item as Event).date || "",
              location: (item as Event).location || "",
              image: item.image ?? null,
            } as Event)
      );

      if (item.image && typeof item.image === "string") {
        setPreview(item.image);
      }
    }
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Nie udało się przekonwertować obrazu na base64"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;

    const convertedToBase64 = await convertFileToBase64(file);

    setFormData((prev) => ({
      ...prev,
      image: convertedToBase64,
    }));
    setPreview(convertedToBase64);
    console.log(convertedToBase64);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {item ? "Edytuj" : "Dodaj"} {type === "product" ? "produkt" : "event"}
      </DialogTitle>
      <DialogContent>
        {type === "product" ? (
          <TextField
            name="name"
            label="Nazwa"
            fullWidth
            margin="dense"
            value={(formData as Product).name}
            onChange={handleChange}
          />
        ) : (
          <TextField
            name="title"
            label="Tytuł"
            fullWidth
            margin="dense"
            value={(formData as Event).title}
            onChange={handleChange}
          />
        )}

        <TextField
          name="description"
          label="Opis"
          fullWidth
          margin="dense"
          value={formData.description}
          onChange={handleChange}
          multiline
        />

        {type === "product" ? (
          <>
            <TextField
              name="price"
              label="Cena"
              fullWidth
              margin="dense"
              value={"price" in formData ? formData.price : 0}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Kategoria</InputLabel>
              <Select
                name="category"
                value={"category" in formData ? formData.category : ""}
                onChange={handleSelectChange}
              >
                <MenuItem value="vinyl">Winyl</MenuItem>
                <MenuItem value="merch">Merch</MenuItem>
                <MenuItem value="tickets">Bilety</MenuItem>
                <MenuItem value="notes">Nuty</MenuItem>
              </Select>
            </FormControl>
          </>
        ) : (
          <>
            <TextField
              name="date"
              label="Data"
              fullWidth
              margin="dense"
              type="date"
              value={"date" in formData ? formData.date : ""}
              onChange={handleChange}
            />
            <TextField
              name="location"
              label="Lokalizacja"
              fullWidth
              margin="dense"
              value={"location" in formData ? formData.location : ""}
              onChange={handleChange}
            />
          </>
        )}

        {preview && (
          <img
            src={preview}
            alt="Podgląd"
            width="100%"
            style={{ marginTop: 10 }}
          />
        )}

        <input type="file" accept="image/*" onChange={handleUploadImage} />

        <Button
          onClick={() => {
            console.log("Wysylane dane:", formData);
            onSave(formData);
          }}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {item ? "Zapisz zmiany" : "Dodaj"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditItemDialog;
