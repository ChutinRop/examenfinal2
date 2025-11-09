// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

// Importa tu CSS de Tailwind
import './index.css' 

// 1. Importar los componentes de las páginas
import App from './App'
import HomePage from './pages/HomePage'
import AdminDashboard from './pages/AdminDashboard'
import AdminMesas from './pages/AdminMesas'
import AdminClientes from './pages/AdminClientes'

// 2. Definir las rutas (el "mapa" de tu app)
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App.tsx es el "layout" (menú) que envuelve todo
    children: [
      // Páginas que se mostrarán DENTRO del layout
      {
        path: '/', // La ruta raíz
        element: <HomePage />,
      },
      {
        path: '/admin', // El dashboard principal
        element: <AdminDashboard />,
      },
      {
        path: '/admin/mesas', // La página de mesas
        element: <AdminMesas />,
      },
      {
        path: '/admin/clientes', // La página de clientes
        element: <AdminClientes />,
      },
    ],
  },
])

// 3. Renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)