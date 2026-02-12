import axios from 'axios'

const BASE_URL = 'https://localhost:7110/api/admin'

// Get paginated employees
export const getAllEmployees = (pageNumber = 1, pageSize = 10) => {
  return axios.get(`${BASE_URL}/employees`, {
    params: { pageNumber, pageSize }
  })
}

// Update employee (details + enable/disable)
export const updateEmployeeByAdmin = (id, data) => {
  return axios.put(`${BASE_URL}/employee/${id}`, data)
}
