import { Link } from "react-router-dom";
import { HiMiniUserPlus } from "react-icons/hi2";     // signup icon
import { LiaShopware } from "react-icons/lia";
import { IoIosLogOut } from "react-icons/io";
import useUserStore from "../stores/useUserStore";
import useCartStore from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore()
  const isAdmin = user?.role === "admin"
  const { cartItems } = useCartStore()

  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      <div className="flex justify-between py-6 px-15 text-gray-800 relative">
        <Link to="/" className="text-2xl font-bold flex gap-2"><LiaShopware />ReeKart</Link>
        <nav className="flex gap-5 items-center">
          <div className="absolute left-1/2 -translate-x-1/2 px-10 flex gap-10 text-sm">
            <Link to="/" className="hover:underline underline-offset-5">HOME</Link>
            <Link to="/products" className="hover:underline underline-offset-5">PRODUCTS</Link>
            {user && (
              <>
                <Link to="/cart" className="relative hover:underline underline-offset-5">
                  {cartItems.length > 0 && (
                    <span className="bg-black text-white text-xs rounded-full px-2 py-1 absolute -top-4 -left-4">
                      {cartItems.length}
                    </span>
                  )}
                  CART
                </Link>
                {isAdmin && (
                  <Link to="/dashboard" className="hover:underline underline-offset-5">DASHBOARD</Link>
                )}
              </>
            )}
          </div>
          {user ? (
            <button onClick={logout} className="border-1 border-gray-400 rounded-full px-5 py-2 flex items-center text-sm font-semibold hover:shadow-lg transition-all gap-2"><IoIosLogOut size={20} />LOGOUT</button>
          ) : (
            <>
              <Link to="/login" className="border-1 border-gray-400 rounded-full px-5 py-2 flex items-center text-sm font-semibold hover:shadow-lg transition-all gap-2"><IoIosLogOut size={20} />LOGIN</Link>
              <Link to="/signup" className="bg-gray-900 rounded-full px-7 py-2 text-white flex items-center text-sm font-semibold  hover:shadow-lg transition-all gap-2">SIGN UP</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar