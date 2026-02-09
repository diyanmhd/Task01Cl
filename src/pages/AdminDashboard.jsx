import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAllEmployees,
  updateEmployeeByAdmin,
  deleteEmployeeByAdmin
} from '../services/adminService'
import { getLoggedInUser, logout } from '../utils/auth'

function AdminDashboard() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getLoggedInUser()

    if (!user) {
      navigate('/login')
      return
    }

    // 🔒 BLOCK EMPLOYEES
    if (user.role.toLowerCase() !== 'admin') {
      navigate('/employee')
      return
    }

    fetchEmployees()
  }, [navigate])

  const fetchEmployees = async () => {
    try {
      const res = await getAllEmployees()
      setEmployees(res.data)
    } catch {
      alert('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSelectedEmployee({ ...selectedEmployee, [name]: value })
  }

  const handleUpdate = async () => {
    try {
      await updateEmployeeByAdmin(selectedEmployee.id, selectedEmployee)
      setSelectedEmployee(null)
      fetchEmployees()
    } catch {
      alert('Update failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this employee?')) return
    await deleteEmployeeByAdmin(id)
    fetchEmployees()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) return <div className="text-center mt-5">Loading...</div>

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <div className="d-flex justify-content-between">
          <h3>Admin Dashboard</h3>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>

        <hr />

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Dept</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2"
                    onClick={() => setSelectedEmployee(emp)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(emp.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedEmployee && (
          <>
            <hr />
            <input className="form-control mb-2" name="name"
              value={selectedEmployee.name} onChange={handleChange} />
            <input className="form-control mb-2" name="department"
              value={selectedEmployee.department} onChange={handleChange} />
            <input className="form-control mb-2" name="designation"
              value={selectedEmployee.designation} onChange={handleChange} />

            <button className="btn btn-success me-2" onClick={handleUpdate}>Save</button>
            <button className="btn btn-secondary" onClick={() => setSelectedEmployee(null)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
