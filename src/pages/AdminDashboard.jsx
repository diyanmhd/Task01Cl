import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAllEmployees,
  updateEmployeeByAdmin
} from '../services/adminService'
import { getLoggedInUser, logout } from '../utils/auth'

function AdminDashboard() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getLoggedInUser()

    if (!user) {
      navigate('/login')
      return
    }

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

  // =========================
  // EDIT
  // =========================
  const handleEdit = (emp) => {
    setSelectedEmployee(emp)
    setFormData({
      designation: emp.designation || '',
      department: emp.department || '',
      address: emp.address || '',
      skillset: emp.skillset || '',
      status: emp.status || 'Active'
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // =========================
  // UPDATE (DTO-ONLY PAYLOAD)
  // =========================
  const handleUpdate = async () => {
    try {
      await updateEmployeeByAdmin(selectedEmployee.id, {
        designation: formData.designation,
        department: formData.department,
        address: formData.address,
        skillset: formData.skillset,
        status: formData.status
      })

      alert('Employee updated successfully')
      setSelectedEmployee(null)
      fetchEmployees()
    } catch (err) {
      alert('Update failed')
    }
  }

  // =========================
  // ENABLE / DISABLE
  // =========================
  const toggleStatus = async (emp) => {
    try {
      await updateEmployeeByAdmin(emp.id, {
        designation: emp.designation,
        department: emp.department,
        address: emp.address,
        skillset: emp.skillset,
        status: emp.status === 'Active' ? 'Inactive' : 'Active'
      })

      fetchEmployees()
    } catch {
      alert('Status update failed')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) return <div className="text-center mt-5">Loading...</div>

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Admin Dashboard</h3>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <hr />

        {/* Employee Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
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
                    <span
                      className={
                        emp.status === 'Active'
                          ? 'badge bg-success'
                          : 'badge bg-secondary'
                      }
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className={
                        emp.status === 'Active'
                          ? 'btn btn-sm btn-outline-warning'
                          : 'btn btn-sm btn-outline-success'
                      }
                      onClick={() => toggleStatus(emp)}
                    >
                      {emp.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Section */}
        {selectedEmployee && (
          <>
            <hr />

            <div className="bg-light rounded p-3">
              <h5 className="fw-semibold mb-3">Edit Employee</h5>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Department</label>
                  <input
                    className="form-control"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Designation</label>
                  <input
                    className="form-control"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-success" onClick={handleUpdate}>
                  Save Changes
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedEmployee(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
