import useCartStore from "../stores/useCartStore"
import useUserStore from "../stores/useUserStore"
import toast from "react-hot-toast"

const ProductCard = ({ product }) => {
  const {addProduct, cartItems} = useCartStore()
  const {user} = useUserStore()

  const handleAddToCart = () => {
    if(!user){
      toast.error("Please login first to add items to cart")
      return
    }
    addProduct(product._id)
  }

  return (
    <div className="flex flex-col max-w-70 text-gray-900 shadow-xl rounded-md">
      <img src={product.image} alt={product.name} className="object-cover w-70 h-60 rounded-t-md" />
      <div className="px-5 py-4 text-center">
        <h3 className="text-lg font-bold">{product.name}</h3>
        {/* <p>{product.description.length > 100 ? product.description.slice(0, 50) + "..." : product.description}</p> */}
        <p className="font-medium">&#8377;{product.price}</p>
      </div>
      <div className="mx-3 my-3">
        <button
          onClick={handleAddToCart}
          className="border-gray-300 border-2 font-medium rounded-lg w-full mt-auto cursor-pointer
        py-2 hover:border-white hover:bg-gray-900 hover:text-white transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard