import { useNavigate } from 'react-router-dom'
import { formatDate, priceRange, eventSituation } from '../../../../utils/format'

// Solo se muestra la imagen si es una URL; si no, un recuadro con la categoría
export function EventImage({ event }) {
  const isUrl = event.image && /^(https?:)?\/\//.test(event.image)
  if (isUrl) return <img src={event.image} alt={event.name} />
  return <span>{event.category?.name || 'Evento'}</span>
}

export default function EventCard({ event }) {
  const navigate = useNavigate()
  const situation = eventSituation(event)

  return (
    <article className="event-card" onClick={() => navigate(`/eventos/${event.id}`)}>
      <div className="event-card-image">
        <EventImage event={event} />
      </div>
      <div className="event-card-body">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="badge badge-gold">{event.type_venue?.name || 'Evento'}</span>
          {situation === 'finalizado' && <span className="badge badge-red">Finalizado</span>}
          {situation === 'en curso' && <span className="badge badge-green">En curso</span>}
        </div>
        <h3 className="event-card-title">{event.name}</h3>
        <p className="event-meta">
          {formatDate(event.beginning)}
          {event.ending !== event.beginning && ` al ${formatDate(event.ending)}`}
        </p>
        <p className="event-meta">{event.locality}, {event.province}</p>
        <p className="event-price">{priceRange(event.tickets)}</p>
      </div>
    </article>
  )
}
