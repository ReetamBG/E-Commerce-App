import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.mode === "development" ? "http://localhost:8000/api" : "http://localhost:8000/api",
  // import.meta.mode is a built-in feature in Vite
  withCredentials: true // send cookies along with requests
})

export default axiosInstance