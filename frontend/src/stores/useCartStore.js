import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const useCartStore = create((set, get) => ({
  cartItems: [],
  total: 0,
  subtotal: 0,
  coupon: null,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cartItems: res.data.cartItems });
      get().calculateTotal();
    } catch (error) {
      toast.error(error.response.data.message || "Could not fetch cart");
    }
  },

  addProduct: async (productId) => {
    try {
      await axios.post("/cart", { productId }); // update in db
      get().getCartItems(); // update cartItems state (ehh feeling lazy to update state manually)
      // set((prevState) => { // actual code for manual state update - copy pasted for now lol
      // 	const existingItem = prevState.cart.find((item) => item._id === product._id);
      // 	const newCart = existingItem
      // 		? prevState.cart.map((item) =>
      // 				item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      // 		  )
      // 		: [...prevState.cart, { ...product, quantity: 1 }];
      // 	return { cart: newCart };
      // });
      toast.success("Item added to cart");
      get().calculateTotal(); // calculate total again on cart update
    } catch (error) {
      toast.error(
        error.response.data.message || "Error while adding item to cart"
      );
    }
  },

  clearCart: async () => {
    set({ cartItems: [], total: 0, subtotal: 0, coupon: null });
  },

  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity == 0) {
        // remove item from cart if quantity becomes 0
        // update in DB
        await axios.delete(`/cart/${productId}`);
        // update in state
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item._id !== productId),
        }));
        get().calculateTotal(); // calculate total again on cart update
        return;
      }

      // else update quantity
      // update in db
      await axios.patch("/cart", { productId, quantity });
      // update state
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item._id === productId ? { ...item, quantity: quantity } : item
        ),
      }));
      get().calculateTotal();
    } catch (error) {
      toast.error(error.response.data.message || "Some error occured");
    }
  },

  deleteItem: async (productId) => {
    try {
      await axios.delete(`/cart/${productId}`);
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item._id !== productId),
      }));
      get().calculateTotal(); // calculate total again on cart update
    } catch (error) {
      toast.error(
        error.response.data.message || "Some error occured while removing item"
      );
    }
  },

  calculateTotal: () => {
    const { cartItems, coupon } = get();

    let subtotal = 0;
    cartItems.map((item) => (subtotal += item.price * item.quantity));

    let total = subtotal;
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));

export default useCartStore;
