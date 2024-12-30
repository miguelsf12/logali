const BASE_URL = "https://api-logali.onrender.com" // ATIVAR NO RENDER
// const BASE_URL = "http://192.168.1.6:3000" // IP PODE VARIAR

const api = {
  get: async (path, token) => {
    const headers = {
      "Content-Type": "application/json",
    }

    // Adiciona o token ao cabeçalho apenas se ele existir
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: headers,
    })

    return response.json()
  },
  post: async (path, data, token) => {
    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    let body

    if (data instanceof FormData) {
      body = data
    } else {
      headers["Content-Type"] = "application/json"
      body = JSON.stringify(data)
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: headers,
      body: body,
    })

    return response.json()
  },
  patch: async (path, data, token) => {
    const headers = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    let body

    if (data instanceof FormData) {
      body = data
    } else {
      headers["Content-Type"] = "application/json"
      body = JSON.stringify(data)
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: headers,
      body: body,
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
