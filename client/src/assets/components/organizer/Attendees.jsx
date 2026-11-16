import { useEffect, useState } from 'react'
import { assistanceService } from '../../../services/assistanceService'
import { notificationsService } from '../../../services/notificationsService'
import { getErrorMessage } from '../../../services/api'

// Lista de asistentes de un evento + formulario para notificarlos
export default function Attendees({ event, onClose }) {
  const [attendees, setAttendees] = useState(null)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [okMessage, setOkMessage] = useState('')

  useEffect(() => {
    assistanceService.byEvent(event.id)
      .then(setAttendees)
      .catch((error) => setErrorMessage(getErrorMessage(error)))
  }, [event.id])

  async function handleNotify(e) {
    e.preventDefault()
    setErrorMessage('')
    setOkMessage('')
    try {
      const data = await notificationsService.send({ venue_id: event.id, title, message })
      setOkMessage(`Notificación enviada a ${data.enviadas} asistente(s)`)
      setTitle('')
      setMessage('')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo enviar la notificación'))
    }
  }

  return (
    <div className="panel">
      <div className="page-header" style={{ marginBottom: 12 }}>
        <h2 className="panel-title" style={{ margin: 0 }}>Asistentes de “{event.nombre}”</h2>
        <button className="btn-sm" onClick={onClose}>Cerrar</button>
      </div>

      {!attendees ? (
        <p className="page-sub">Cargando...</p>
      ) : attendees.length === 0 ? (
        <div className="empty">Todavía nadie confirmó asistencia.</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Nombre</th><th>Email</th></tr></thead>
            <tbody>
              {attendees.map((a) => <tr key={a.id}><td>{a.id}</td><td>{a.full_name}</td><td>{a.email}</td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {attendees?.length > 0 && (
        <form onSubmit={handleNotify} style={{ marginTop: 20 }}>
          <h2 className="panel-title">Enviar notificación a los asistentes</h2>
          <div className="form-grid-2">
            <div className="field full"><label>Título</label><input className="input" maxLength={100} value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div className="field full"><label>Mensaje</label><textarea className="input" value={message} onChange={(e) => setMessage(e.target.value)} required /></div>
          </div>
          <div className="actions-row"><button type="submit" className="btn-sm btn-light">Enviar</button></div>
        </form>
      )}

      {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
      {okMessage && <p className="msg-ok">{okMessage}</p>}
    </div>
  )
}
