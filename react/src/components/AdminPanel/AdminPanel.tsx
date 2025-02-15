import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from "@mui/material";
import AddEditItemDialog from "./AddEditItemDialog";
import { Product, Event } from "../../types/types";
import axios from "axios";

type EditType = "product" | "event";

const getDefaultItem = (type: EditType): Product | Event => {
  if (type === "product") {
    return {
      id: 0,
      name: "",
      description: "",
      price: 0,
      category: "vinyl",
      image: null,
    } as Product;
  } else {
    return {
      id: 0,
      title: "",
      description: "",
      date: "",
      location: "",
      image: null,
    } as Event;
  }
};

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<Product | Event | null>(null);
  const [editType, setEditType] = useState<EditType>("product");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, eventsRes] = await Promise.all([
          axios.get<Product[]>("http://localhost:5000/products"),
          axios.get<Event[]>("http://localhost:5000/events"),
        ]);

        setProducts(productsRes.data);
        setEvents(eventsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleOpenDialog = (type: EditType, item?: Product | Event | null) => {
    setEditType(type);
    setEditItem(item ?? getDefaultItem(type));
    setOpenDialog(true);
  };
  const handleDelete = async (type: "products" | "events", id: number) => {
    try {
      await axios.delete(`http://localhost:5000/${type}/${id}`);

      if (type === "products") {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }

      console.log("Usunięto:", id);
    } catch (error) {
      console.error("Błąd usuwania:", error);
    }
  };

  const handleSave = async (newItem: Product | Event) => {
    if (!editItem) return;

    const isEditing = Boolean(editItem.id);
    const url = isEditing
      ? `http://localhost:5000/${editType}s/${editItem.id}`
      : `http://localhost:5000/${editType}s`;
    console.log("Wysyłane dane do backendu:", newItem);
    try {
      const { data: savedItem } = await axios({
        method: isEditing ? "PUT" : "POST",
        url,
        data: newItem,
        headers: { "Content-Type": "application/json" },
      });

      console.log("Otrzymana odpowiedź z backendu:", savedItem);

      if (editType === "product") {
        setProducts((prev) =>
          isEditing
            ? prev.map((p) =>
                p.id === savedItem.id ? { ...p, ...savedItem } : p
              )
            : [...prev, savedItem]
        );
      } else {
        setEvents((prev) =>
          isEditing
            ? prev.map((e) =>
                e.id === savedItem.id ? { ...e, ...savedItem } : e
              )
            : [...prev, savedItem]
        );
      }

      setOpenDialog(false);
    } catch (error) {
      console.error("Błąd API:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" textAlign="center" sx={{ my: 4 }}>
        Admin Panel
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog("product")}
      >
        Dodaj Produkt
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleOpenDialog("event")}
        sx={{ ml: 2 }}
      >
        Dodaj Event
      </Button>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Produkty:
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image={product.image}
                title="Event"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {product.description}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {product.price} $
                </Typography>
              </CardContent>
              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="small"
                  sx={{
                    color: "blue",

                    fontWeight: "700",
                    border: "1px, solid, grey",
                    backgroundColor: "whitesmoke",
                  }}
                  onClick={() => handleOpenDialog("product")}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  sx={{
                    color: "rosybrown",

                    fontWeight: "700",
                    border: "1px, solid, grey",
                    backgroundColor: "whitesmoke",
                  }}
                  onClick={() => handleDelete("products", product.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 4 }}>
        Eventy:
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image={event.image}
                title="Event"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {event.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {event.description}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="small"
                  sx={{
                    color: "blue",

                    fontWeight: "700",
                    border: "1px, solid, grey",
                    backgroundColor: "whitesmoke",
                  }}
                  onClick={() => handleOpenDialog("event")}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  sx={{
                    color: "rosybrown",

                    fontWeight: "700",
                    border: "1px, solid, grey",
                    backgroundColor: "whitesmoke",
                  }}
                  onClick={() => handleDelete("events", event.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AddEditItemDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        type={editType}
        item={editItem ?? getDefaultItem(editType)}
      />
    </Container>
  );
};

export default AdminPanel;
