import { Link } from "react-router-dom"

const CategoryCard = ({ name, imageURL }) => {
  return (
    <div className="w-100 h-100 relative overflow-hidden">
      <Link to={`/category/${name}`} >
        <img
          src={imageURL}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover absolute top-0 hover:scale-105 transition"
        />
        <div className="absolute bottom-7 left-10 text-white">
          <h3 className="font-bold text-2xl">{name}</h3>
          <p>Explore {name}</p>
        </div>
      </Link>
    </div>
  )
}

export default CategoryCard