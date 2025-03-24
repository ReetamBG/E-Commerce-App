import { useEffect, useState } from "react"
import axios from "../lib/axios"
import ProductCard from "../components/ProductCard"

const RecommendedProducts = () => {
  const [products, setProducts] = useState([])
  useEffect(() => {
    const getRecommendations = async () => {
      const res = await axios.get("/products/recommended")
      console.log(res.data.products)
      setProducts(res.data.products)
    }
    getRecommendations()
  }, [])

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <h1 className="text-gray-800 text-3xl font-semibold mb-10 items-start">
        People also bought
        </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((product) => {
          return <ProductCard key={product._id} product={product}/>
        })}
      </div>
    </div>
  )
}

export default RecommendedProducts