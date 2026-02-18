import api from './api'   // 🔥 use interceptor version

const BASE_URL = '/employee'

// 🔐 No userId needed anymore
export const getEmployeeProfile = () => {
  return api.get(`${BASE_URL}/profile`)
}

export const updateEmployeeProfile = (id, data) => {
  return api.put(`${BASE_URL}/${id}`, data)
}

export const updateEmployeePhoto = (id, formData) => {
  return api.put(`${BASE_URL}/${id}/photo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
