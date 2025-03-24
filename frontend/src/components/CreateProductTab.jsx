import React from 'react'
import { useState } from 'react'
import FormField from "../components/FormField"
import useProductStore from '../stores/useProductStore'

const CreateProductTab = () => {
  const productCategories = ["Jackets", "Shirts", "Jeans", "Suits", "Shoes", "Bags"]
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: ""
  })

  const handleFormChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
  }

  // converts image to Base64 and stores it in product.image
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()   // create the reader
    reader.readAsDataURL(file)        // convert to Base64 string
    reader.onload = () => { 
      setProduct({...product, image: reader.result})
    }
  }

  const { createProduct } = useProductStore()

  const handleFormSubmit = (e) => {
    e.preventDefault()
    createProduct(product)
    setProduct({name: "", description: "", category: "", price: "", image: ""})
    document.getElementById("imageUpload").value = ""
  }

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col items-center border-2 border-gray-300 px-10 py-5 rounded-xl mb-10">
      <h3 className="font-medium text-gray-900 font-serif text-xl mb-3">Enter product details</h3>

      {/* product name */}
      <FormField
        type="text"
        name="name"
        value={product.name}
        placeholder="Enter product name"
        onChange={handleFormChange}
      />

      {/* product description */}
      <textarea
        name="description"
        value={product.description}
        onChange={handleFormChange}
        className="m-2 p-3 border border-gray-300 
                rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-blue-300 transition duration-250"
        placeholder="Enter product description"
      >
      </textarea>

      {/* product price */}
      <FormField
        type="number"
        name="price"
        step="0.1"
        value={product.price}
        placeholder="Enter price"
        onChange={handleFormChange}
      />

      {/* product category */}
      <select
        name="category"
        onChange={handleFormChange}
        value={product.category}
        className="m-2 p-3 border border-gray-300 
                rounded-lg focus:outline-none w-75
                focus:ring-2 focus:ring-blue-300 transition duration-250"
      >
        <option value="others">Select Category</option>
        {productCategories.map(category => (
          <option value={category} key={category}>{category}</option>
        ))}
      </select>

      {/* product image */}
      <input
        type="file"
        accept=".jpg, .jpeg, .png"
        id="imageUpload"
        name="image"
        onChange={handleImageChange}
        className="m-2 p-3 border border-gray-300 
                rounded-lg focus:outline-none w-75
                focus:ring-2 focus:ring-blue-300 transition duration-250"
      />
      <button
        type="submit"
        className="border-gray-300 border-2 font-medium rounded-full w-75
        py-2 my-5 hover:border-white hover:bg-gray-900 hover:text-white transition"
      >
        Create
      </button>
    </form>
  )
}

export default CreateProductTab