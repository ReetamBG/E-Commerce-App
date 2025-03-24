import { Link } from "react-router-dom"
import useCartStore from "../stores/useCartStore"
import axios from "../lib/axios"
import toast from "react-hot-toast"

const OrderSummary = () => {
  const { cartItems, total, subtotal, coupon, isCouponApplied, clearCart } = useCartStore()
  const savings = subtotal - total
  const subtotalFormatted = subtotal.toFixed(2)
  const totalFormatted = total.toFixed(2)
  const savingsFormatted = savings.toFixed(2)

  const handlePayment = async () => {
    try {
      const res = await axios.post("/payment/create-checkout-session", {
        products: cartItems,
        couponCode: coupon ? coupon.code : null
      })

      const { id, totalAmount, key } = res.data
      const options = {
        key,
        amount: totalAmount * 100,    // convert to paise
        name: "ReeKart",
        decription: "Purchase",
        order_id: id, // razorpay order id
        handler: async (response) => {   // response object in handler function is returned by razorpay on successful payment
          await axios.post("/payment/checkout-success", {
            orderId: response.razorpay_order.id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          })
          toast.success("Payment successfull")
          clearCart()
        }
      }

      const razorpayInstance = new window.Razorpay(options)
      razorpayInstance.open()
    } catch (error) {
      console.log(error)
      toast.error("Some error occured during checkout")
    }
  }

  return (
    <div className="shadow-md w-70 p-5 flex flex-col gap-4">
      <h3 className="text-xl font-medium">Order Summary</h3>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span>Original Price</span><span>&#8377;{subtotalFormatted}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Savings</span><span> -&#8377;{savingsFormatted}</span>
          </div>
        )}
        <hr className="my-2 text-gray-300" />
        <div className="flex justify-between font-semibold">
          <span>Total</span><span>&#8377;{totalFormatted}</span>
        </div>
      </div>
      <button
        onClick={handlePayment}
        to="/"
        className="border-1 bg-gray-900 text-white rounded-md px-5 py-2 
        text-center text-sm font-semibold hover:bg-gray-700
        transition-all gap-2 cursor-pointer"
      >
        Proceed to checkout
      </button>
      <p className="text-center">
        or <Link to="/" className="text-blue-800 hover:underline hover:text-blue-600">continue shopping</Link>
      </p>
    </div>
  )
}

export default OrderSummary