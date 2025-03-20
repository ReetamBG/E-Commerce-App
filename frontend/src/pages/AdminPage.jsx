import { useState } from "react"
import CreateProductTab from "../components/CreateProductTab"
import ProductListTab from "../components/ProductListTab"
import AnalyticsTab from "../components/AnalyticsTab"

const AdminPage = () => {

  const [activeTab, setActiveTab] = useState("create")
  const handleClick = (id) => {
    setActiveTab(id)
  }

  const tabs = [
    { id: "create", label: "Create Product" },
    { id: "products", label: "Products" },
    { id: "analytics", label: "Analytics" },
  ]

  return (
    <div className="mt-10 flex flex-col items-center text-gray-800">
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>
      <div className="flex gap-5 mb-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { handleClick(tab.id) }}
            className={`border-1 border-gray-400 rounded-full
          px-5 py-2 w-40 flex items-center justify-center text-sm font-semibold 
          hover:shadow-md transition-all ${tab.id === activeTab ? "bg-gray-800 text-white" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === "create" && <CreateProductTab />}
        {activeTab === "products" && <ProductListTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  )
}

export default AdminPage