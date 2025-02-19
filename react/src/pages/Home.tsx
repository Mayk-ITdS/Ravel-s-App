import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import heroImage from "../assets/hero.jpg";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../Store/store";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  price: number;
  image: string;
  category: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const user = useSelector((state: RootState) => state.auth.user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, eventsRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/events`),
        ]);

        setProducts(productsRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        setError("Nie udało się pobrać produktów.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{ backgroundColor: "#1E1E1E", color: "#E5B05E", minHeight: "100vh" }}
    >
      <Box
        sx={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          padding: "20px",
        }}
      >
        <Container
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "40px",
            borderRadius: "16px",
          }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: "#E5B05E",
              textShadow: "2px 2px 6px rgba(0, 0, 0, 0.7)",
            }}
          >
            Odkryj Świat Maurice'a Ravela
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#F8E3B6", marginTop: "16px" }}
          >
            Ekskluzywne nagrania, unikalne bilety i kolekcjonerskie przedmioty
            dla prawdziwych melomanów.
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: "20px",
              backgroundColor: "#490D2D",
              "&:hover": { backgroundColor: "#7D173F" },
            }}
          >
            Odkryj Teraz
          </Button>
        </Container>
      </Box>

      <Container sx={{ mt: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Sklep Ravel'a
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#F8E3B6",
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Najnowsze propozycje
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography textAlign="center" color="error">
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {products.slice(0, 6).map((prod) => (
              <Grid item xs={12} sm={6} md={4} key={prod.id}>
                <motion.div whileHover={{ scale: 1.05, cursor: "pointer" }}>
                  <Card sx={{ maxWidth: 345, color: "white" }}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={prod.image}
                      title="green iguana"
                    />
                    <CardContent sx={{ backgroundColor: "#1E1E1E" }}>
                      <Typography variant="h6" fontWeight="bold">
                        {prod.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ color: "white" }}
                      >
                        {prod.description}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#E5B05E", mt: 1 }}
                      >
                        {prod.price} zł
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Container sx={{ mt: 6 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Najbliższe Koncerty
        </Typography>
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} md={4} key={event.id}>
              <motion.div whileHover={{ scale: 1.05, cursor: "pointer" }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.image}
                    alt="Concert Event"
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {event.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {event.date} - {event.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
