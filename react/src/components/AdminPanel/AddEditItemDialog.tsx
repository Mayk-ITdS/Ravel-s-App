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

  // Sync formData with item when dialog opens
  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      if (item.image && typeof item.image === "string") {
        setPreview(item.image); // Load existing image preview
      }
    }
  }, [item]);

  //  Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle Select Change
  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  //  Handle Image Upload
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    console.log(file);
    // Generate preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {item ? "Edytuj" : "Dodaj"} {type === "product" ? "produkt" : "event"}
      </DialogTitle>
      <DialogContent>
        {/* 🔥 NAME / TITLE */}
        <TextField
          name="name"
          label="Nazwa"
          fullWidth
          margin="dense"
          value={"name" in formData ? formData.name : (formData as Event).title}
          onChange={handleChange}
        />

        {/* 🔥 DESCRIPTION */}
        <TextField
          name="description"
          label="Opis"
          fullWidth
          margin="dense"
          value={formData.description}
          onChange={handleChange}
          multiline
        />

        {/*  PRODUCT-SPECIFIC FIELDS */}
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
            {/* EVENT-SPECIFIC FIELDS */}
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
          onClick={() => onSave(formData)}
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
