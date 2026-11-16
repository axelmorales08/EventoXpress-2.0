import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../general/pages/Pages.css'
import { EventImage } from './EventCard'
import { eventsService } from '../../../../services/eventsService'
import { assistanceService } from '../../../../services/assistanceService'
import { favoritesService } from '../../../../services/favoritesService'
import { getErrorMessage } from '../../../../services/api'
import { useAuth } from '../../../../context/useAuth'
import { formatDate, formatPrice, eventSituation } from '../../../../utils/format'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [event, setEvent] = useState(null)
  const [attending, setAttending] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [okMessage, setOkMessage] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setErrorMessage('')
      try {
        const data = await eventsService.getById(id)
        setEvent(data)

        // Si está logueado se fija si ya asiste o si lo tiene en favoritos
        if (isAuthenticated) {
          const [myEvents, myFavorites] = await Promise.all([
            assistanceService.myEvents(),
            favoritesService.getMine(),
          ])
          setAttending(myEvents.some((e) => e.id === data.id))
          setFavorite(myFavorites.some((e) => e.id === data.id))
        }
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'No se pudo cargar el evento'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isAuthenticated])

  // Acciones que requieren sesión: si no está logueado lo manda al login
  async function runAction(action, successText) {
    if (!isAuthenticated) {
      navigate('/login/client')
      return
    }
    setBusy(true)
    setErrorMessage('')
    setOkMessage('')
    try {
      await action()
      setOkMessage(successText)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  const toggleAttendance = () =>
    runAction(async () => {
      if (attending) await assistanceService.cancel(event.id)
      else await assistanceService.register(event.id)
      setEvent((prev) => ({ ...prev, asistentes: prev.asistentes + (attending ? -1 : 1) }))
      setAttending(!attending)
    }, attending ? 'Cancelaste tu asistencia' : '¡Listo! Registraste tu asistencia')

  const toggleFavorite = () =>
    runAction(async () => {
      if (favorite) await favoritesService.remove(event.id)
      else await favoritesService.add(event.id)
      setFavorite(!favorite)
    }, favorite ? 'Eliminado de favoritos' : 'Agregado a favoritos')

  if (loading) return <div className="page"><p className="page-sub">Cargando evento...</p></div>

  if (!event) {
    return (
      <div className="page">
        <div className="empty">{errorMessage || 'Evento no encontrado'}</div>
        <div className="actions-row"><button className="btn-sm" onClick={() => navigate('/eventos')}>Volver a eventos</button></div>
      </div>
    )
  }

  const finished = eventSituation(event) === 'finalizado'

  return (
    <div className="page">
      <button className="btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Volver</button>

      <div className="detail">
        <div>
          <div className="detail-image event-card-image" style={{ height: 280 }}>
            <EventImage event={event} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            <span className="badge badge-gold">{event.category?.name}</span>
            <span className="badge">{event.type_venue?.name}</span>
            {!event.suitable_for_all_audiences && <span className="badge badge-red">+18</span>}
            {finished && <span className="badge badge-red">Finalizado</span>}
          </div>
          <h1 className="page-title">{event.name}</h1>
          <p className="detail-description" style={{ marginTop: 16 }}>{event.description}</p>
        </div>

        <div>
          <div className="panel">
            <ul className="info-list">
              <li><strong>Fecha:</strong> {formatDate(event.beginning)}{event.ending !== event.beginning && ` al ${formatDate(event.ending)}`}</li>
              <li><strong>Lugar:</strong> {event.address}, {event.locality}, {event.province}</li>
              <li><strong>Organiza:</strong> {event.user?.full_name || '-'}</li>
              <li><strong>Asistentes confirmados:</strong> {event.asistentes ?? 0}</li>
            </ul>

            <div className="actions-row">
              <button className={`btn-sm ${attending ? '' : 'btn-gold'}`} onClick={toggleAttendance} disabled={busy || (finished && !attending)}>
                {finished && !attending ? 'Evento finalizado' : attending ? 'Cancelar asistencia' : 'Asistiré'}
              </button>
              <button className="btn-sm" onClick={toggleFavorite} disabled={busy}>
                {favorite ? '♥ En favoritos' : '♡ Agregar a favoritos'}
              </button>
            </div>

            {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
            {okMessage && <p className="msg-ok">{okMessage}</p>}
          </div>

          <div className="panel">
            <h2 className="panel-title">Entradas</h2>
            {event.tickets?.length ? (
              event.tickets.map((t) => (
                <div className="ticket" key={t.id}>
                  <span>{t.name} <span className="event-meta">({t.available_quantity} disponibles)</span></span>
                  <strong style={{ color: '#d9b547' }}>{formatPrice(t.price)}</strong>
                </div>
              ))
            ) : (
              <p className="event-meta">Este evento todavía no tiene entradas cargadas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
