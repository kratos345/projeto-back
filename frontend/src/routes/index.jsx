import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginPage       from '../pages/Auth/LoginPage'
import RegisterPage    from '../pages/Auth/RegisterPage'
import DashboardPage   from '../pages/Dashboard/DashboardPage'
import UsersPage       from '../pages/Users/UsersPage'
import AdminPage       from '../pages/Admin/AdminPage'
import EditUserPage    from '../pages/Users/EditUserPage'
import PropertiesListPage from '../pages/Properties/PropertiesListPage'
import LeadsPage       from '../pages/Leads/LeadsPage'
import SalesPage       from '../pages/Sales/SalesPage'
import SearchPage      from '../pages/Search/SearchPage'

function Private({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p>Carregando...</p>
  return user ? children : <Navigate to="/login" replace />
}

function RoleBasedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  if (loading) return <p>Carregando...</p>
  if (!user) return <Navigate to="/login" replace />
  const role = user.role === 'adm' ? 'admin' : user.role
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />
  return children
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard principal - acessível para todos os usuários logados */}
        <Route path="/"         element={<Private><DashboardPage /></Private>} />

        {/* Rotas específicas por role */}
        <Route path="/users"         element={<RoleBasedRoute allowedRoles={['admin']}><UsersPage /></RoleBasedRoute>} />
        <Route path="/users/edit/:id" element={<RoleBasedRoute allowedRoles={['admin']}><EditUserPage /></RoleBasedRoute>} />
        <Route path="/admin"         element={<RoleBasedRoute allowedRoles={['admin']}><AdminPage /></RoleBasedRoute>} />

        {/* Rotas de vendedor */}
        <Route path="/properties/my"     element={<RoleBasedRoute allowedRoles={['vendedor']}><PropertiesListPage /></RoleBasedRoute>} />
        <Route path="/properties/new"    element={<RoleBasedRoute allowedRoles={['vendedor']}><PropertiesListPage /></RoleBasedRoute>} />
        <Route path="/properties/edit/:id" element={<RoleBasedRoute allowedRoles={['vendedor']}><PropertiesListPage /></RoleBasedRoute>} />
        <Route path="/leads"    element={<RoleBasedRoute allowedRoles={['vendedor']}><LeadsPage /></RoleBasedRoute>} />
        <Route path="/sales"    element={<RoleBasedRoute allowedRoles={['vendedor']}><SalesPage /></RoleBasedRoute>} />

        {/* Rotas de comprador */}
        <Route path="/search"   element={<RoleBasedRoute allowedRoles={['user']}><SearchPage /></RoleBasedRoute>} />

        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
