import useCartStore from "../stores/useCartStore"
import CartItem from "../components/CartItem"
import OrderSummary from "../components/OrderSummary"
import CouponCard from "../components/CouponCard"


const CartPage = () => {
  const { cartItems } = useCartStore()

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="flex gap-10">
        <div className="flex flex-col items-center">
          {/* <h1 className="text-gray-800 text-3xl font-semibold mb-10">Cart</h1> */}
          <div className="">
            {cartItems.map((cartItem, index) => {
              return <CartItem key={index} item={cartItem} />
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <OrderSummary />
          <CouponCard />
        </div>
      </div>
    </div>
  )
}

export default CartPage