import api from "./api"

export const login = async (formData) => {
  return await api.post("/user/auth/login", { formData })
}

export const register = async (formData) => {
  return await api.post("/user/auth/register", { formData })
}

export const check_auth = async (token) => {
  return await api.get("/user/auth/check-auth")
}

export const changePassword = async (form) => {
  return await api.patch("/user/auth/change-password", form)
}
