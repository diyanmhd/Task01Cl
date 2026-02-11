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

      localStorage.setItem('user', JSON.stringify(response.data))

      if (response.data.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/employee')
      }
    } catch (err) {
      console.error(err)
      setError('Invalid username or password')
    }
  }

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-md-4 col-sm-6">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h3 className="text-center mb-2 fw-bold">Welcome Back</h3>
              <p className="text-center text-muted mb-4">
                Login to continue
              </p>

              {error && (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold"
                >
                  Login
                </button>
              </form>

              <div className="text-center mt-3">
                <span className="text-muted">Don’t have an account? </span>
                <Link to="/register" className="fw-semibold">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
