import { useState } from "react"
import { Link } from "react-router-dom"
import FormField from "../components/FormField"
import useUserStore from "../stores/useUserStore"

const Signup = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const { signup } = useUserStore()
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    // console.log(formData)
    signup(formData)
  }

  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <h1 className="my-10 text-3xl font-bold font-serif">Sign Up</h1>
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center">
        <FormField
          type="text"
          name="name"
          id="name"
          value={formData.name}
          placeholder="Name"
          onChange={handleFormChange}
        />
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
        <FormField

          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm Password"
          onChange={handleFormChange}
        />
        <button
          type="submit"
          className="border-2 border-gray-300
                    hover:bg-gray-900 hover:border-gray-900 hover:text-white
                    transition font-medium  w-75
                    p-2 my-10 rounded-full"
        >
          Sign Up
        </button>
        <p>Already have an account?
          <Link to="/login" className="text-blue-700 font-medium mx-2 hover:underline">Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Signup