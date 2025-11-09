// src/pages/AdminMesas.tsx
import { useState, useEffect } from 'react'

interface Mesa {
  id: number; numero: number; capacidad: number; ubicacion: string
}

export default function AdminMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [loading, setLoading] = useState(true)
  const [numero, setNumero] = useState(0)
  const [capacidad, setCapacidad] = useState(0)
  const [ubicacion, setUbicacion] = useState('')

  async function fetchMesas() {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/mesas')
      const data = await response.json()
      setMesas(data)
    } catch (error) { console.error('Error al cargar mesas:', error) }
    setLoading(false)
  }

  useEffect(() => { fetchMesas() }, [])

  const handleCrearMesa = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/mesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero, capacidad, ubicacion }),
      })
      if (!response.ok) throw new Error('Error al crear la mesa')
      
      alert('Mesa creada con éxito')
      fetchMesas();
      setNumero(0); setCapacidad(0); setUbicacion('');
      
    } catch (error: any) { alert(error.message) }
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3>Agregar Nueva Mesa</h3>
        </div>
        <div className="card-content">
          <form onSubmit={handleCrearMesa}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'flex-end' }}>
              <div className="form-group">
                <label>Número de Mesa:</label>
                <input type="number" value={numero} onChange={(e) => setNumero(Number(e.target.value))} required />
              </div>
              <div className="form-group">
                <label>Capacidad:</label>
                <input type="number" value={capacidad} onChange={(e) => setCapacidad(Number(e.target.value))} required />
              </div>
              <div className="form-group">
                <label>Ubicación:</label>
                <input type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
              </div>
              <button type="submit" className="primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h1>Gestión de Mesas</h1>
        </div>
        <div className="card-content">
          {loading ? (<p>Cargando mesas...</p>) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Número</th>
                    <th>Capacidad</th>
                    <th>Ubicación</th>
                  </tr>
                </thead>
                <tbody>
                  {mesas.map((mesa) => (
                    <tr key={mesa.id}>
                      <td>{mesa.id}</td>
                      <td>{mesa.numero}</td>
                      <td>{mesa.capacidad}</td>
                      <td>{mesa.ubicacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}