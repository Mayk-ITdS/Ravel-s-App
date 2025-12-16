import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "../Store/cartSlice";

interface Event {
  id: number;
  title: string;
  description: string;
  date: number;
  image: string;
}

const Events: React.FC = () => {
  const { category } = useParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Brak tokena! Użytkownik nie jest zalogowany.");
        return;
      }

      console.log("🟢 Używam tokena do pobierania danych:", token);
      try {
        const responseEvents = await Promise.all([
          axios.get(`${API_URL}/events`),
        ]);
        setEvents(responseEvents[0].data);
      } catch (err) {
        setError("Nie udało się pobrać produktów.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#1E1E1E",
        color: "#E5B05E",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        Événements {category?.toUpperCase()}
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress color="secondary" />
        </Box>
      ) : error ? (
        <Typography variant="h6" textAlign="center" sx={{ color: "red" }}>
          {error}
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {events.length > 0 ? (
            events.map((event: Event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card
                    sx={{
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={event.image}
                      alt={event.title}
                    />

                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#E5B05E", mt: 1 }}
                      >
                        {event.date}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          marginTop: "10px",
                          backgroundColor: "#490D2D",
                          "&:hover": { backgroundColor: "#7D173F" },
                        }}
                        onClick={() =>
                          dispatch(
                            addToCart({
                              id: event.id,
                              name: event.title,
                              price: 99.99,
                              image: event.image,
                              quantity: 1,
                              type: "event",
                            })
                          )
                        }
                      >
                        Ajouter au panier
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" textAlign="center" sx={{ width: "100%" }}>
              Aucun produit disponible dans cette catégorie.
            </Typography>
          )}{" "}
        </Grid>
      )}
    </Box>
  );
};

export default Events;
