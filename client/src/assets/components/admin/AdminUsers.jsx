import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../general/pages/Pages.css'
import { usersService } from '../../../services/usersService'
import { getErrorMessage } from '../../../services/api'
import { useAuth } from '../../../context/useAuth'
import { ROLE_NAMES } from '../../../context/authContext'
import EditUserForm from './EditUserForm'

export default function AdminUsers() {
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [okMessage, setOkMessage] = useState('')
  const [editingId, setEditingId] = useState(null)

  async function load() {
    try {
      setUsers(await usersService.getAll())
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudieron cargar los usuarios'))
    } finally {
      setLoading(false)
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

  const changeRole = (u, role) =>
    run(() => usersService.setRole(u.id, Number(role)), `${u.full_name} ahora es ${ROLE_NAMES[role]}`)

  const toggleStatus = (u) =>
    run(() => usersService.setStatus(u.id, Boolean(u.deleted_at)), `${u.full_name} fue ${u.deleted_at ? 'activado' : 'desactivado'}`)

  const term = search.trim().toLowerCase()
  const filtered = users.filter((u) =>
    !term || [u.full_name, u.user_name, u.email, u.dni].some((v) => String(v).toLowerCase().includes(term))
  )

  const activos = users.filter((u) => !u.deleted_at)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-kicker">Administración</p>
          <h1 className="page-title">Gestión de <span>usuarios</span></h1>
        </div>
        <button className="btn-sm" onClick={() => navigate('/organizador')}>Ver eventos y reportes</button>
      </div>

      <div className="stats">
        <div className="stat"><div className="stat-value">{users.length}</div><div className="stat-label">Usuarios registrados</div></div>
        <div className="stat"><div className="stat-value">{activos.length}</div><div className="stat-label">Activos</div></div>
        <div className="stat"><div className="stat-value">{activos.filter((u) => u.type_users_id === 2).length}</div><div className="stat-label">Organizadores</div></div>
        <div className="stat"><div className="stat-value">{activos.filter((u) => u.type_users_id === 3).length}</div><div className="stat-label">Consumidores</div></div>
      </div>

      {editingId && (
        <EditUserForm
          key={editingId}
          userId={editingId}
          onClose={() => setEditingId(null)}
          onSaved={(text) => {
            setEditingId(null)
            setErrorMessage('')
            setOkMessage(text)
            load()
          }}
        />
      )}

      <div className="panel">
        <div className="field" style={{ maxWidth: 360, marginBottom: 12 }}>
          <label>Buscar</label>
          <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre, usuario, email o DNI" />
        </div>

        {errorMessage && <p className="organizer-form-error">{errorMessage}</p>}
        {okMessage && <p className="msg-ok">{okMessage}</p>}

        {loading ? (
          <p className="page-sub">Cargando usuarios...</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isMe = u.id === me?.id
                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.full_name}{isMe && <span className="event-meta"> (vos)</span>}</td>
                      <td>{u.user_name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>
                        <select className="input" value={u.type_users_id} disabled={isMe} onChange={(e) => changeRole(u, e.target.value)}>
                          {Object.entries(ROLE_NAMES).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                        </select>
                      </td>
                      <td>
                        <span className={`badge ${u.deleted_at ? 'badge-red' : 'badge-green'}`}>{u.deleted_at ? 'Inactivo' : 'Activo'}</span>
                      </td>
                      <td>
                        <div className="actions-row" style={{ marginTop: 0, flexWrap: 'nowrap' }}>
                          <button
                            className="btn-sm"
                            onClick={() => {
                              setOkMessage('')
                              setEditingId(u.id)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                          >
                            Editar
                          </button>
                          <button className={`btn-sm ${u.deleted_at ? '' : 'btn-danger'}`} disabled={isMe} onClick={() => toggleStatus(u)}>
                            {u.deleted_at ? 'Activar' : 'Desactivar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="empty">No hay usuarios que coincidan.</div>}
          </div>
        )}
      </div>
    </div>
  )
}
