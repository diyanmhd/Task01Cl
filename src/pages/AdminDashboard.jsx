import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAllEmployees,
  updateEmployeeByAdmin
} from '../services/adminService'
import { getLoggedInUser, logout } from '../utils/auth'
import 'bootstrap/dist/js/bootstrap.bundle.min'

function AdminDashboard() {
  const navigate = useNavigate()

  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(1)

  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

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

    fetchEmployees(pageNumber)
  }, [navigate, pageNumber])

  const showNotification = (message) => {
    setToastMessage(message)
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 3500)
  }

  const fetchEmployees = async (page) => {
    try {
      const res = await getAllEmployees(page, pageSize)
      setEmployees(res.data.items)
      const total = res.data.totalCount
      setTotalPages(Math.ceil(total / pageSize))
    } catch {
      showNotification('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

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

  const handleUpdate = async () => {
    try {
      await updateEmployeeByAdmin(selectedEmployee.id, formData)
      showNotification('Employee updated successfully')
      setSelectedEmployee(null)
      fetchEmployees(pageNumber)
    } catch {
      showNotification('Update failed')
    }
  }

  const toggleStatus = async (emp) => {
    try {
      await updateEmployeeByAdmin(emp.id, {
        ...emp,
        status: emp.status === 'Active' ? 'Inactive' : 'Active'
      })
      showNotification('Status updated successfully')
      fetchEmployees(pageNumber)
    } catch {
      showNotification('Status update failed')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    )
  }

  return (
    <div className="container-fluid px-4 py-4 bg-light min-vh-100">

      <div className="card shadow-sm border-0 rounded-3">

        {/* HEADER */}
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Admin Dashboard</h4>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="card-body p-4">

          {/* TABLE */}
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
                    <td className="fw-semibold">{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="form-check form-switch m-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={emp.status === 'Active'}
                            onChange={() => toggleStatus(emp)}
                          />
                        </div>
                        <span
                          className={`badge ${
                            emp.status === 'Active'
                              ? 'bg-success'
                              : 'bg-danger'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </div>
                    </td>

                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <nav>
            <ul className="pagination justify-content-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${
                    pageNumber === index + 1 ? 'active' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPageNumber(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* EDIT SECTION (FIXED) */}
          {selectedEmployee && (
            <>
              <hr className="my-4" />

              <div className="card shadow-sm border-0 p-4 bg-white">
                <h5 className="fw-semibold mb-4">Edit Employee</h5>

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

                <div className="text-end mt-3">
                  <button
                    className="btn btn-success me-2"
                    onClick={handleUpdate}
                  >
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

      {/* PROFESSIONAL LARGE TOAST */}
      {showToast && (
        <div className="position-fixed top-0 end-0 p-4" style={{ zIndex: 9999 }}>
          <div
            className="toast show shadow-lg border-0"
            style={{ minWidth: '320px' }}
          >
            <div className="toast-header bg-primary text-white">
              <strong className="me-auto fs-6">Notification</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body fs-6 py-3">
              {toastMessage}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboard
