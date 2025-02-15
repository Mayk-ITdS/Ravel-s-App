import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from "./store";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");
const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: Pick<User, "email" | "password">,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const { user, token } = response.data;
      console.log("🔵 Otrzymany token:", token);
      console.log("🔵 Otrzymany user:", user);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log(response.data);
      return { user, token };
    } catch (error: any) {
      console.error("Błąd logowania:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Błąd logowania");
    }
  }
);
export const restoreSession = () => (dispatch: AppDispatch) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    const parsedUser = JSON.parse(user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    dispatch(setSession({ user: parsedUser, token }));
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (
      state,
      action: PayloadAction<{ user: any; token: string | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;
