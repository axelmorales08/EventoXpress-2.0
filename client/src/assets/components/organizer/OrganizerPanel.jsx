import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../general/pages/Pages.css'
import CreateEventForm from './CreateEventForm'
import Attendees from './Attendees'
import EditEventForm from '../admin/EditEventForm'
import { reportsService } from '../../../services/reportsService'
import { eventsService } from '../../../services/eventsService'
import { getErrorMessage } from '../../../services/api'
import { useAuth } from '../../../context/useAuth'
import { ROLES } from '../../../context/authContext'
import { formatDate, formatPrice } from '../../../utils/format'

const TABS = [
  { id: 'eventos', label: 'Eventos' },
  { id: 'crear', label: 'Crear evento' },
  { id: 'asistencia', label: 'Reporte de asistencia' },
]

const SITUATION_BADGE = { proximo: '', en_curso: 'badge-green', finalizado: 'badge-red' }
const SITUATION_TEXT = { proximo: 'Próximo', en_curso: 'En curso', finalizado: 'Finalizado' }

export default function OrganizerPanel() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [tab, setTab] = useState('eventos')
  const [report, setReport] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [selected, setSelected] = useState(null)
  // Admin: edita cualquier evento. Organizador: solo ve (y edita) los suyos; el back también lo controla
  const [editingId, setEditingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [okMessage, setOkMessage] = useState('')

  async function load() {
    try {
      const [events, att] = await Promise.all([reportsService.events(), reportsService.attendance()])
      setReport(events)
      setAttendance(att)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudieron cargar tus eventos'))
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function run(action, text) {
    setErrorMessage('')
    setOkMessage('')
    try {
      await action()
      setOkMessage(text)
      await load()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const togglePublish = (ev) => {
    const publish = ev.estado !== 'publico'
    return run(
      () => eventsService.update(ev.id, { state: publish ? 'publico' : 'en proceso' }),
      publish ? `"${ev.nombre}" ahora es público` : `"${ev.nombre}" volvió a "en proceso"`
    )
  }

  const removeEvent = (ev) => {
    if (!window.confirm(`¿Eliminar "${ev.nombre}"? Se avisará a los asistentes.`)) return
    if (selected?.id === ev.id) setSelected(null)
    return run(() => eventsService.remove(ev.id), `"${ev.nombre}" fue eliminado`)
  }

  const r = report?.resumen

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-kicker">{role === ROLES.ADMIN ? 'Administración' : 'Organizador'}</p>
          <h1 className="page-title">Panel de <span>eventos</span></h1>
          {role === ROLES.ADMIN && <p className="page-sub">Como administrador ves los eventos de todos los organizadores.</p>}
        </div>
        {role === ROLES.ADMIN && <button className="btn-sm" onClick={() => navigate('/admin/usuarios')}>Gestión de usuarios</button>}
      </div>

      {r && (
        <div className="stats">
          <div className="stat"><div className="stat-value">{r.total_eventos}</div><div className="stat-label">Eventos</div></div>
          <div className="stat"><div className="stat-value">{r.publicados}</div><div className="stat-label">Publicados</div></div>
          <div className="stat"><div className="stat-value">{r.en_proceso}</div><div className="stat-label">En proceso</div></div>
          <div className="stat"><div className="stat-value">{r.proximos}</div><div className="stat-label">Próximos</div></div>
          <div className="stat"><div className="stat-value">{attendance?.total_asistencias ?? 0}</div><div className="stat-label">Asistencias</div></div>
        </div>
      )}

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
      {okMessage && <p className="msg-ok" style={{ marginBottom: 16 }}>{okMessage}</p>}

      {tab === 'eventos' && (
        <>
          {editingId && (
            <EditEventForm
              key={editingId}
              eventId={editingId}
              onClose={() => setEditingId(null)}
              onSaved={(text) => {
                setEditingId(null)
                setErrorMessage('')
                setOkMessage(text)
                load()
              }}
            />
          )}
          {selected && <Attendees event={selected} onClose={() => setSelected(null)} />}
          <div className="panel">
            {!report ? (
              <p className="page-sub">Cargando...</p>
            ) : report.eventos.length === 0 ? (
              <div className="empty">Todavía no creaste eventos. Andá a “Crear evento”.</div>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr><th>Evento</th><th>Fechas</th><th>Estado</th><th>Asistentes</th><th>Precio</th><th></th></tr>
                  </thead>
                  <tbody>
                    {report.eventos.map((ev) => (
                      <tr key={ev.id}>
                        <td><strong>{ev.nombre}</strong><div className="event-meta">{ev.categoria}</div></td>
                        <td>{formatDate(ev.fecha_inicio)}<div className="event-meta">al {formatDate(ev.fecha_finalizacion)}</div></td>
                        <td>
                          <span className={`badge ${ev.estado === 'publico' ? 'badge-gold' : ''}`}>{ev.estado === 'publico' ? 'Público' : 'En proceso'}</span>{' '}
                          <span className={`badge ${SITUATION_BADGE[ev.situacion]}`}>{SITUATION_TEXT[ev.situacion]}</span>
                        </td>
                        <td>{ev.asistentes}</td>
                        <td>{ev.precio_minimo === null ? '-' : formatPrice(ev.precio_minimo)}</td>
                        <td>
                          <div className="actions-row" style={{ marginTop: 0 }}>
                            <button className={`btn-sm ${ev.estado === 'publico' ? '' : 'btn-gold'}`} onClick={() => togglePublish(ev)}>
                              {ev.estado === 'publico' ? 'Despublicar' : 'Publicar'}
                            </button>
                            <button
                              className="btn-sm"
                              onClick={() => {
                                setOkMessage('')
                                setEditingId(ev.id)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                            >
                              Editar
                            </button>
                            <button className="btn-sm" onClick={() => setSelected(ev)}>Asistentes</button>
                            <button className="btn-sm" onClick={() => navigate(`/eventos/${ev.id}`)}>Ver</button>
                            <button className="btn-sm btn-danger" onClick={() => removeEvent(ev)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'crear' && <CreateEventForm onCreated={load} />}

      {tab === 'asistencia' && attendance && (
        <div className="panel">
          <p className="page-sub" style={{ marginBottom: 12 }}>
            Promedio por evento: <strong>{attendance.promedio_por_evento}</strong>
            {attendance.evento_mas_concurrido && <> · Más concurrido: <strong>{attendance.evento_mas_concurrido.nombre}</strong></>}
          </p>
          {attendance.eventos.length === 0 ? (
            <div className="empty">Sin datos todavía.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>#</th><th>Evento</th><th>Inicio</th><th>Asistentes</th><th>Entradas</th><th>Ocupación</th></tr></thead>
                <tbody>
                  {attendance.eventos.map((ev, i) => (
                    <tr key={ev.id}>
                      <td>{i + 1}</td>
                      <td>{ev.nombre}</td>
                      <td>{formatDate(ev.fecha_inicio)}</td>
                      <td>{ev.asistentes}</td>
                      <td>{ev.entradas_disponibles}</td>
                      <td>{ev.ocupacion === null ? '-' : `${ev.ocupacion}%`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
