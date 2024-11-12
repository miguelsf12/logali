import api from "./api"

export const login = async (form) => {
  return await api.post("/user/auth/login", form)
}

export const register = async (form) => {
  return await api.post("/user/auth/register", form)
}

export const check_auth = async (token) => {
  return await api.get("/user/auth/check-auth", token)
}

export const changePassword = async (form) => {
  return await api.patch("/user/auth/change-password", form)
}
