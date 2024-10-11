import api from "./api"

export const login = async (formData) => {
  return await api.post("/user/auth/login", { formData })
}

export const register = async (formData) => {
  return await api.post("/user/auth/register", { formData })
}
