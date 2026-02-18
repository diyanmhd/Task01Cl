import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  updateEmployeePhoto
} from '../services/employeeService'
import { getLoggedInUser, logout } from '../utils/auth'
import 'bootstrap/dist/css/bootstrap.min.css'

function EmployeeDashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [showToast, setShowToast] = useState(false)

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

   fetchProfile()

  }, [navigate])

  const showNotification = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 3500)
  }

const fetchProfile = async () => {
  try {
    const res = await getEmployeeProfile()  // 🔐 no userId needed
    setProfile(res.data)

    setFormData({
      designation: res.data.designation || '',
      department: res.data.department || '',
      address: res.data.address || '',
      skillset: res.data.skillset || ''
    })

  } catch {
    showNotification('Failed to load profile', 'danger')
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
      await updateEmployeeProfile(profile.id, formData)
      showNotification('Profile updated successfully!', 'success')
      setIsEditing(false)
      fetchProfile(profile.id)
    } catch {
      showNotification('Update failed', 'danger')
    }
  }

  // PHOTO HANDLERS
  const handlePhotoChange = (e) => {
    setSelectedPhoto(e.target.files[0])
  }

  const handlePhotoUpload = async () => {
    if (!selectedPhoto) {
      showNotification('Please select a photo', 'danger')
      return
    }

    try {
      const form = new FormData()
      form.append('photo', selectedPhoto)

      await updateEmployeePhoto(profile.id, form)

      showNotification('Photo updated successfully!', 'success')
      fetchProfile(profile.id)
      setSelectedPhoto(null)
    } catch {
      showNotification('Photo update failed', 'danger')
    }
  }

  const handleRemovePhoto = async () => {
    try {
      const form = new FormData()
      await updateEmployeePhoto(profile.id, form)

      showNotification('Photo removed successfully!', 'success')
      fetchProfile(profile.id)
    } catch {
      showNotification('Failed to remove photo', 'danger')
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
    <div className="container-fluid bg-light min-vh-100 py-4 px-5">

      <div className="card shadow-sm border-0 rounded-3">

        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center px-4 py-3">
          <h4 className="mb-0 fw-semibold">Employee Dashboard</h4>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="card-body px-5 py-4">

          {!isEditing ? (
            <div className="row align-items-start">

              <div className="col-lg-3 border-end text-center pe-4">

                {/* SHOW PHOTO ONLY IF EXISTS */}
                {profile.photo ? (
                  <img
                    src={`data:image/*;base64,${profile.photo}`}
                    alt="Profile"
                    className="rounded-circle shadow-sm mb-3"
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                      border: '4px solid #dee2e6'
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle shadow-sm mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '150px',
                      height: '150px',
                      border: '4px solid #dee2e6',
                      backgroundColor: '#f8f9fa',
                      fontSize: '40px',
                      fontWeight: 'bold',
                      color: '#6c757d'
                    }}
                  >
                    {profile.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <h5 className="fw-bold mb-1">{profile.name}</h5>
                <p className="text-muted small mb-2">{profile.email}</p>

                <span className="badge bg-primary px-3 py-2">
                  {profile.designation}
                </span>
              </div>

              <div className="col-lg-9 ps-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-semibold mb-0">Professional Information</h5>
               <button
  className="btn btn-sm p-0 border-0 bg-transparent"
  onClick={() => setIsEditing(true)}
  title="Edit Profile"
>
  <i className="bi bi-pencil-square text-dark fs-5"></i>
</button>

                </div>

                <hr />

                <div className="row mt-4">
                  <div className="col-md-6 mb-4">
                    <label className="text-muted small">Department</label>
                    <p className="fw-semibold">{profile.department}</p>
                  </div>

                  <div className="col-md-6 mb-4">
                    <label className="text-muted small">Joining Date</label>
                    <p className="fw-semibold">
                      {profile.joiningDate?.split('T')[0]}
                    </p>
                  </div>

                  <div className="col-md-12 mb-4">
                    <label className="text-muted small">Address</label>
                    <p className="fw-semibold">{profile.address}</p>
                  </div>

                  <div className="col-md-12">
                    <label className="text-muted small">Skillset</label>
                    <div className="mt-2">
                      {profile.skillset?.split(',').map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-secondary me-2 mb-2 px-3 py-2"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h5 className="fw-semibold mb-4">Edit Profile</h5>

              <div className="row mb-4 text-center">
                <div className="col-md-12">

                  {profile.photo && (
                    <img
                      src={`data:image/*;base64,${profile.photo}`}
                      alt="Profile"
                      className="rounded-circle shadow-sm mb-3"
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        border: '4px solid #dee2e6'
                      }}
                    />
                  )}

                  <input
                    type="file"
                    
                    className="form-control mb-2"
                    onChange={handlePhotoChange}
                  />
                  
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={handlePhotoUpload}
                  >
                    Upload Photo
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleRemovePhoto}
                  >
                    Remove Photo
                  </button>

                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label htmlFor="department" className="form-label">
  Department
</label>
<input
  id="department"
  className="form-control"
  name="department"
  value={formData.department}
  onChange={handleChange}
/>

                </div>

                <div className="col-md-6 mb-4">
<label htmlFor="designation" className="form-label">
  Designation
</label>
<input
  id="designation"
  className="form-control"
  name="designation"
  value={formData.designation}
  onChange={handleChange}
/>

                </div>

                <div className="col-md-6 mb-4">
 <label htmlFor="skillset" className="form-label">
  Skillset
</label>
<input
  id="skillset"
  className="form-control"
  name="skillset"
  value={formData.skillset}
  onChange={handleChange}
/>

                </div>

                <div className="col-md-12 mb-4">
  <label htmlFor="address" className="form-label">
  Address
</label>
<input
  id="address"
  className="form-control"
  name="address"
  value={formData.address}
  onChange={handleChange}
/>

                </div>
              </div>

              <div className="text-end">
                <button
                  className="btn btn-success me-2"
                  onClick={handleUpdate}
                >
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

      {showToast && (
        <div className="position-fixed top-0 end-0 p-4" style={{ zIndex: 9999 }}>
          <div className="toast show shadow-lg border-0" style={{ minWidth: '360px' }}>
            <div className={`toast-header text-white bg-${toastType}`}>
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

export default EmployeeDashboard
