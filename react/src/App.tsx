import { CssBaseline, ThemeProvider } from "@mui/material";
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import theme from "./theme";
import Header from "./components/Header";
import Works from "./components/Works/Works";
import { ImageManager } from "./pages/Carousel/ImageManager";
import Footer from "./pages/Footer";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./Store/store";
import { setSession } from "./Store/authSlice";
import axios from "axios";

const ProtectedRoute: React.FC<{
  token: string | null;
  children: React.ReactNode;
}> = ({ token, children }) => {
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      dispatch(
        setSession({ user: JSON.parse(storedUser), token: storedToken })
      );
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        {token && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/gallerie" element={<ImageManager />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute token={token}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />{" "}
        </Routes>
        {token && <Footer />}
      </Router>
    </ThemeProvider>
  );
};

export default App;
