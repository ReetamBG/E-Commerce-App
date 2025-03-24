import { Link } from "react-router-dom"
import FormField from "./FormField"

const CouponCard = () => {
  return (
    <div className="shadow-md w-70 p-5 flex flex-col gap-4">
      <h3 className="text-md font-medium ">Apply Coupon Code</h3>
      <input 
      type="text" 
      name="couponCode" 
      placeholder="Enter code here"
      className="border-gray-300 border-1 
      rounded-md p-1 focus:ring-2 focus:ring-blue-300 
      transition duration-250 focus:outline-none "
      />
      <Link
        to="/"
        className="border-1 bg-gray-900 text-white rounded-md px-5 py-2 
        text-center text-sm font-semibold hover:bg-gray-700
        transition-all gap-2 cursor-pointer"
      >
        Apply coupon
      </Link>
    </div>
  )
}

export default CouponCard