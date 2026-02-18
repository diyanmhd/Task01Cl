import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminDashboard from '../pages/AdminDashboard'
import { BrowserRouter } from 'react-router-dom'
import * as adminService from '../services/adminService'
import * as authUtils from '../utils/auth'

// Mock services
jest.mock('../services/adminService')
jest.mock('../utils/auth')

// Mock navigate
const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('Admin Dashboard - Full Test Suite', () => {

  const mockEmployees = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@test.com',
      department: 'IT',
      designation: 'Developer',
      status: 'Active'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('redirects to login if not logged in', () => {

    authUtils.getLoggedInUser.mockReturnValue(null)

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  test('redirects to employee if role not admin', () => {

    authUtils.getLoggedInUser.mockReturnValue({
      role: 'employee'
    })

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    )

    expect(mockNavigate).toHaveBeenCalledWith('/employee')
  })

  test('loads and displays employees', async () => {

    authUtils.getLoggedInUser.mockReturnValue({
      role: 'admin'
    })

    adminService.getAllEmployees.mockResolvedValue({
      data: {
        items: mockEmployees,
        totalCount: 1
      }
    })

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(adminService.getAllEmployees).toHaveBeenCalled()
    })

    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('IT')).toBeInTheDocument()
  })

  test('search updates state and refetches', async () => {

    authUtils.getLoggedInUser.mockReturnValue({ role: 'admin' })

    adminService.getAllEmployees.mockResolvedValue({
      data: { items: mockEmployees, totalCount: 1 }
    })

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    )

    await screen.findByText('John Doe')

    fireEvent.change(screen.getByPlaceholderText(/search employees/i), {
      target: { value: 'John' }
    })

    await waitFor(() => {
      expect(adminService.getAllEmployees).toHaveBeenCalled()
    })
  })

  test('toggles employee status', async () => {

    authUtils.getLoggedInUser.mockReturnValue({ role: 'admin' })

    adminService.getAllEmployees.mockResolvedValue({
      data: { items: mockEmployees, totalCount: 1 }
    })

    adminService.updateEmployeeByAdmin.mockResolvedValue({})

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    )

    await screen.findByText('John Doe')

    const toggleSwitch = screen.getByRole('checkbox')
    fireEvent.click(toggleSwitch)

    await waitFor(() => {
      expect(adminService.updateEmployeeByAdmin).toHaveBeenCalled()
    })
  })

  test('edit and update employee', async () => {

    authUtils.getLoggedInUser.mockReturnValue({ role: 'admin' })

    adminService.getAllEmployees.mockResolvedValue({
      data: { items: mockEmployees, totalCount: 1 }
    })

    adminService.updateEmployeeByAdmin.mockResolvedValue({})

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    )

    await screen.findByText('John Doe')

    // Click edit button
    fireEvent.click(screen.getByTitle(/edit/i))

    // Change department
    fireEvent.change(screen.getByLabelText(/department/i), {
      target: { value: 'HR' }
    })

    // Save
    fireEvent.click(screen.getByText(/save changes/i))

    await waitFor(() => {
      expect(adminService.updateEmployeeByAdmin).toHaveBeenCalled()
    })

    expect(
      await screen.findByText(/employee updated successfully/i)
    ).toBeInTheDocument()
  })

  test('logout works correctly', async () => {

    authUtils.getLoggedInUser.mockReturnValue({ role: 'admin' })

    adminService.getAllEmployees.mockResolvedValue({
      data: { items: mockEmployees, totalCount: 1 }
    })

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    )

    await screen.findByText('John Doe')

    fireEvent.click(screen.getByText(/logout/i))

    expect(authUtils.logout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

})
