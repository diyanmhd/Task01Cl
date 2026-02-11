import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getEmployeeProfile,
  updateEmployeeProfile
} from '../services/employeeService'
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

      // ⬇️ ONLY editable fields
      setFormData({
        designation: res.data.designation || '',
        department: res.data.department || '',
        address: res.data.address || '',
        skillset: res.data.skillset || ''
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
      // ⬇️ DTO-MATCHING PAYLOAD
      await updateEmployeeProfile(profile.id, {
        designation: formData.designation,
        department: formData.department,
        address: formData.address,
        skillset: formData.skillset
      })

      alert('Profile updated successfully')
      setIsEditing(false)
      fetchProfile(profile.id)
    } catch (err) {
      console.error(err)
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
      <div className="card shadow-sm p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Employee Dashboard</h3>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <hr />

        {!isEditing ? (
          <>
            <div className="mb-3">
              <p><b>Name:</b> {profile.name}</p>
              <p><b>Email:</b> {profile.email}</p>
              <p><b>Department:</b> {profile.department}</p>
              <p><b>Designation:</b> {profile.designation}</p>
              <p><b>Address:</b> {profile.address}</p>
              <p><b>Joining Date:</b> {profile.joiningDate}</p>
              <p><b>Skillset:</b> {profile.skillset}</p>
            </div>

            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <>
            {/* Edit Section */}
            <div className="bg-light rounded p-3 mb-3">
              <h5 className="mb-3 fw-semibold">Edit Profile</h5>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">Department</label>
                  <input
                    className="form-control"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Designation</label>
                  <input
                    className="form-control"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Skillset</label>
                  <input
                    className="form-control"
                    name="skillset"
                    value={formData.skillset}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-success" onClick={handleUpdate}>
                Save Changes
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EmployeeDashboard
