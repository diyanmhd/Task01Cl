import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import Login from './Login'
import * as authService from '../services/authService'

// Reusable render function
const renderLogin = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

// Clear mocks after each test
afterEach(() => {
  jest.clearAllMocks()
})

describe('Login Page', () => {

  // --------------------------
  // BASIC RENDER TESTS
  // --------------------------

  test('renders username input', () => {
    renderLogin()
    const usernameInput = screen.getByLabelText(/username/i)
    expect(usernameInput).toBeInTheDocument()
  })

  test('renders password input', () => {
    renderLogin()
    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toBeInTheDocument()
  })

  test('renders login button', () => {
    renderLogin()
    const button = screen.getByRole('button', { name: /login/i })
    expect(button).toBeInTheDocument()
  })

  // --------------------------
  // LOGIN SUCCESS TEST
  // --------------------------

  test('calls loginUser and redirects on success', async () => {
    // Mock successful login
    jest.spyOn(authService, 'loginUser').mockResolvedValue({
      role: 'Admin'
    })

    renderLogin()

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' }
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password' }
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password'
      })
    })
  })

  // --------------------------
  // LOGIN FAILURE TEST
  // --------------------------

  test('shows error message when login fails', async () => {
    jest.spyOn(authService, 'loginUser').mockRejectedValue({
      response: { data: 'Invalid credentials' }
    })

    renderLogin()

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'wronguser' }
    })

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' }
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    const errorMessage = await screen.findByText(/invalid credentials/i)
    expect(errorMessage).toBeInTheDocument()
  })

})
