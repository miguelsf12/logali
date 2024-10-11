import api from "./api"

export const sendActualLocation = async (address) => {
  return await api.post("/user/client/send-actual-location", { address })
}
