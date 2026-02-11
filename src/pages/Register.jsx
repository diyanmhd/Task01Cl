import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerEmployee } from '../services/authService'

function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    designation: '',
    department: '',
    address: '',
    joiningDate: '',
    skillset: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await registerEmployee(formData)
      alert('Registration successful')
      navigate('/login')
    } catch (err) {
      console.error(err)
      setError(err.response?.data || 'Registration failed')
    }
  }

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h3 className="text-center fw-bold mb-2">
                Employee Registration
              </h3>
              <p className="text-center text-muted mb-4">
                Create your account
              </p>

              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      className="form-control"
                      name="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      className="form-control"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Designation</label>
                    <input
                      className="form-control"
                      name="designation"
                      placeholder="e.g. Software Engineer"
                      value={formData.designation}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Department</label>
                    <input
                      className="form-control"
                      name="department"
                      placeholder="e.g. IT"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Address</label>
                    <input
                      className="form-control"
                      name="address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12 mb-4">
                    <label className="form-label fw-semibold">Skillset</label>
                    <input
                      className="form-control"
                      name="skillset"
                      placeholder="e.g. React, .NET, SQL"
                      value={formData.skillset}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold"
                >
                  Register
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">
                  Already have an account?{' '}
                </span>
                <Link to="/login" className="fw-semibold">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
