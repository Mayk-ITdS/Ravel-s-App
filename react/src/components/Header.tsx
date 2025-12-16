import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/store";
import { logout } from "../Store/authSlice";

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/shop?search=${searchQuery}`);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    handleMenuClose();
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#490D2D", padding: "10px 0" }}
    >
      <Container>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              width: "30%",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "8px",
              padding: "5px 10px",
            }}
          >
            <InputBase
              placeholder="..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ color: "white", width: "100%" }}
            />
            <IconButton type="submit">
              <SearchIcon sx={{ color: "#E5B05E" }} />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Button
              color="inherit"
              component={Link}
              to="/shop"
              sx={{ fontSize: "1rem", textTransform: "none" }}
            >
              Boutique
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/events"
              sx={{ fontSize: "1rem", textTransform: "none" }}
            >
              Événements
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              sx={{ fontSize: "1rem", textTransform: "none" }}
            >
              À propos
            </Button>

            <IconButton component={Link} to="/cart">
              <Badge badgeContent={cartItems.length} color="error">
                <ShoppingCartIcon sx={{ color: "#E5B05E" }} />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <Typography
                  sx={{ mr: 1, fontWeight: "bold", color: "#E5B05E" }}
                >
                  {user.username}
                </Typography>
                <IconButton onClick={handleMenuOpen}>
                  <Avatar sx={{ bgcolor: "#E5B05E" }}>
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate("/user/dashboard")}>
                    Mon tableau de bord
                  </MenuItem>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/admin"
                    sx={{
                      backgroundColor: "#490D2D",
                      color: "white",
                      "&:hover": { backgroundColor: "#350A1E" },
                    }}
                  >
                    Panneau d’administration
                  </Button>

                  <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Se connecter
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
