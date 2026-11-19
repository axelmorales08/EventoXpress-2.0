import { useEffect, useState } from 'react'
import { eventsService } from '../../../services/eventsService'
import { getErrorMessage } from '../../../services/api'
import { CATEGORIES, VENUE_TYPES } from '../../../context/authContext'

const FIELDS = [
  'name', 'category_id', 'type_venue_id', 'province', 'locality', 'address',
  'description', 'beginning', 'ending', 'image', 'state', 'suitable_for_all_audiences',
]

// Formulario del admin para modificar los datos de un evento.
// Solo se envían los campos que cambiaron.
export default function EditEventForm({ eventId, onClose, onSaved }) {
  const [original, setOriginal] = useState(null)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    eventsService.getById(eventId)
      .then((data) => {
        const values = {}
        FIELDS.forEach((f) => {
          if (f === 'suitable_for_all_audiences') values[f] = Boolean(data[f])
          else values[f] = data[f] == null ? '' : String(data[f]).slice(0, f === 'beginning' || f === 'ending' ? 10 : undefined)
        })
        setOriginal(values)
        setForm(values)
      })
      .catch((error) => setErrorMessage(getErrorMessage(error, 'No se pudo cargar el evento')))
  }, [eventId])

  function change(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    if (form.ending < form.beginning) {
      setErrorMessage('La fecha de finalización no puede ser anterior a la de inicio')
      return
    }

    const changes = {}
    FIELDS.forEach((f) => {
      if (form[f] === original[f]) return
      if (f === 'suitable_for_all_audiences') changes[f] = form[f]
      else if (f === 'category_id' || f === 'type_venue_id') changes[f] = Number(form[f])
      else if (form[f] !== '') changes[f] = form[f]
    })
    if (Object.keys(changes).length === 0) {
      setErrorMessage('No cambiaste ningún dato')
      return
    }

    setSaving(true)
    try {
      await eventsService.update(eventId, changes)
      onSaved(`Evento "${form.name}" actualizado`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo guardar'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="page-header" style={{ marginBottom: 12 }}>
        <h2 className="panel-title" style={{ margin: 0 }}>Editar evento #{eventId}</h2>
        <button type="button" className="btn-sm" onClick={onClose}>Cerrar</button>
      </div>

      {!form ? (
        errorMessage ? null : <p className="page-sub">Cargando...</p>
      ) : (
        <div className="form-grid-2">
          <div className="field full"><label>Nombre (máx. 64)</label><input className="input" name="name" maxLength={64} value={form.name} onChange={change} /></div>
          <div className="field">
            <label>Categoría</label>
            <select className="input" name="category_id" value={form.category_id} onChange={change}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Tipo</label>
            <select className="input" name="type_venue_id" value={form.type_venue_id} onChange={change}>
              {VENUE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="field"><label>Provincia</label><input className="input" name="province" value={form.province} onChange={change} /></div>
          <div className="field"><label>Localidad</label><input className="input" name="locality" value={form.locality} onChange={change} /></div>
          <div className="field full"><label>Dirección</label><input className="input" name="address" value={form.address} onChange={change} /></div>
          <div className="field"><label>Fecha de inicio</label><input className="input" type="date" name="beginning" value={form.beginning} onChange={change} /></div>
          <div className="field"><label>Fecha de finalización</label><input className="input" type="date" name="ending" value={form.ending} onChange={change} /></div>
          <div className="field full"><label>Descripción</label><textarea className="input" name="description" value={form.description} onChange={change} /></div>
          <div className="field full"><label>Imagen (URL)</label><input className="input" name="image" value={form.image} onChange={change} placeholder="https://..." /></div>
          <div className="field">
            <label>Estado</label>
            <select className="input" name="state" value={form.state} onChange={change}>
              <option value="publico">Público</option>
              <option value="en proceso">En proceso</option>
            </select>
          </div>
          <label className="checkbox"><input type="checkbox" name="suitable_for_all_audiences" checked={form.suitable_for_all_audiences} onChange={change} /> Apto para todo público</label>
        </div>
      )}

      {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}

      {form && (
        <div className="actions-row">
          <button type="submit" className="btn-sm btn-light" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
          <button type="button" className="btn-sm" onClick={onClose}>Cancelar</button>
        </div>
      )}
    </form>
  )
}
