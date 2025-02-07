import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Box,
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#490D2D", padding: "10px 0" }}
    >
      <Container>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h5"
            fontWeight="bold"
            color="#E5B05E"
            component={Link}
            to="/"
            sx={{ textDecoration: "none" }}
          >
            Ravel Store
          </Typography>

          {/* Wyszukiwarka */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "30%",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "8px",
              padding: "5px 10px",
            }}
          >
            <InputBase
              placeholder="Szukaj..."
              sx={{ color: "white", width: "50%" }}
            />
            <IconButton>
              <SearchIcon sx={{ color: "#E5B05E", alignSelf: "right" }} />
            </IconButton>
          </Box>

          {/* Nawigacja */}
          <Box sx={{ display: "flex", gap: "15px" }}>
            <Button
              color="inherit"
              component={Link}
              to="/shop"
              sx={{ fontSize: "1rem", textTransform: "none" }}
            >
              Sklep
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/events"
              sx={{ fontSize: "1rem", textTransform: "none" }}
            >
              Wydarzenia
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              sx={{ fontSize: "1rem", textTransform: "none" }}
            >
              O nas
            </Button>
            <IconButton component={Link} to="/cart">
              <ShoppingCartIcon sx={{ color: "#E5B05E" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
