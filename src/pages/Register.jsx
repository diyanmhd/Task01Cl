import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerEmployee } from '../services/authService'

function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
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
      setError('Registration failed')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center mb-3">Employee Registration</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label>Name</label>
                  <input className="form-control" name="name"
                    value={formData.name} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-2">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email"
                    value={formData.email} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-2">
                  <label>Password</label>
                  <input type="password" className="form-control" name="password"
                    value={formData.password} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-2">
                  <label>Designation</label>
                  <input className="form-control" name="designation"
                    value={formData.designation} onChange={handleChange} />
                </div>

                <div className="col-md-6 mb-2">
                  <label>Department</label>
                  <input className="form-control" name="department"
                    value={formData.department} onChange={handleChange} />
                </div>

                <div className="col-md-6 mb-2">
                  <label>Joining Date</label>
                  <input type="date" className="form-control" name="joiningDate"
                    value={formData.joiningDate} onChange={handleChange} />
                </div>

                <div className="col-md-12 mb-2">
                  <label>Address</label>
                  <input className="form-control" name="address"
                    value={formData.address} onChange={handleChange} />
                </div>

                <div className="col-md-12 mb-3">
                  <label>Skillset</label>
                  <input className="form-control" name="skillset"
                    value={formData.skillset} onChange={handleChange} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>

            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
