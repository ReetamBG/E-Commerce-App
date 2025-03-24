import { useParams } from "react-router-dom"
import useProductStore from "../stores/useProductStore"
import { useEffect } from "react"
import ProductCard from "../components/ProductCard"

const CategoryPage = () => {
  const { category } = useParams()
  const { getProductsByCategory, products } = useProductStore()

  useEffect(() => {
    getProductsByCategory(category)
  }, [])

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <h1 className="text-gray-800 text-3xl font-semibold mb-10">Explore {category}</h1>
      {products.length === 0 && (<h3>No products found</h3>)}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => {
          return <ProductCard key={product._id} product={product} />
        })}
      </div>
    </div>
  )
}

export default CategoryPage