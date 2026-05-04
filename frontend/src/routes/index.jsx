import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginPage       from '../pages/Auth/LoginPage'
import RegisterPage    from '../pages/Auth/RegisterPage'
import DashboardPage   from '../pages/Dashboard/DashboardPage'
import UsersPage       from '../pages/Users/UsersPage'
import PropertiesListPage from '../pages/Properties/PropertiesListPage'
import PropertyFormPage   from '../pages/Properties/PropertyFormPage'
import LeadsPage       from '../pages/Leads/LeadsPage'

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
        <Route path="/properties/my"     element={<Private><PropertiesListPage /></Private>} />
        <Route path="/properties/new"    element={<Private><PropertyFormPage /></Private>} />
        <Route path="/properties/edit/:id" element={<Private><PropertyFormPage /></Private>} />
        <Route path="/leads"    element={<Private><LeadsPage /></Private>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
