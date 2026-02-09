import axios from 'axios'

const BASE_URL = 'https://localhost:7110/api/auth'

export const registerEmployee = (data) => {
  return axios.post(`${BASE_URL}/register`, data)
}

export const loginUser = (data) => {
  return axios.post(`${BASE_URL}/login`, data)
}
