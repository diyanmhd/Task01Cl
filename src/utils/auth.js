export const getLoggedInUser = () => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const userId = localStorage.getItem('userId')
  const name = localStorage.getItem('name')

  if (!token || !role || !userId) return null

  return {
    token,
    role,
    userId,
    name
  }
}

export const logout = () => {
  localStorage.clear()
}
