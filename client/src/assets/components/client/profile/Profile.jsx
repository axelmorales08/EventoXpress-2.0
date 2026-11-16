import { useEffect, useState } from 'react'
import '../../general/pages/Pages.css'
import EventCard from '../events/EventCard'
import { usersService } from '../../../../services/usersService'
import { assistanceService } from '../../../../services/assistanceService'
import { favoritesService } from '../../../../services/favoritesService'
import { notificationsService } from '../../../../services/notificationsService'
import { getErrorMessage, USER_KEY } from '../../../../services/api'
import { useAuth } from '../../../../context/useAuth'
import { ROLE_NAMES } from '../../../../context/authContext'
import { formatDate } from '../../../../utils/format'

const TABS = [
  { id: 'datos', label: 'Mis datos' },
  { id: 'eventos', label: 'Mis eventos' },
  { id: 'favoritos', label: 'Favoritos' },
  { id: 'notificaciones', label: 'Notificaciones' },
]

// ---------------- Mis datos ----------------
function ProfileData() {
  const { saveSession, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [editing, setEditing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [okMessage, setOkMessage] = useState('')

  async function load() {
    try {
      const data = await usersService.getProfile()
      setProfile(data)
      setForm({
        full_name: data.full_name,
        user_name: data.user_name,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate || '',
      })
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo cargar tu perfil'))
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setOkMessage('')

    // Solo se mandan los campos que cambiaron
    const changes = {}
    Object.entries(form).forEach(([key, value]) => {
      if (value !== (profile[key] ?? '')) changes[key] = value
    })
    if (Object.keys(changes).length === 0) {
      setEditing(false)
      return
    }

    try {
      await usersService.updateProfile(changes)
      await load()
      // Actualiza el nombre que se muestra en el navbar
      saveSession({ token, user: { ...JSON.parse(localStorage.getItem(USER_KEY)), ...changes } })
      setOkMessage('Perfil actualizado')
      setEditing(false)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo actualizar el perfil'))
    }
  }

  if (!profile) return errorMessage ? <p className="organizer-form-error">{errorMessage}</p> : <p className="page-sub">Cargando...</p>

  if (!editing) {
    return (
      <div className="panel">
        <ul className="info-list">
          <li><strong>Nombre completo:</strong> {profile.full_name}</li>
          <li><strong>Usuario:</strong> {profile.user_name}</li>
          <li><strong>Email:</strong> {profile.email}</li>
          <li><strong>Teléfono:</strong> {profile.phone}</li>
          <li><strong>DNI:</strong> {profile.dni}</li>
          <li><strong>Fecha de nacimiento:</strong> {formatDate(profile.birthdate)}</li>
          <li><strong>Rol:</strong> {ROLE_NAMES[profile.type_users_id]}</li>
        </ul>
        {okMessage && <p className="msg-ok">{okMessage}</p>}
        <div className="actions-row">
          <button className="btn-sm btn-light" onClick={() => { setEditing(true); setOkMessage('') }}>Editar datos</button>
        </div>
      </div>
    )
  }

  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="form-grid-2">
        <div className="field"><label>Nombre completo</label><input className="input" name="full_name" value={form.full_name} onChange={change} required /></div>
        <div className="field"><label>Usuario</label><input className="input" name="user_name" value={form.user_name} onChange={change} required /></div>
        <div className="field"><label>Email</label><input className="input" type="email" name="email" value={form.email} onChange={change} required /></div>
        <div className="field"><label>Teléfono</label><input className="input" name="phone" value={form.phone} onChange={change} required /></div>
        <div className="field"><label>Fecha de nacimiento</label><input className="input" type="date" name="birthdate" value={form.birthdate} onChange={change} /></div>
      </div>
      {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
      <div className="actions-row">
        <button type="submit" className="btn-sm btn-light">Guardar</button>
        <button type="button" className="btn-sm" onClick={() => { setEditing(false); setErrorMessage('') }}>Cancelar</button>
      </div>
    </form>
  )
}

// ---------------- Lista de eventos (mis eventos / favoritos) ----------------
function EventList({ loader, emptyText }) {
  const [events, setEvents] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loader()
      .then(setEvents)
      .catch((error) => setErrorMessage(getErrorMessage(error)))
  }, [loader])

  if (errorMessage) return <p className="organizer-form-error">{errorMessage}</p>
  if (!events) return <p className="page-sub">Cargando...</p>
  if (events.length === 0) return <div className="empty">{emptyText}</div>

  return (
    <div className="event-grid">
      {events.map((event) => <EventCard key={event.id} event={event} />)}
    </div>
  )
}

// ---------------- Notificaciones ----------------
function Notifications() {
  const [data, setData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  async function load() {
    try {
      setData(await notificationsService.getMine())
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function markAsRead(id) {
    await notificationsService.markAsRead(id)
    load()
  }

  async function markAll() {
    await notificationsService.markAllAsRead()
    load()
  }

  if (errorMessage) return <p className="organizer-form-error">{errorMessage}</p>
  if (!data) return <p className="page-sub">Cargando...</p>
  if (data.notificaciones.length === 0) return <div className="empty">No tenés notificaciones.</div>

  return (
    <div className="panel">
      <div className="page-header" style={{ marginBottom: 8 }}>
        <p className="page-sub" style={{ margin: 0 }}>{data.no_leidas} sin leer</p>
        {data.no_leidas > 0 && <button className="btn-sm" onClick={markAll}>Marcar todas como leídas</button>}
      </div>
      {data.notificaciones.map((n) => (
        <div key={n.id} className={`list-item ${n.is_read ? '' : 'unread'}`}>
          <div>
            <p className="list-item-title">{n.title}</p>
            <p className="event-meta">{n.message}</p>
            <p className="event-meta">{formatDate(n.created_at)}{n.venue && ` · ${n.venue.name}`}</p>
          </div>
          {!n.is_read && <button className="btn-sm" onClick={() => markAsRead(n.id)}>Marcar leída</button>}
        </div>
      ))}
    </div>
  )
}

// Funciones fijas (fuera del componente) para que EventList no recargue en cada render
const loadMyEvents = () => assistanceService.myEvents()
const loadFavorites = () => favoritesService.getMine()

export default function Profile() {
  const { user } = useAuth()
  const [tab, setTab] = useState('datos')

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-kicker">Mi cuenta</p>
          <h1 className="page-title">Hola, <span>{user?.full_name?.split(' ')[0]}</span></h1>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'datos' && <ProfileData />}
      {tab === 'eventos' && <EventList loader={loadMyEvents} emptyText="Todavía no te anotaste a ningún evento." />}
      {tab === 'favoritos' && <EventList loader={loadFavorites} emptyText="No tenés eventos en favoritos." />}
      {tab === 'notificaciones' && <Notifications />}
    </div>
  )
}
