import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const loginData = {
      username: username,
      password: password
    }

    try {
      const response = await axios.post(
        'https://localhost:7110/api/auth/login',
        loginData
      )

      // Save user in localStorage
      localStorage.setItem('user', JSON.stringify(response.data))

      // ✅ Fix: Use Role (capital R) from backend
      if (response.data.Role?.toLowerCase() === 'admin') {
        navigate('/admin')
      } else {
        navigate('/employee')
      }

    } catch (err) {
      console.error(err)

      // ✅ Show backend message properly
      if (err.response && err.response.data) {
        setError(err.response.data)
      } else {
        setError('Login failed. Please try again.')
      }
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)'
      }}
    >
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
                    <label className="form-label fw-semibold">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
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
                  <Link
                    to="/register"
                    className="fw-semibold text-decoration-none"
                  >
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
