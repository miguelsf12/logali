const BASE_URL = "http://192.168.1.4:3000" // IP PODE VARIAR

const api = {
  get: async (path) => {
    const response = await fetch(`${BASE_URL}${path}`)
    return response.json()
  },
  post: async (path, data) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },
  patch: async (path, data) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },
  delete: async (path) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
    })
    return response.json()
  },
}

export default api
