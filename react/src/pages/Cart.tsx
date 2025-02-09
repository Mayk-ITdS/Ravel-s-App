import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../Store/store";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  checkout,
  CartItem,
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
import { Product } from "../types/types";

interface CartProps {
  products?: Product[];
}

const Cart: React.FC<CartProps> = ({ products = [] }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const dispatch = useDispatch<AppDispatch>();

  const itemsQuantity = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  const [defaultProducts, setDefaultProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setDefaultProducts(response.data);
      } catch (error) {
        console.error("Błąd pobierania domyślnych produktów:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCheckout = () => {
    if (user?.id) {
      dispatch(checkout(Number(user.id)));
    } else {
      console.error(
        "Użytkownik niezalogowany! Nie można przejść do płatności."
      );
    }
  };

  return (
    <Box
      sx={{ padding: "40px", backgroundColor: "#F9F9F9", minHeight: "100vh" }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="left" mb={4}>
        Koszyk 🛒
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              backgroundColor: "#FFF",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: 2,
            }}
          >
            <List>
              {cartItems.map((item: CartItem) => (
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
                    sx={{ width: 100, height: 100, borderRadius: "8px", mr: 2 }}
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
                      dispatch(removeFromCart({ id: item.id, type: item.type }))
                    }
                    sx={{ color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            {cartItems.length > 0 && (
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => dispatch(clearCart())}
                sx={{ fontWeight: "bold" }}
              >
                WYCZYŚĆ KOSZYK
              </Button>
            )}
          </Box>
        </Grid>

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
              Suma produktów: {itemsQuantity} szt.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dostawa: <strong>Obliczona przy finalizacji</strong>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" fontWeight="bold">
              Razem: {totalAmount.toFixed(2)} zł
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#000", fontWeight: "bold" }}
              onClick={handleCheckout}
            >
              KUP TERAZ
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="h5" fontWeight="bold" textAlign="left" mt={4}>
        Popularne produkty 🎵
      </Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {defaultProducts.map((product: Product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: 150, height: 150 }}
                image={product.image}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {product.price} zł
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#490D2D", width: "100%", mt: 1 }}
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
    </Box>
  );
};

export default Cart;
