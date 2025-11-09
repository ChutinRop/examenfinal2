// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react'

interface Reserva {
  id: number; fechaHora: string; numeroPersonas: number;
  cliente: { nombre: string }; mesa: { numero: number }
}

export default function AdminDashboard() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)

  const hoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function fetchReservasDelDia() {
      setLoading(true)
      try {
        const response = await fetch(`http://localhost:3000/reservas/dia/${hoy}`)
        const data = await response.json()
        setReservas(data)
      } catch (error) { console.error('Error al cargar reservas:', error) }
      setLoading(false)
    }
    fetchReservasDelDia()
  }, [hoy])

  return (
    <div className="card">
      <div className="card-header">
        <h1>Reservas para Hoy ({hoy})</h1>
      </div>
      <div className="card-content">
        {loading ? (
          <p>Cargando reservas...</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Mesa No.</th>
                  <th>Personas</th>
                </tr>
              </thead>
              <tbody>
                {reservas.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                      No hay reservas para hoy.
                    </td>
                  </tr>
                ) : (
                  reservas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>{new Date(reserva.fechaHora).toLocaleTimeString()}</td>
                      <td>{reserva.cliente.nombre}</td>
                      <td>{reserva.mesa.numero}</td>
                      <td>{reserva.numeroPersonas}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}