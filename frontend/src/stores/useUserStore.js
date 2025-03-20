import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const useUserStore = create((set) => ({
  user: null,
  checkingAuth: false,

  login: async ({ email, password }) => {
    try {
      const res = await axios.post("/auth/login", { email, password });     // send req
      set({ user: res.data.user });                                         // set user
      toast.success("Welcome back " + res.data.user.name);                  // show succecss message
    } catch (error) {                                                       // all errors including 300, 400, 500 status codes will be handled here                               
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  signup: async ({ name, email, password, confirmPassword }) => {
    if (password != confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data.user });
      toast.success("Welcome " + res.data.user.name);
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign Up failed");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Byee");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // function to check if user is already logged in (using token in cookie)
  // if logged in then on page reload, it will again restore the user
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/get-profile");
      set({ user: res.data.user, checkingAuth: false });
    } catch {
      set({ user: null, checkingAuth: false });
    }
  },
}));

export default useUserStore;
