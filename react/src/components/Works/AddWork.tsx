import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import { ButtonProps } from "@mui/material";
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
    spotifyLink: string,
    details: {
      importantPerformancePlace: string;
      date: string;
      performers: string;
      coworkers: string;
    }
  ) => void;
}

interface TextButtonsProps extends ButtonProps {
  onClick: () => void;
}
const TextButtons: React.FC<TextButtonsProps> = ({
  onClick,
  ...props
}: TextButtonsProps) => {
  return (
    <Stack direction="row" spacing={2}>
      <Button onClick={onClick} {...props} variant="contained">
        Add Detail
      </Button>
    </Stack>
  );
};
export default TextButtons;

const AddWork: React.FC<AddWorkProps> = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [compositionDate, setCompositionDate] = useState("");
  const [genre, setGenre] = useState("");
  const [premiere, setPremiere] = useState("");
  const [description, setDescription] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [details, setDetails] = useState({
    importantPerformancePlace: "",
    date: "",
    performers: "",
    coworkers: "",
  });

  const [currentDetailKey, setCurrentDetailKey] = useState<
    keyof typeof details
  >("importantPerformancePlace");

  const [detailsList, setDetailsList] = useState<
    { key: keyof typeof details; value: string }[]
  >([]);

  const handleAddDetail = () => {
    if (details[currentDetailKey]) {
      setDetailsList((prev) => [
        ...prev,
        { key: currentDetailKey, value: details[currentDetailKey] },
      ]);
      setDetails((prev) => ({ ...prev, [currentDetailKey]: "" }));
      const keys = Object.keys(details) as (keyof typeof details)[];
      const nextKeyIndex = (keys.indexOf(currentDetailKey) + 1) % keys.length;
      setCurrentDetailKey(keys[nextKeyIndex]);
    }
  };

  const handleSaveWork = () => {
    const finalDetails = detailsList.reduce(
      (acc, detail) => ({ ...acc, [detail.key]: detail.value }),
      {}
    ) as typeof details;

    onSave(
      title,
      genre,
      compositionDate,
      premiere,
      description,
      spotifyLink,
      finalDetails
    );
    setTitle("");
    setCompositionDate("");
    setGenre("");
    setPremiere("");
    setDescription("");
    setSpotifyLink("");
    setDetailsList([]);
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
            {/*Super Dynamiczne Inputy*/}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={10}
                  sx={{
                    fontFamily: "sans-serif",
                    fontWeight: "700",
                    color: "blue",
                  }}
                >
                  Details
                  <TextField
                    value={details[currentDetailKey]}
                    variant="outlined"
                    fullWidth
                    label={`Enter ${currentDetailKey}`}
                    onChange={(e) =>
                      setDetails((prev) => ({
                        ...prev,
                        [currentDetailKey]: e.target.value,
                      }))
                    }
                    sx={formStyles.textField}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextButtons
                    onClick={handleAddDetail}
                    sx={{
                      top: "45px",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "blue",
                    }}
                    variant="outlined"
                  ></TextButtons>
                </Grid>
              </Grid>
              <Grid container spacing={1} sx={{ marginTop: "16px" }}>
                {detailsList.map((detail, index) => (
                  <Grid item xs={12} key={index}>
                    <Typography>
                      <strong>{detail.key}:</strong>
                      {detail.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
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
