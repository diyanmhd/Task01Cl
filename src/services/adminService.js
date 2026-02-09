import axios from 'axios'

const BASE_URL = 'https://localhost:7110/api/admin'

export const getAllEmployees = () => {
  return axios.get(`${BASE_URL}/employees`)
}

export const updateEmployeeByAdmin = (id, data) => {
  return axios.put(`${BASE_URL}/employee/${id}`, data)
}

export const deleteEmployeeByAdmin = (id) => {
  return axios.delete(`${BASE_URL}/employee/${id}`)
}
