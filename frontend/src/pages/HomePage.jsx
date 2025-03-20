import CategoryCard from "../components/CategoryCard"

const categories = [
  { name: "Jackets", imageURL: "/images/jacketsCategory.jpg" },
  { name: "Shirts", imageURL: "/images/tshirtsCategory.jpg" },
  { name: "Jeans", imageURL: "/images/jeansCategory.jpg" },
  { name: "Suits", imageURL: "/images/suitsCategory.jpg" },
  { name: "Shoes", imageURL: "/images/shoesCategory.jpg" },
  { name: "Bags", imageURL: "/images/bagsCategory.jpg" }
]

const HomePage = () => {
  return (
    <div className="w-full mt-20 flex flex-col justify-center items-center">
      <div className="text-center mb-6 text-gray-800">
        <h1 className="text-3xl font-bold mb-2">Explore Our Categories</h1>
        <p>Discover the latest trends in fashion</p>
      </div>
      {/* categories section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {categories.map((category, index) => {
          return <CategoryCard
            key={index}
            name={category.name}
            imageURL={category.imageURL}
          />
        })}
      </div>
    </div>
  )
}

export default HomePage