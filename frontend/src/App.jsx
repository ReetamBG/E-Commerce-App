import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import AdminPage from "./pages/AdminPage"
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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
