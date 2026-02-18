import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const data = await loginUser({
        username,
        password
      })

      // 🔐 Redirect based on role
      if (data.role?.toLowerCase() === 'admin') {
        navigate('/admin')
      } else {
        navigate('/employee')
      }

    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data)
      } else {
        setError('Login failed. Please try again.')
      }
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6">

            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <h3 className="fw-bold mb-2">Employee Portal</h3>
                  <p className="text-muted mb-0">
                    Sign in to your account
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger text-center small">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

<div className="mb-4">
  <label
    htmlFor="username"
    className="form-label fw-semibold"
  >
    Username
  </label>
  <input
    id="username"
    type="text"
    className="form-control form-control-lg"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    required
  />
</div>


 <div className="mb-4">
  <label
    htmlFor="password"
    className="form-label fw-semibold"
  >
    Password
  </label>
  <input
    id="password"
    type="password"
    className="form-control form-control-lg"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
</div>


                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold rounded-3"
                  >
                    Login
                  </button>

                </form>

                <div className="text-center mt-4">
                  <span className="text-muted small">
                    Don’t have an account?
                  </span>{' '}
                  <Link to="/register" className="fw-semibold text-decoration-none">
                    Register
                  </Link>
                </div>

              </div>
            </div>

            <div className="text-center text-light small mt-4">
              © {new Date().getFullYear()} Employee Management System
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
