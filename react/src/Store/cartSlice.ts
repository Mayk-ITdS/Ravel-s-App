import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "product" | "event";
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

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
    },

    checkout: (state) => {
      axios
        .post("http://localhost:5000/orders", {
          data: {
            items: state.items,
            total: state.totalAmount,
          },
        })
        .then(() => {
          state.items = [];
          localStorage.removeItem("cart");
          state.totalAmount = 0;
        })
        .catch((error) =>
          console.error("Błąd podczas finalizacji zamówienia:", error)
        );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
  checkout,
} = cartSlice.actions;
export default cartSlice.reducer;
