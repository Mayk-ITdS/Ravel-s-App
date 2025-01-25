import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
} from "@mui/material";

import { formStyles } from "../scss/formStyles";

interface AddWorkProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    genre: string,
    compositionDate: string,
    premiere: string,
    description: string,
    spotifyLink: string
  ) => void;
}

const AddWork: React.FC<AddWorkProps> = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [compositionDate, setCompositionDate] = useState("");
  const [genre, setGenre] = useState("");
  const [premiere, setPremiere] = useState("");
  const [description, setDescription] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const handleSaveWork = () => {
    onSave(title, genre, compositionDate, premiere, description, spotifyLink);
    setTitle("");
    setCompositionDate("");
    setGenre("");
    setPremiere("");
    setDescription("");
    setSpotifyLink("");
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      sx={formStyles.dialog}
    >
      <DialogTitle sx={formStyles.title}>Add new work</DialogTitle>
      <DialogContent>
        <form>
          <Grid container spacing={4}>
            <Grid item xs={7}>
              <TextField
                value={title}
                label="Title"
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
                sx={formStyles.textField}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                value={compositionDate}
                fullWidth
                label="Composition Date"
                variant="outlined"
                onChange={(e) => setCompositionDate(e.target.value)}
                sx={formStyles.textField}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={genre}
                fullWidth
                label="Genre"
                variant="outlined"
                onChange={(e) => setGenre(e.target.value)}
                sx={formStyles.textField}
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                value={premiere}
                fullWidth
                label="Premiere"
                variant="outlined"
                onChange={(e) => setPremiere(e.target.value)}
                sx={formStyles.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={description}
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                label="Short Description"
                onChange={(e) => setDescription(e.target.value)}
                sx={formStyles.textField}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={spotifyLink}
                fullWidth
                variant="outlined"
                label="Spotify Link"
                onChange={(e) => setSpotifyLink(e.target.value)}
                sx={formStyles.textField}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button sx={formStyles.buttonCancel} onClick={onClose}>
          Cancel
        </Button>
        <Button sx={formStyles.buttonSave} onClick={handleSaveWork}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { AddWork };
