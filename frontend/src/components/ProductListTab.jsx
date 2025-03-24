import React from "react";
import useProductStore from "../stores/useProductStore";
import { MdDeleteForever } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const ProductListTab = () => {
  const { products, toggleFeatured, deleteProduct } = useProductStore();

  return (
    <div className="overflow-hidden rounded-lg border-2 border-gray-300">
      <table>
        <thead className="bg-gray-100">
          <tr>
            <th className="px-10 py-3">Product</th>
            <th className="px-10 py-3">Name</th>
            <th className="px-10 py-3">Category</th>
            <th className="px-10 py-3">Is Featured</th>
            <th className="px-10 py-3">Price</th>
            <th className="px-10 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {products.map((product, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-10 py-3">
                <img src={product.image} className="rounded-full h-10 w-10 object-cover" />
              </td>
              <td className="px-10 py-3 text-center">{product.name}</td>
              <td className="px-10 py-3 text-center">{product.category}</td>
              <td className="px-10 py-3 flex justify-center">
                {product.isFeatured ?
                  <FaStar size={20} className="cursor-pointer" onClick={() => toggleFeatured(product._id)} />
                  : <FaRegStar size={20} className="cursor-pointer" onClick={() => toggleFeatured(product._id)} />}
              </td>
              <td className="px-10 py-3 text-center">{product.price}</td>
              <td className="px-10 py-3 flex justify-center">
                <MdDeleteForever size={25} className="cursor-pointer" onClick={() => deleteProduct(product._id)}/>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListTab;
