import axios from 'axios'

const BASE_URL = 'https://localhost:7110/api/auth'

export const registerEmployee = (formData) => {
  return axios.post(`${BASE_URL}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


export const loginUser = (data) => {
  return axios.post(`${BASE_URL}/login`, data)
}
