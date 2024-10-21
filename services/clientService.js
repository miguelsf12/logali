import api from "./api"

export const getUserProfile = async (token) => {
  return await api.get("/user/client/get-user-profile", token)
}
export const sendActualLocation = async (address, token) => {
  return await api.post("/user/client/send-actual-location", { address }, token)
}
