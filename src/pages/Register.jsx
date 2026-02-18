import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerEmployee } from '../services/authService'

function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')
  const [showToast, setShowToast] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    designation: '',
    department: '',
    address: '',
    joiningDate: '',
    skillset: '',
    photo: null
  })

  const showNotification = (message, type = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
      if (type === 'success') {
        navigate('/login')
      }
    }, 3000)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFormData({ ...formData, photo: file })

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const data = new FormData()

    data.append('Name', formData.name)
    data.append('Username', formData.username)
    data.append('Email', formData.email)
    data.append('Password', formData.password)
    data.append('Designation', formData.designation)
    data.append('Department', formData.department)
    data.append('Address', formData.address)
    data.append('JoiningDate', formData.joiningDate)
    data.append('Skillset', formData.skillset)

    if (formData.photo) {
      data.append('Photo', formData.photo)
    }

    try {
      await registerEmployee(data)
      showNotification('Registration successful!', 'success')
    } catch (err) {
      console.error(err)
      setError(err.response?.data || 'Registration failed')
      showNotification('Registration failed', 'danger')
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)'
      }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">

            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-2">Employee Registration</h3>
                  <p className="text-muted mb-0">
                    Create your professional account
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger text-center small">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                <label className="form-label fw-semibold">Profile</label>

                  <div className="row g-3">

                    {/* IMAGE (Only show if selected) */}
                    {imagePreview && (
                      <div className="col-12 text-center mb-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="rounded-circle shadow-sm"
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'cover',
                            border: '4px solid #dee2e6'
                          }}
                        />
                      </div>
                    )}

                    <div className="col-12 mb-2">
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>

                    <div className="col-md-6">
<label htmlFor="name" className="form-label fw-semibold">Name</label>
<input
  id="name"
  className="form-control"
  value={formData.name}
  onChange={(e) =>
    setFormData({ ...formData, name: e.target.value })
  }
  required
/>

                    </div>

                    <div className="col-md-6">
<label htmlFor="username" className="form-label fw-semibold">
  Username
</label>
<input
  id="username"
  className="form-control"
  value={formData.username}
  onChange={(e) =>
    setFormData({ ...formData, username: e.target.value })
  }
  required
/>

                    </div>

                    <div className="col-md-6">
  <label htmlFor="email" className="form-label fw-semibold">
  Email
</label>
<input
  id="email"
  type="email"
  className="form-control"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
  required
/>

                    </div>

                    <div className="col-md-6">
   <label htmlFor="password" className="form-label fw-semibold">
  Password
</label>
<input
  id="password"
  type="password"
  className="form-control"
  value={formData.password}
  onChange={(e) =>
    setFormData({ ...formData, password: e.target.value })
  }
  required
/>

                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Designation</label>
                      <input
                        className="form-control"
                        value={formData.designation}
                        onChange={(e) =>
                          setFormData({ ...formData, designation: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Department</label>
                      <input
                        className="form-control"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Joining Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.joiningDate}
                        onChange={(e) =>
                          setFormData({ ...formData, joiningDate: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Address</label>
                      <input
                        className="form-control"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Skillset</label>
                      <input
                        className="form-control"
                        value={formData.skillset}
                        onChange={(e) =>
                          setFormData({ ...formData, skillset: e.target.value })
                        }
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mt-4 fw-semibold rounded-3"
                  >
                    Register
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted small">
                    Already have an account?
                  </span>{' '}
                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-none"
                  >
                    Login
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TOP RIGHT TOAST */}
      {showToast && (
        <div className="position-fixed top-0 end-0 p-4" style={{ zIndex: 9999 }}>
          <div
            className="toast show shadow-lg border-0"
            style={{ minWidth: '360px' }}
          >
            <div className={`toast-header bg-${toastType} text-white`}>
              <strong className="me-auto">Notification</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body py-3 fs-6">
              {toastMessage}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Register
