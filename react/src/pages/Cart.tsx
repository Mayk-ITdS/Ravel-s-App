import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/store";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  checkout,
} from "../Store/cartSlice";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const dispatch = useDispatch();

  const [defaultProducts, setDefaultProducts] = useState([]);

  useEffect(() => {
    if (cartItems.length === 0) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get("http://localhost:5000/products");
          setDefaultProducts(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Błąd pobierania domyślnych produktów:", error);
        }
      };

      fetchProducts();
    }
  }, [cartItems.length]);

  console.log(defaultProducts);
  return (
    <Box
      sx={{ padding: "40px", backgroundColor: "#F9F9F9", minHeight: "100vh" }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="left" mb={4}>
        Koszyk 🛒
      </Typography>

      <Grid container spacing={4}>
        {/* Sekcja produktów w koszyku */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              backgroundColor: "#FFF",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: 2,
            }}
          >
            {cartItems.length === 0 ? (
              <>
                <Typography textAlign="center" variant="h6" sx={{ mb: 3 }}>
                  Koszyk jest pusty. Może coś dodasz? 🎵
                </Typography>
                <Grid container spacing={2}>
                  {defaultProducts.map((product) => (
                    <Grid item xs={12} sm={6} key={product.id}>
                      <Card sx={{ display: "flex", boxShadow: 1 }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 120 }}
                          image={product.image}
                        />
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography variant="h6">{product.name}</Typography>
                          <Typography variant="body1" color="text.secondary">
                            {product.price} zł
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#490D2D",
                              width: "100%",
                              mt: 1,
                            }}
                            startIcon={<ShoppingCartIcon />}
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  quantity: 1,
                                  type: "product",
                                  image: product.image,
                                })
                              )
                            }
                          >
                            Dodaj do koszyka
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <>
                <List>
                  {cartItems.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "16px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: "8px",
                          mr: 2,
                        }}
                        image={item.image}
                      />
                      <ListItemText
                        primary={
                          <Typography variant="h6" fontWeight="bold">
                            {item.name}
                          </Typography>
                        }
                        secondary={`${item.price} zł`}
                      />
                      <Select
                        value={item.quantity}
                        onChange={(e) =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              type: item.type,
                              quantity: Number(e.target.value),
                            })
                          )
                        }
                        sx={{ width: 70, mr: 2 }}
                      >
                        {[1, 2, 3, 4, 5].map((q) => (
                          <MenuItem key={q} value={q}>
                            {q}
                          </MenuItem>
                        ))}
                      </Select>
                      <IconButton
                        onClick={() =>
                          dispatch(
                            removeFromCart({ id: item.id, type: item.type })
                          )
                        }
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={() => dispatch(clearCart())}
                  sx={{ fontWeight: "bold" }}
                >
                  WYCZYŚĆ KOSZYK
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* Sekcja podsumowania zamówienia */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: "#FFF",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Podsumowanie zamówienia
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              Suma produktów: {totalAmount} zł
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dostawa: <strong>Obliczona przy finalizacji</strong>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" fontWeight="bold">
              Razem: {totalAmount} zł
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#000", fontWeight: "bold" }}
              onClick={() => dispatch(checkout())}
            >
              KUP TERAZ
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Cart;
