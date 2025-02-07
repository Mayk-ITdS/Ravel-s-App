import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import theme from "./theme";
import Header from "./components/Header";
import Works from "./components/Works/Works";
import { ImageManager } from "./pages/Carousel/ImageManager";
import Footer from "./pages/Footer";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
const App: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Błąd pobierania zamówień:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Header />
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />;
          <Route path="/" element={<Home />} />
          <Route path="/Works" element={<Works />} />
          <Route path="/gallerie" element={<ImageManager />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route
            path="/user/dashboard"
            element={<Dashboard orders={orders} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/dashboard" element={<Dashboard orders={[]} />} />
        </Routes>

        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
