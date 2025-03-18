import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "./components/Navbar"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { Toaster } from "react-hot-toast"
import useUserStore from "./stores/useUserStore"
import LoadingSpinner from "./components/LoadingSpinner"

function App() {
  const { user, checkingAuth, checkAuth } = useUserStore()
  useEffect(() => {
    checkAuth()
  }, [])

  if (checkingAuth) {
    return <LoadingSpinner />
  }
  
  return (
    <BrowserRouter>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<h1></h1>} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
