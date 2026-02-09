import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEmployeeProfile, updateEmployeeProfile } from '../services/employeeService'
import { getLoggedInUser, logout } from '../utils/auth'

function EmployeeDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getLoggedInUser()

    if (!user) {
      navigate('/login')
      return
    }

    // 🔒 block admin
    if (user.role.toLowerCase() !== 'employee') {
      navigate('/admin')
      return
    }

    fetchProfile(user.userId)
  }, [navigate])

  const fetchProfile = async (userId) => {
    try {
      const res = await getEmployeeProfile(userId)
      setProfile(res.data)

      // IMPORTANT: preload full backend DTO
      setFormData({
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        designation: res.data.designation,
        department: res.data.department,
        address: res.data.address,
        joiningDate: res.data.joiningDate?.split('T')[0],
        skillset: res.data.skillset
      })
    } catch {
      alert('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleUpdate = async () => {
    try {
      // Send EXACT backend format
      const payload = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        designation: formData.designation,
        department: formData.department,
        address: formData.address,
        joiningDate: formData.joiningDate,
        skillset: formData.skillset
      }

      await updateEmployeeProfile(formData.id, payload)
      setIsEditing(false)
      fetchProfile(formData.id)
    } catch {
      alert('Update failed')
    }
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
          <h3>Employee Dashboard</h3>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>

        <hr />

        {!isEditing ? (
          <>
            <p><b>Name:</b> {profile.name}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Department:</b> {profile.department}</p>
            <p><b>Designation:</b> {profile.designation}</p>
            <p><b>Address:</b> {profile.address}</p>
            <p><b>Joining Date:</b> {profile.joiningDate}</p>
            <p><b>Skillset:</b> {profile.skillset}</p>

            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <h5>Edit Profile</h5>

            <div className="row">
              <div className="col-md-6 mb-2">
                <label>Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-2">
                <label>Email</label>
                <input
                  className="form-control"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div className="col-md-6 mb-2">
                <label>Department</label>
                <input
                  className="form-control"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-2">
                <label>Designation</label>
                <input
                  className="form-control"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-2">
                <label>Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-2">
                <label>Skillset</label>
                <input
                  className="form-control"
                  name="skillset"
                  value={formData.skillset}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-2">
                <label>Address</label>
                <input
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn btn-success me-2" onClick={handleUpdate}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default EmployeeDashboard
