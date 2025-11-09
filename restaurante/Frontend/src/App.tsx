// src/App.tsx
import { Link, Outlet } from 'react-router-dom'

function App() {
  return (
    <div>
      {/* 1. El Menú de Navegación con clases CSS */ }
      <nav className="app-nav">
        <h1>Restaurante Admin</h1>
        <div className="app-nav-links">
          <Link to="/">Formulario Cliente</Link>
          <Link to="/admin">Dashboard (Hoy)</Link>
          <Link to="/admin/mesas">Gestión de Mesas</Link>
          <Link to="/admin/clientes">Clientes</Link>
        </div>
      </nav>

      {/* 2. El Contenedor de la Página */ }
      <main className="page-container">
        <Outlet />
      </main>

      {/* No necesitamos Toaster/Sonner si lo hacemos simple */ }
    </div>
  )
}

export default App