import { useEffect, useState } from 'react'
import { usersService } from '../../../services/usersService'
import { getErrorMessage } from '../../../services/api'

const GENDERS = [
  { id: 1, name: 'Femenino' },
  { id: 2, name: 'Masculino' },
  { id: 3, name: 'Otro' },
  { id: 4, name: 'Prefiero no decirlo' },
]

const FIELDS = ['full_name', 'user_name', 'email', 'phone', 'dni', 'birthdate', 'gender_id']

// Formulario del admin para modificar los datos de un usuario.
// Solo se envían los campos que cambiaron.
export default function EditUserForm({ userId, onClose, onSaved }) {
  const [original, setOriginal] = useState(null)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    usersService.getById(userId)
      .then((data) => {
        const values = {}
        FIELDS.forEach((f) => { values[f] = data[f] == null ? '' : String(data[f]) })
        setOriginal(values)
        setForm(values)
      })
      .catch((error) => setErrorMessage(getErrorMessage(error, 'No se pudo cargar el usuario')))
  }, [userId])

  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    const changes = {}
    FIELDS.forEach((f) => {
      if (form[f] !== original[f] && form[f] !== '') changes[f] = form[f]
    })
    if (Object.keys(changes).length === 0) {
      setErrorMessage('No cambiaste ningún dato')
      return
    }

    setSaving(true)
    try {
      await usersService.update(userId, changes)
      onSaved(`Datos de ${form.full_name} actualizados`)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'No se pudo guardar'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="page-header" style={{ marginBottom: 12 }}>
        <h2 className="panel-title" style={{ margin: 0 }}>Editar usuario #{userId}</h2>
        <button type="button" className="btn-sm" onClick={onClose}>Cerrar</button>
      </div>

      {!form ? (
        errorMessage ? null : <p className="page-sub">Cargando...</p>
      ) : (
        <div className="form-grid-2">
          <div className="field"><label>Nombre completo</label><input className="input" name="full_name" value={form.full_name} onChange={change} /></div>
          <div className="field"><label>Usuario</label><input className="input" name="user_name" value={form.user_name} onChange={change} /></div>
          <div className="field"><label>Email</label><input className="input" type="email" name="email" value={form.email} onChange={change} /></div>
          <div className="field"><label>Teléfono</label><input className="input" name="phone" value={form.phone} onChange={change} /></div>
          <div className="field"><label>DNI</label><input className="input" name="dni" value={form.dni} onChange={change} /></div>
          <div className="field"><label>Fecha de nacimiento</label><input className="input" type="date" name="birthdate" value={form.birthdate} onChange={change} /></div>
          <div className="field">
            <label>Género</label>
            <select className="input" name="gender_id" value={form.gender_id} onChange={change}>
              {GENDERS.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
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
