import { useState } from "react"
import { Link } from "react-router-dom"
import FormField from "../components/FormField"
import useUserStore from "../stores/useUserStore"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const { login } = useUserStore()

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <h1 className="my-10 text-3xl font-bold font-serif">Login</h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
        <FormField
          type="email"
          name="email"
          id="email"
          value={formData.email}
          placeholder="E-mail"
          onChange={handleFormChange}
        />
        <FormField
          type="password"
          name="password"
          id="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleFormChange}
        />
        <button
          type="submit"
          className="border-2 border-gray-300
                    hover:bg-gray-900 hover:border-gray-900 hover:text-white
                    transition font-medium  w-75
                    p-2 my-10 rounded-full"
        >
          Login
        </button>
        <p>Don't have an account?
          <Link to="/signup" className="text-blue-700 font-medium mx-2 hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  )
}

export default Login