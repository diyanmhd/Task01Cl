import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Register from '../pages/Register'
import { BrowserRouter } from 'react-router-dom'
import * as authService from '../services/authService'

// Mock API
jest.mock('../services/authService')

// Optional: Mock navigate (safer)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}))

describe('Register Page - Full Flow', () => {

  test('submits form successfully', async () => {

    // Mock successful API response
    authService.registerEmployee.mockResolvedValue({})

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    // Fill required fields (exact match regex)
    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: 'John Doe' }
    })

    fireEvent.change(screen.getByLabelText(/^username$/i), {
      target: { value: 'john123' }
    })

    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'john@test.com' }
    })

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: '123456' }
    })

    // Click Register button
    fireEvent.click(screen.getByRole('button', { name: /register/i }))

    // Wait for API call
    await waitFor(() => {
      expect(authService.registerEmployee).toHaveBeenCalledTimes(1)
    })

    // Check success toast appears
    expect(
      await screen.findByText(/registration successful/i)
    ).toBeInTheDocument()
  })

})
