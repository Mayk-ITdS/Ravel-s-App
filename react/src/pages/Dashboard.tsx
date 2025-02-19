import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Order } from "../types/order";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/authSlice";
import { RootState } from "../Store/store";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  user?: { id: number };
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser =
    useSelector((state: RootState) => state.auth.user) || user;

  const [orders, setOrders] = useState<Order[]>([]);
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(logout());
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/orders?user_id=${currentUser.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Błąd pobierania zamówień:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          dispatch(logout());
          navigate("/login");
        }
      }
    };

    fetchOrders();
  }, [dispatch, navigate, currentUser]);

  return (
    <Box sx={{ padding: 3, height: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Zamówień
      </Typography>

      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="all">Wszystkie</MenuItem>
        <MenuItem value="pending">Oczekujące</MenuItem>
        <MenuItem value="completed">Zakończone</MenuItem>
        <MenuItem value="canceled">Anulowane</MenuItem>
      </Select>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID Zamówienia</TableCell>
              <TableCell>Użytkownik</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Łączna Cena</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setOpenRow(openRow === order.id ? null : order.id)
                      }
                    >
                      {openRow === order.id ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.user_id}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.total_price} PLN</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Dashboard;
