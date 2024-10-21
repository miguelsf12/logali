import api from "./api"

export const getAllServices = async (token) => {
  return await api.get("/user/service/get-all-services", token)
}

export const getServicesFiltered = async (filters = {}, token) => {
  const { category, name, radius } = filters

  // Monta a query string com base nos filtros fornecidos
  const queryParams = new URLSearchParams()
  if (radius) queryParams.append("radius", radius)
  if (category) queryParams.append("category", category)
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
