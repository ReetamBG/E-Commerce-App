import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import AdminPage from "./pages/AdminPage"
import CartPage from "./pages/CartPage"
import CategoryPage from "./pages/CategoryPage"
import useUserStore from "./stores/useUserStore"
import LoadingSpinner from "./components/LoadingSpinner"
import useCartStore from "./stores/useCartStore"

function App() {
  const { user, checkingAuth, checkAuth } = useUserStore()
  const { getCartItems } = useCartStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(()=>{
    if(user){
      getCartItems()
    }
  }, [user, getCartItems])

  if (checkingAuth) {
    return <LoadingSpinner />
  }

  return (
    <BrowserRouter>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<HomePage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
