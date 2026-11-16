import { useState } from 'react'
import { eventsService } from '../../../services/eventsService'
import { ticketsService } from '../../../services/ticketsService'
import { getErrorMessage } from '../../../services/api'
import { CATEGORIES, VENUE_TYPES } from '../../../context/authContext'

const EMPTY_EVENT = {
  name: '',
  category_id: '',
  type_venue_id: '1',
  province: '',
  locality: '',
  address: '',
  description: '',
  beginning: '',
  ending: '',
  image: '',
  suitable_for_all_audiences: true,
  publicar: false,
}

const EMPTY_TICKET = { name: 'General', price: '', available_quantity: '' }

export default function CreateEventForm({ onCreated }) {
  const [form, setForm] = useState(EMPTY_EVENT)
  const [tickets, setTickets] = useState([EMPTY_TICKET])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [okMessage, setOkMessage] = useState('')

  function change(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function changeTicket(index, field, value) {
    setTickets((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setOkMessage('')

    if (form.ending < form.beginning) {
      setErrorMessage('La fecha de finalización no puede ser anterior a la de inicio')
      return
    }

    // Solo se cargan las entradas que tienen precio y cantidad
    const validTickets = tickets.filter((t) => t.name.trim() && t.price !== '' && t.available_quantity !== '')

    setLoading(true)
    try {
      const { publicar, ...eventData } = form
      const data = await eventsService.create({
        ...eventData,
        category_id: Number(form.category_id),
        type_venue_id: Number(form.type_venue_id),
        image: form.image.trim() || undefined,
        state: publicar ? 'publico' : 'en proceso',
      })

      for (const t of validTickets) {
        await ticketsService.create({
          venue_id: data.evento.id,
          name: t.name.trim(),
          price: Number(t.price),
          available_quantity: Number(t.available_quantity),
        })
      }

      setOkMessage(`Evento "${data.evento.name}" creado${publicar ? ' y publicado' : ' (queda en proceso hasta que lo publiques)'}`)
      setForm(EMPTY_EVENT)
      setTickets([EMPTY_TICKET])
      onCreated?.()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo crear el evento'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2 className="panel-title">Nuevo evento</h2>
      <div className="form-grid-2">
        <div className="field full"><label>Nombre (máx. 64)</label><input className="input" name="name" maxLength={64} value={form.name} onChange={change} required /></div>
        <div className="field">
          <label>Categoría</label>
          <select className="input" name="category_id" value={form.category_id} onChange={change} required>
            <option value="">Seleccioná</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Tipo</label>
          <select className="input" name="type_venue_id" value={form.type_venue_id} onChange={change}>
            {VENUE_TYPES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="field"><label>Provincia</label><input className="input" name="province" value={form.province} onChange={change} required /></div>
        <div className="field"><label>Localidad</label><input className="input" name="locality" value={form.locality} onChange={change} required /></div>
        <div className="field full"><label>Dirección</label><input className="input" name="address" value={form.address} onChange={change} required /></div>
        <div className="field"><label>Fecha de inicio</label><input className="input" type="date" name="beginning" value={form.beginning} onChange={change} required /></div>
        <div className="field"><label>Fecha de finalización</label><input className="input" type="date" name="ending" value={form.ending} onChange={change} required /></div>
        <div className="field full"><label>Descripción</label><textarea className="input" name="description" value={form.description} onChange={change} required /></div>
        <div className="field full"><label>Imagen (URL, opcional)</label><input className="input" name="image" value={form.image} onChange={change} placeholder="https://..." /></div>
        <label className="checkbox"><input type="checkbox" name="suitable_for_all_audiences" checked={form.suitable_for_all_audiences} onChange={change} /> Apto para todo público</label>
        <label className="checkbox"><input type="checkbox" name="publicar" checked={form.publicar} onChange={change} /> Publicarlo ya</label>
      </div>

      <h2 className="panel-title" style={{ marginTop: 24 }}>Entradas</h2>
      {tickets.map((t, i) => (
        <div className="filters" key={i} style={{ marginBottom: 8 }}>
          <div className="field"><label>Tipo de entrada</label><input className="input" value={t.name} onChange={(e) => changeTicket(i, 'name', e.target.value)} /></div>
          <div className="field"><label>Precio</label><input className="input" type="number" min="0" value={t.price} onChange={(e) => changeTicket(i, 'price', e.target.value)} /></div>
          <div className="field"><label>Cantidad</label><input className="input" type="number" min="0" value={t.available_quantity} onChange={(e) => changeTicket(i, 'available_quantity', e.target.value)} /></div>
          {tickets.length > 1 && (
            <button type="button" className="btn-sm btn-danger" onClick={() => setTickets((prev) => prev.filter((_, j) => j !== i))}>Quitar</button>
          )}
        </div>
      ))}
      <button type="button" className="btn-sm" onClick={() => setTickets((prev) => [...prev, { ...EMPTY_TICKET, name: '' }])}>+ Otro tipo de entrada</button>

      {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
      {okMessage && <p className="msg-ok">{okMessage}</p>}

      <div className="actions-row">
        <button type="submit" className="btn-sm btn-gold" disabled={loading}>{loading ? 'Creando...' : 'Crear evento'}</button>
      </div>
    </form>
  )
}
