import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import './styles/components.css'
import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './routes'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
)
