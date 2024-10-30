import api from "./api"

export const getUserProfile = async (token) => {
  return await api.get("/user/client/get-user-profile", token)
}

export const editUser = async (formData, id, token) => {
  return await api.patch(`/user/client/edit/${id}`, formData, token)
}
export const sendActualLocation = async (address, token) => {
  return await api.post("/user/client/send-actual-location", { address }, token)
}
