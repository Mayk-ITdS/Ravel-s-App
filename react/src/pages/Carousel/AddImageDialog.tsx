import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

interface AddImageDialogProps {
  open: boolean;
  onClose: () => void;
  onAddImage: (imageUrl: string) => void;
}

const AddImageDialog: React.FC<AddImageDialogProps> = ({
  open,
  onClose,
  onAddImage,
}) => {
  const [imageUrl, setImageUrl] = useState("");

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      onAddImage(imageUrl);
      setImageUrl("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Add new image</DialogTitle>
      <DialogContent>
        <TextField
          label="Image URL"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Give an image URL"
          variant="outlined"
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleAddImage}
          variant="contained"
          color="primary"
          disabled={!imageUrl.trim()}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export { AddImageDialog };
