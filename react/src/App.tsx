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
const App: React.FC = () => {
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
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
