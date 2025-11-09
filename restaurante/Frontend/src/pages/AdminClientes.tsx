// src/pages/AdminClientes.tsx
import { useState, useEffect, useMemo } from 'react'

interface Reserva {
  id: number; fechaHora: string; numeroPersonas: number; estado: string;
  mesa: { numero: number; ubicacion: string }
}
interface ClienteSimple {
  id: number; nombre: string; email: string; telefono: string | null
}
interface ClienteCompleto extends ClienteSimple {
  reservas: Reserva[]
}

export default function AdminClientes() {
  const [clientes, setClientes] = useState<ClienteSimple[]>([])
  const [selectedCliente, setSelectedCliente] = useState<ClienteCompleto | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  async function fetchClientes() {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) { console.error('Error al cargar clientes:', error) }
    setLoading(false)
  }

  useEffect(() => { fetchClientes() }, [])

  async function handleViewDetails(id: number) {
    try {
      setSelectedCliente(null)
      const response = await fetch(`http://localhost:3000/clientes/${id}`)
      const data = await response.json()
      setSelectedCliente(data)
    } catch (error) { alert('Error al cargar historial') }
  }

  const clientesFiltrados = useMemo(() => {
    if (!searchTerm) return clientes
    return clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [clientes, searchTerm])

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Clientes Frecuentes</h1>
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="card-content layout-split">
        {/* Columna Izquierda: Lista de Clientes */}
        <div className="layout-split-main">
          {loading ? (
            <p>Cargando clientes...</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
                      <td>{cliente.email}</td>
                      <td>
                        <button className="secondary" style={{ padding: '5px 10px' }} onClick={() => handleViewDetails(cliente.id)}>
                          Ver Historial
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Columna Derecha: Historial del Cliente (Separado) */}
        <div className="layout-split-sidebar">
          <h2>Historial del Cliente</h2>
          {selectedCliente ? (
            <div>
              <h3>{selectedCliente.nombre}</h3>
              <p style={{ color: '#555' }}>{selectedCliente.email} | {selectedCliente.telefono || 'Sin teléfono'}</p>
              <h4 style={{ marginTop: '20px' }}>Reservas:</h4>
              {selectedCliente.reservas.length === 0 ? (
                <p>Este cliente no tiene reservas.</p>
              ) : (
                <ul className="history-list">
                  {selectedCliente.reservas.map((reserva) => (
                    <li key={reserva.id}>
                      <strong>{new Date(reserva.fechaHora).toLocaleString()}</strong> - {reserva.numeroPersonas} pers.
                      <br />
                      <span style={{ color: '#555' }}>Mesa {reserva.mesa.numero} ({reserva.estado})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p>Selecciona un cliente para ver su historial.</p>
          )}
        </div>
      </div>
    </div>
  )
}