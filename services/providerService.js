import api from "./api"

export const addservice = async (formData, token) => {
  return await api.post("/user/provider/addservice", formData, token)
}

export const editservice = async (formData, id, token) => {
  return await api.patch(`/user/provider/editservice/${id}`, formData, token)
}
