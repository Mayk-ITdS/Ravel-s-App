import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Biography } from "./pages/Biography";
import theme from "./theme";
import { Header } from "./components/Header";
import { Works } from "./pages/Works";
import { ImageManager } from "./pages/Carousel/ImageManager";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biography" element={<Biography />} />
          <Route path="/Works" element={<Works />} />
          <Route path="/gallerie" element={<ImageManager />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
