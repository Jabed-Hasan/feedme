import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

// User interface matching the API response structure
interface User {
  id: string; // API returns 'id', not '_id'
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TUser {
  user: User | null;
  token: string | null;
}

const initialState: TUser = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Direct format - payload contains user and token directly
      // This is the expected format from our updated login handler
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      
      console.log("Auth state updated in Redux:", { 
        userEmail: user?.email,
        hasToken: !!token
      });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      
      // Clear localStorage when logging out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      
      console.log("User logged out from Redux store");
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
export const currentToken = (state: RootState) => state.auth.token;
export const currentUser = (state: RootState) => state.auth.user;
