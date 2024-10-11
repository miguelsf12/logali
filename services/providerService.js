import api from "./api"

export const addservice = async (formData, token) => {
  return await api.post("/user/provider/addservice", {
    formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const editservice = async (formData) => {
  return await api.patch("/user/provider/editservice", { formData })
}
