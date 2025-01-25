import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ravel's App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/biography">
          Biography
        </Button>
        <Button color="inherit" component={Link} to="/works">
          Works
        </Button>
        <Button color="inherit" component={Link} to="/gallerie">
          Gallery
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export { Header };
