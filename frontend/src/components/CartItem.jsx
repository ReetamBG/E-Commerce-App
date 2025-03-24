import { FaCirclePlus } from "react-icons/fa6";
import { FaCircleMinus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import useCartStore from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { updateQuantity, deleteItem } = useCartStore()

  return (
    <div className="flex justify-between w-150 shadow-md mb-8 px-5 py-3 rounded-xl">
      <div className="flex items-center text-gray-800">
        <img src={item.image} className="h-20 w-20 object-cover mr-5 rounded-sm" />
        <div className="flex items-start w-50 justify-between">
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-sm">{item.category}</p>
          </div>
        </div>
        <MdDeleteOutline
          onClick={() => { deleteItem(item._id) }}
          size={20}
          className="cursor-pointer text-red-900 hover:text-red-700"
        />
      </div>
      <div className="flex items-center gap-1">
        <FaCircleMinus
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="cursor-pointer hover:text-gray-600"
        />
        {item.quantity}
        < FaCirclePlus
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <div className="flex items-center">
        &#8377;{item.price * item.quantity}
      </div>
    </div>
  )
}

export default CartItem