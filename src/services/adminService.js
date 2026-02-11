import axios from 'axios'

const BASE_URL = 'https://localhost:7110/api/admin'

// Get all employees (Admin)
export const getAllEmployees = () => {
  return axios.get(`${BASE_URL}/employees`)
}

// Update employee (details + enable/disable)
export const updateEmployeeByAdmin = (id, data) => {
  return axios.put(`${BASE_URL}/employee/${id}`, data)
}
