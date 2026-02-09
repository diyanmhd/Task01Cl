import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import EmployeeDashboard from './pages/EmployeeDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  )
}

export default App
