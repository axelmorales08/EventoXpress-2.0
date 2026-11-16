# Endpoints agregados

Todas las rutas con 🔒 llevan header `Authorization: Bearer <token>`.
Roles: 1 = administrador, 2 = organizador, 3 = consumidor.

## Autenticación / usuarios (prefijo `/api/auth`)
| Método | Ruta | Acceso | Body / params |
|---|---|---|---|
| POST | `/login` | público | `{ email, password }` **o** `{ phone, password }` |
| POST | `/admin_login` | público | Paso 1: `{ user_name (o email), password }` → manda un código al mail y devuelve `pre_token` |
| POST | `/admin_verify` | público | Paso 2: `{ pre_token, code }` → devuelve `token` y `admin` |
| POST | `/organizer/request_code` | público | `{ email }` → si es organizador/admin le manda un código de 6 dígitos |
| POST | `/organizer/verify_code` | público | `{ email, code }` → devuelve `token` y `user` |
| POST | `/recover_password` | público | `{ email }` o `{ phone }` → manda al mail un link a `/reset-password?token=...` (15 min) |
| POST | `/reset_password` | público | `{ token, password }` → cambia la contraseña (el link sirve una sola vez) |
| GET | `/auth_verify` | 🔒 | devuelve usuario/admin + `permisos` según rol |
| GET | `/users_getById/:id` | 🔒 admin | incluye género, rol y `estado` |
| PATCH | `/users_status/:id` | 🔒 admin | ahora acepta `{ active: true/false }` **o** `{ estado: "activo"/"inactivo" }` |

## Eventos (prefijo `/api`)
| Método | Ruta | Acceso | Body / params |
|---|---|---|---|
| GET | `/ev_info` | público | opcional `?id=1` o `?state=publico` |
| GET | `/events_getById/:id` | público | incluye categoría, tipo, organizador, entradas y cantidad de asistentes |
| GET | `/fil_ev` | público | `fecha`, `fecha_desde`, `fecha_hasta`, `precio_min`, `precio_max`, `provincia`, `localidad`, `ubicacion`, `categoria`, `tipo`, `state` (combinables) |
| POST | `/ev_post` | 🔒 organizador/admin | obligatorios: `type_venue_id, category_id, province, locality, address, description, beginning, ending, name`. Opcionales: `image, suitable_for_all_audiences, state`. El admin puede mandar `user_id` |
| PUT/PATCH | `/ev_mody/:id` | 🔒 dueño o admin | cualquiera de los campos anteriores. Al pasar `state: "publico"` se completa `published` |
| DELETE | `/ev_del/:id` | 🔒 dueño o admin | borrado lógico; avisa a los asistentes con una notificación y borra asistencias/favoritos del evento |

> El precio de un evento sale de la tabla `tickets`, por eso `precio_min/max` filtra eventos que tengan alguna entrada en ese rango.

## Asistencias (prefijo `/api`)
| Método | Ruta | Acceso | Body / params |
|---|---|---|---|
| POST | `/assistance` | 🔒 | `{ venue_id }` (el usuario sale del token) |
| DELETE | `/assistance/:venue_id` | 🔒 | cancela la asistencia propia |
| GET | `/attendance_getByUser` | 🔒 | agenda propia (`?proximos=true` para solo futuros) |
| GET | `/attendance_getByUser/:user_id` | 🔒 admin (o el mismo usuario) | |
| GET | `/ev_assistance/:venue_id` | 🔒 dueño o admin | lista de asistentes |
| GET | `/attendance_getByEvent/:venue_id` | 🔒 dueño o admin | igual que el anterior |
| GET | `/attendance_get` | 🔒 organizador/admin | todos los registros (el organizador ve solo los de sus eventos) |

## Notificaciones (prefijo `/api`)
| Método | Ruta | Acceso | Body / params |
|---|---|---|---|
| POST | `/notifications` | 🔒 organizador/admin | `{ title, message }` + `venue_id` (asistentes del evento) **o** `user_id` (solo admin) **o** `all: true` (solo admin) |
| GET | `/notifications` | 🔒 | propias, con `no_leidas`. Opcional `?unread=true` |
| PATCH | `/notifications/:id/read` | 🔒 | marca una como leída |
| PATCH | `/notifications/read_all` | 🔒 | marca todas como leídas |

## Reportes (prefijo `/api`)
| Método | Ruta | Acceso | Devuelve |
|---|---|---|---|
| GET | `/reports/events` | 🔒 organizador/admin | resumen (publicados, próximos, finalizados…), conteo por categoría y detalle por evento |
| GET | `/reports/attendance` | 🔒 organizador/admin | total de asistencias, promedio, ranking y % de ocupación. Opcional `?venue_id=` |

El organizador solo ve reportes de sus propios eventos; el admin ve todos.

## Base de datos
- Modelo nuevo `models/Notifications.js` (tabla `notifications`). Con `db.sync({ force: false })` en `app.js` se crea sola al levantar el servidor.
- En `config/eventoxpress2.sql` se agregaron las tablas `tickets` (faltaba) y `notifications`.

## Mails (códigos y recuperación de contraseña)
`utils/mailer.js`: si no hay nada configurado, los mails **se muestran en la consola del servidor** (ahí ves el código o el link).
Para mandar mails reales: `npm i nodemailer` y definir `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (y opcional `SMTP_FROM`, `FRONTEND_URL`).
Los códigos duran 10 minutos, permiten 5 intentos y se guardan en memoria (si reiniciás el servidor, pedí otro).
