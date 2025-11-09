// src/pages/HomePage.tsx
import { useState } from 'react'

interface Mesa {
  id: number; numero: number; capacidad: number; ubicacion: string
}

export default function HomePage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [numeroPersonas, setNumeroPersonas] = useState(1)
  const [mesaId, setMesaId] = useState('')
  const [mesasDisponibles, setMesasDisponibles] = useState<Mesa[]>([])

  const buscarDisponibilidad = async () => {
    const fechaHoraISO = `${fecha}T${hora}:00.000Z`;
    try {
      const response = await fetch(
        `http://localhost:3000/reservas/disponibilidad?fecha=${fechaHoraISO}&personas=${numeroPersonas}`
      );
      const data = await response.json();
      setMesasDisponibles(data);
      if (data.length === 0) {
        alert('No hay mesas disponibles.');
      } else {
        alert('Mesas encontradas!');
      }
    } catch (error) { alert('Error al buscar disponibilidad'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesaId) {
      alert("Por favor, busca y selecciona una mesa.");
      return;
    }
    let clienteId: number;
    try {
      const clienteResponse = await fetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email }),
      });
      const cliente = await clienteResponse.json();
      if (!clienteResponse.ok) throw new Error(cliente.message);
      clienteId = cliente.id;
    } catch (error: any) {
      alert(`Error al crear cliente: ${error.message}`);
      return;
    }
    try {
      const fechaHoraISO = `${fecha}T${hora}:00.000Z`;
      const reservaResponse = await fetch('http://localhost:3000/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaHora: fechaHoraISO,
          numeroPersonas,
          clienteId,
          mesaId: Number(mesaId),
        }),
      });
      if (!reservaResponse.ok) {
        const errorData = await reservaResponse.json();
        throw new Error(errorData.message);
      }
      alert('¡Reserva Creada con Éxito!');
      setNombre(''); setEmail(''); setFecha(''); setHora('');
      setNumeroPersonas(1); setMesaId(''); setMesasDisponibles([]);
    } catch (error: any) {
      alert(`Error al crear reserva: ${error.message}`);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1>Reservar una Mesa</h1>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="form-grid">
          
          <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
            <legend style={{ fontWeight: 600, padding: '0 5px' }}>1. Tus Datos</legend>
            <div className="form-grid form-grid-2-col">
              <div className="form-group">
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
          </fieldset>

          <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
            <legend style={{ fontWeight: 600, padding: '0 5px' }}>2. Datos de Reserva</legend>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'flex-end' }}>
              <div className="form-group">
                <label>Fecha:</label>
                <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Hora:</label>
                <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Personas:</label>
                <input type="number" value={numeroPersonas} onChange={(e) => setNumeroPersonas(Number(e.target.value))} min={1} required />
              </div>
              <button type="button" className="secondary" onClick={buscarDisponibilidad}>
                Buscar Mesas
              </button>
            </div>
          </fieldset>

          {mesasDisponibles.length > 0 && (
            <fieldset style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px' }}>
              <legend style={{ fontWeight: 600, padding: '0 5px' }}>3. Selecciona tu Mesa</legend>
              <div className="form-group">
                <select value={mesaId} onChange={(e) => setMesaId(e.target.value)} required>
                  <option value="">-- Selecciona una mesa --</option>
                  {mesasDisponibles.map((mesa) => (
                    <option key={mesa.id} value={mesa.id}>
                      Mesa {mesa.numero} ({mesa.ubicacion}) - Cap: {mesa.capacidad}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>
          )}

          <button type="submit" className="primary" style={{ padding: '15px', fontSize: '1.2em' }}>
            Confirmar Reserva
          </button>
        </form>
      </div>
    </div>
  );
}