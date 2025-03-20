import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const useProductStore = create((set) => ({
  products: [],

  createProduct: async ({ name, description, price, category, image }) => {
    try {
      const res = await axios.post("/products", {
        name,
        description,
        price,
        category,
        image
      });
      set((state) => ({ products: [...state.products, res.data.product] })); // add the new product to the list
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error while creating product"
      );
    }
  },
}));

export default useProductStore;
