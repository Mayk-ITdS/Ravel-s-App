import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  TablePagination,
  Select,
  MenuItem,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Order } from "../types/order";

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const [openRow, setOpenRow] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);
  console.log("Tablica?", filteredOrders);
  return (
    <Box sx={{ padding: 3, height: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        📊 Dashboard Zamówień
      </Typography>

      {/* Filtr zamówień */}
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
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
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
                    <TableCell>
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: "5px",
                          backgroundColor:
                            order.status === "pending"
                              ? "#ffcc00"
                              : order.status === "completed"
                                ? "#66cc66"
                                : "#ff6666",
                          color: "#fff",
                        }}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.total_price} PLN</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{ padding: 0, backgroundColor: "#f5f5f5" }}
                    >
                      <Collapse
                        in={openRow === order.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="h6">
                            Szczegóły zamówienia
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Produkt</TableCell>
                                <TableCell>Ilość</TableCell>
                                <TableCell>Cena</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    <img
                                      src={`/assets/${item.product_image}`}
                                      alt={item.product_name}
                                      width="50"
                                    />
                                    {item.product_name}
                                  </TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>{item.price} PLN</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginacja */}
      <TablePagination
        component="div"
        count={filteredOrders.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />
    </Box>
  );
};

export default Dashboard;
