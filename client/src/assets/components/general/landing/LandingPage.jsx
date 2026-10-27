import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import crowdConcert from '../../../img/Concierto.png'
import theaterScene from '../../../img/Teatro.png'
import festivalImage from '../../../img/Festival.png'
import soccerImage from '../../../img/Futbol.png'

const benefitCards = [
  {
    title: 'Recursos',
    description:
      'Accede a herramientas que simplifican la gestión de tus eventos, fechas y tareas.',
  },
  {
    title: 'Monetización',
    description:
      'Maximiza ingresos con opciones pensadas para vender entradas y potenciar cada evento.',
  },
  {
    title: 'Visibilidad',
    description:
      'Haz crecer tu alcance con una presencia clara ante tu audiencia y comunidad.',
  },
  {
    title: 'Alcance',
    description:
      'Llega a más personas con campañas y experiencias que conectan con quienes buscan vivir momentos inolvidables.',
  },
]

function LandingPage() {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(() => {
    const saved = localStorage.getItem('eventoxpress-favorite')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('eventoxpress-favorite', String(isFavorite))
  }, [isFavorite])

  return (
    <div className="eventoxpress-page">
      <section className="event-hero">
        <div className="hero-copy">
          <p className="hero-kicker">HACE REALIDAD TU</p>
          <h1 className="hero-title">
            <span className="hero-title-line hero-title-line--light">EVENTO</span>
            <span className="hero-title-line hero-title-line--gold">INIGUALABLE</span>
          </h1>
          <p className="hero-description">
            EventoxPress te ayuda a organizar, descubrir y vivir experiencias inolvidables,
            conectando personas con eventos que marcan la diferencia.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="event-button event-button--secondary"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
            <button
              type="button"
              className="event-button event-button--primary"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
          </div>
        </div>

        <div className="hero-visual" aria-label="Imágenes de eventos destacados">
          <div className="featured-event-collage">
            <div className="featured-event-main">
              <img
                src={festivalImage}
                alt="Festival nocturno con luces doradas y público celebrando"
              />
            </div>
            <div className="featured-event-mini">
              <img
                src={soccerImage}
                alt="Campo de fútbol al atardecer con luces cálidas"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="event-presentation">
        <h2 className="section-title">EventoXpress</h2>
        <p className="section-description">
          Es una plataforma pensada para organizar, descubrir y participar en eventos únicos,
          creando conexiones reales entre públicos, artistas y organizadores.
        </p>
      </section>

      <section className="organizer-benefits">
        <h2 className="section-title">Beneficios para Organizadores</h2>
        <div className="benefit-grid">
          {benefitCards.map((card) => (
            <article className="benefit-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="audience-benefits">
        <h2 className="section-title">Beneficios para tu público</h2>

        <article className="story-card">
          <img src={theaterScene} alt="Teatro con una puesta en escena" className="story-image" />
          <div className="story-content">
            <h3>Cada Evento Cuenta Una Historia, Nosotros Lo Hacemos Inolvidable.</h3>
            <p>
              Descubre experiencias únicas pensadas para emocionar, inspirar y acompañarte en cada instante.
            </p>
            <button type="button" className="event-button event-button--secondary">
              Más Información
            </button>
          </div>
        </article>

        <article className="experience-card">
          <div className="experience-content">
            <h3>Experiencia Personalizada</h3>
            <p>
              Encuentra eventos que se adapten a tus gustos, tus momentos y la energía que buscas vivir.
            </p>
            <div className="experience-actions">
              <button type="button" className="event-button event-button--secondary">
                Ver Eventos...
              </button>
              <button
                type="button"
                className={`heart-button ${isFavorite ? 'is-active' : ''}`}
                aria-label="Guardar evento"
                aria-pressed={isFavorite}
                onClick={() => setIsFavorite((prev) => !prev)}
              >
                ♥
              </button>
            </div>
          </div>

          <div className="experience-visual">
            <img src={crowdConcert} alt="Público disfrutando de un recital" className="experience-image" />
          </div>
        </article>
      </section>
    </div>
  )
}

export default LandingPage
