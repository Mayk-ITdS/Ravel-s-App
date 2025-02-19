import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface OrdersState {
  list: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
}
const API_URL = import.meta.env.VITE_API_URL;
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Blad pobierania zamowien"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  } as OrdersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export default ordersSlice.reducer;
