import axios from 'axios'

const BASE_URL = 'https://localhost:7110/api/admin'

// Get employees with search, filter, sort, pagination
export const getAllEmployees = (
  pageNumber = 1,
  pageSize = 10,
  search = '',
  status = '',
  sortBy = '',
  sortOrder = ''
) => {
  return axios.get(`${BASE_URL}/employees`, {
    params: {
      pageNumber,
      pageSize,
      search: search || undefined,
      status: status || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined
    }
  })
}

// Update employee
export const updateEmployeeByAdmin = (id, data) => {
  return axios.put(`${BASE_URL}/employee/${id}`, data)
}
