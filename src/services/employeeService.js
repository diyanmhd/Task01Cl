import axios from 'axios'

const BASE_URL = 'https://localhost:7110/api/employee'

export const getEmployeeProfile = (userId) => {
  return axios.get(`${BASE_URL}/profile`, {
    params: { userId }
  })
}

export const updateEmployeeProfile = (id, data) => {
  return axios.put(`${BASE_URL}/${id}`, data)
}

export const updateEmployeePhoto = (id, formData) => {
  return axios.put(`${BASE_URL}/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
