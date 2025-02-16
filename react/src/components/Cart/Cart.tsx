import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import {
  addToCart,
  clearCart,
  checkout,
  CartItem,
} from "../../Store/cartSlice";
import {
  Box,
  Button,
  Typography,
  List,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Product } from "../../types/types";
import CartItemsList from "./CartItemsList";

const Cart: React.FC = () => {
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: 2,
              width: "80%",
            }}
          >
            <List
              sx={{
                maxWidth: "335",
                width: "80%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {cartItems.map((item: CartItem) => (
                <CartItemsList key={item.id} item={item} />
              ))}
            </List>

            <Divider sx={{ my: 2 }} />
            {cartItems.length > 0 ? (
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => dispatch(clearCart())}
                sx={{ fontWeight: "bold", width: "70%" }}
              >
                WYCZYŚĆ KOSZYK
              </Button>
            ) : (
              <Typography variant="h6" fontWeight={550} textAlign="center">
                Nothing in Your cart yet
              </Typography>
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
              Razem: {totalAmount.toFixed(2)} $
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
                padding: "2, 5%",
                width: "80%",
                maxWsidth: "335px",
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  objectFit: "cover",

                  height: "250px",
                  padding: "15px 7%",
                }}
                image={product.image}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {product.price} $
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
