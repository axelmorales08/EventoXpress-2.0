import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../../general/pages/Pages.css'
import EventCard from './EventCard'
import { eventsService } from '../../../../services/eventsService'
import { getErrorMessage } from '../../../../services/api'
import { CATEGORIES, VENUE_TYPES } from '../../../../context/authContext'

const EMPTY_FILTERS = {
  ubicacion: '',
  fecha_desde: '',
  fecha_hasta: '',
  precio_min: '',
  precio_max: '',
  categoria: '',
}

export default function EventsPage() {
  // ?tipo=1 (presencial) o ?tipo=2 (virtual) viene desde el menú del navbar
  const [searchParams, setSearchParams] = useSearchParams()
  const tipo = searchParams.get('tipo') || ''

  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  async function loadEvents(currentFilters) {
    setLoading(true)
    setErrorMessage('')
    try {
      // Solo se mandan los filtros que tienen valor. Al público solo se le muestran los publicados.
      const params = { state: 'publico' }
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== '') params[key] = value
      })
      if (tipo) params.tipo = tipo

      setEvents(await eventsService.filter(params))
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudieron cargar los eventos'))
    } finally {
      setLoading(false)
    }
  }

  // Se vuelve a buscar cuando cambia el tipo (Presencial / Streaming)
  useEffect(() => {
    loadEvents(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo])

  function handleChange(e) {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    loadEvents(filters)
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS)
    setSearchParams({})
    loadEvents(EMPTY_FILTERS)
  }

  const typeName = VENUE_TYPES.find((t) => String(t.id) === tipo)?.name

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-kicker">Descubrí</p>
          <h1 className="page-title">
            Eventos {typeName && <span>{typeName === 'Virtual' ? 'en streaming' : 'presenciales'}</span>}
          </h1>
        </div>
      </div>

      <form className="panel filters" onSubmit={handleSubmit}>
        <div className="field">
          <label>Ubicación</label>
          <input className="input" name="ubicacion" value={filters.ubicacion} onChange={handleChange} placeholder="Provincia, localidad o dirección" />
        </div>
        <div className="field">
          <label>Categoría</label>
          <select className="input" name="categoria" value={filters.categoria} onChange={handleChange}>
            <option value="">Todas</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Desde</label>
          <input className="input" type="date" name="fecha_desde" value={filters.fecha_desde} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Hasta</label>
          <input className="input" type="date" name="fecha_hasta" value={filters.fecha_hasta} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Precio mínimo</label>
          <input className="input" type="number" min="0" name="precio_min" value={filters.precio_min} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Precio máximo</label>
          <input className="input" type="number" min="0" name="precio_max" value={filters.precio_max} onChange={handleChange} />
        </div>
        <div className="actions-row" style={{ marginTop: 0 }}>
          <button type="submit" className="btn-sm btn-light">Buscar</button>
          <button type="button" className="btn-sm" onClick={handleClear}>Limpiar</button>
        </div>
      </form>

      {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}

      {loading ? (
        <p className="page-sub">Cargando eventos...</p>
      ) : events.length === 0 ? (
        <div className="empty">No hay eventos publicados que coincidan con la búsqueda.</div>
      ) : (
        <div className="event-grid">
          {events.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  )
}
