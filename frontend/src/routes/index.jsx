import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginPage     from '../pages/Auth/LoginPage'
import RegisterPage  from '../pages/Auth/RegisterPage'
import DashboardPage from '../pages/Dashboard/DashboardPage'
import UsersPage     from '../pages/Users/UsersPage'

function Private({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p>Carregando...</p>
  return user ? children : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/"         element={<Private><DashboardPage /></Private>} />
        <Route path="/users"    element={<Private><UsersPage /></Private>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
