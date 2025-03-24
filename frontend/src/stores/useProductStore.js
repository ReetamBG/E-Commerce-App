import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const useProductStore = create((set, get) => ({
  products: [],

  createProduct: async ({ name, description, price, category, image }) => {
    try {
      const res = await axios.post("/products", {
        name,
        description,
        price,
        category,
        image,
      });
      set((state) => ({ products: [...state.products, res.data.product] })); // add the new product to the list
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error while creating product"
      );
    }
  },

  getAllProducts: async () => {
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error while fetching products"
      );
    }
  },

  toggleFeatured: async (productId) => {
    try {
      await axios.patch(`/products/${productId}`)   // update in db
      // get().fetchAllProducts() // dont do this its too slow to reflect in UI instead update the state manually
      set(state => ({
        products: state.products.map(product => product._id === productId ? {...product, isFeatured:  !product.isFeatured}: product)
      }))   // update in state manually
    } catch (error) {
      toast.error(
        error.response.data.message || "Error while toggling featured"
      );
    }
  },

  deleteProduct : async (productId) =>{
    try {
      await axios.delete(`/products/${productId}`)    // delete in db
      // get().fetchAllProducts() // dont do this its too slow to reflect in UI instead update the state manually
      set(state => ({products: state.products.filter(product => product._id != productId)}))    // delete from state manually
    } catch (error) {
      toast.error(
        error.response.data.message || "Error while toggling featured"
      );
    }
  },

  getProductsByCategory: async (category) => {
    try{
      const res = await axios.get(`/products/category/${category}`)
      set({products: res.data.products})
    } catch(error){
      toast.error(error.response.data.message || "Error fetching products")
    }
  }
}));

export default useProductStore;
