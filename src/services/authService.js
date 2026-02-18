import axios from 'axios'

const BASE_URL = 'https://localhost:7110/api/auth'

// ✅ Register
export const registerEmployee = (formData) => {
  return axios.post(`${BASE_URL}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// ✅ Login
export const loginUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data)

  const { token, userId, name, role } = response.data

  // 🔐 Store JWT separately
  localStorage.setItem('token', token)
  localStorage.setItem('userId', userId)
  localStorage.setItem('name', name)
  localStorage.setItem('role', role)

  return response.data
}
