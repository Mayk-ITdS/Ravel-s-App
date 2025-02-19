import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "product" | "event";
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}
const API_URL = import.meta.env.VITE_API_URL;
const initialState: CartState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  totalAmount: 0,
};
const calculateTotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.type === action.payload.type
      );
      existingItem
        ? (existingItem.quantity += 1)
        : state.items.push({ ...action.payload, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(state.items));
      state.totalAmount += action.payload.price * action.payload.quantity;
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; type: "product" | "event" }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id && item.type === action.payload.type)
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: number;
        type: "product" | "event";
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id && item.type === action.payload.type
      );

      item &&
        (action.payload.quantity <= 0
          ? (state.items = state.items.filter(
              (item) =>
                !(
                  item.id === action.payload.id &&
                  item.type === action.payload.type
                )
            ))
          : (item.quantity = action.payload.quantity));
      state.totalAmount = calculateTotal(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
      state.totalAmount = 0;
    },
  },
});
export const checkout = createAsyncThunk(
  "cart/checkout",
  async (user_id: number, { dispatch, getState }) => {
    const state: RootState = getState();
    const cart: { items: CartItem[]; totalAmount: number } = state.cart;

    console.log(
      "Wysyłane dane do /orders:",
      JSON.stringify(
        {
          user_id,
          items: cart.items,
          total: cart.totalAmount,
        },
        null,
        2
      )
    );

    const payload = {
      user_id,
      items: cart.items.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price: Number(price),
        quantity,
      })),
      total: cart.totalAmount,
    };

    console.log("Wysyłane dane do /orders:", JSON.stringify(payload, null, 2));

    try {
      await axios.post(`${API_URL}/orders`, payload);
      dispatch(clearCart());
    } catch (error) {
      console.error("Błąd podczas składania zamówienia:", error);
    }
  }
);

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
