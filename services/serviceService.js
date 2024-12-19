import api from "./api"
import categories from "../category.json"

export const getAllServices = async (token) => {
  return await api.get("/user/service/get-all-services", token)
}

export const getServicesFiltered = async (filters = {}, token) => {
  const { category, name, radius } = filters

  const validCategory = categories.find((cat) =>
    category?.toLowerCase().includes(cat.name.toLowerCase())
  )

  // Monta a query string com base nos filtros fornecidos
  const queryParams = new URLSearchParams()
  if (radius) queryParams.append("radius", radius)
  if (validCategory) {
    queryParams.append("category", validCategory.name)
  }
  if (name) queryParams.append("name", name)
    
  return await api.get(
    `/user/service/get-services-filtered?${queryParams.toString()}`,
    token
  )
}

export const getRoutesToService = async (id, token) => {
  return await api.get(`/user/service/get-routes-to-service/${id}`, token)
}

export const getMyService = async (token) => {
  return await api.get("/user/service/get-my-service", token)
}

export const getServiceById = async (id, token) => {
  return await api.get(`/user/service/get-service-by-id/${id}`, token)
}
