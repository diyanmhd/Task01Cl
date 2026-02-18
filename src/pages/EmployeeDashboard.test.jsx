import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EmployeeDashboard from '../pages/EmployeeDashboard'
import { BrowserRouter } from 'react-router-dom'
import * as employeeService from '../services/employeeService'
import * as authUtils from '../utils/auth'

// Mock services
jest.mock('../services/employeeService')
jest.mock('../utils/auth')

// Mock navigate
const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('Employee Dashboard - Full Test Suite', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProfile = {
    id: 1,
    name: 'John Doe',
    email: 'john@test.com',
    designation: 'Developer',
    department: 'IT',
    address: 'Chennai',
    skillset: 'React,Node',
    joiningDate: '2024-01-01T00:00:00'
  }

  test('redirects to login if user not logged in', async () => {

    authUtils.getLoggedInUser.mockReturnValue(null)

    render(
      <BrowserRouter>
        <EmployeeDashboard />
      </BrowserRouter>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  test('redirects to admin if role is not employee', async () => {

    authUtils.getLoggedInUser.mockReturnValue({
      role: 'admin'
    })

    render(
      <BrowserRouter>
        <EmployeeDashboard />
      </BrowserRouter>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/admin')
  })

  test('loads and displays profile', async () => {

    authUtils.getLoggedInUser.mockReturnValue({
      role: 'employee'
    })

    employeeService.getEmployeeProfile.mockResolvedValue({
      data: mockProfile
    })

    render(
      <BrowserRouter>
        <EmployeeDashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(employeeService.getEmployeeProfile).toHaveBeenCalled()
    })

    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
    expect(screen.getByText('IT')).toBeInTheDocument()
  })

  test('edit and update profile successfully', async () => {

    authUtils.getLoggedInUser.mockReturnValue({
      role: 'employee'
    })

    employeeService.getEmployeeProfile.mockResolvedValue({
      data: mockProfile
    })

    employeeService.updateEmployeeProfile.mockResolvedValue({})

    render(
      <BrowserRouter>
        <EmployeeDashboard />
      </BrowserRouter>
    )

    await screen.findByText('John Doe')

    // Click edit button
    fireEvent.click(screen.getByTitle(/edit profile/i))

    // Change department
    fireEvent.change(screen.getByLabelText(/department/i), {
      target: { value: 'HR' }
    })

    // Save changes
    fireEvent.click(screen.getByText(/save changes/i))

    await waitFor(() => {
      expect(employeeService.updateEmployeeProfile).toHaveBeenCalled()
    })

    expect(
      await screen.findByText(/profile updated successfully/i)
    ).toBeInTheDocument()
  })

  test('logout works correctly', async () => {

    authUtils.getLoggedInUser.mockReturnValue({
      role: 'employee'
    })

    employeeService.getEmployeeProfile.mockResolvedValue({
      data: mockProfile
    })

    render(
      <BrowserRouter>
        <EmployeeDashboard />
      </BrowserRouter>
    )

    await screen.findByText('John Doe')

    fireEvent.click(screen.getByText(/logout/i))

    expect(authUtils.logout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

})
