import "./Footer.css";
import Logo from "../../../img/logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <div className="footer-logo">
            <img src= {Logo} alt="Eventoxpress" />
            <h2>EVENTOXPRESS</h2>
          </div>

          <p>
            Elegimos para poder tener la mejor experiencia en
            el lugar de tus sueños.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="X">𝕏</a>
            <a href="#" aria-label="Instagram">◎</a>
          </div>
        </div>


        <div className="footer-links">
          <a href="#">Conócenos</a>
          <a href="#">Desarrolladores</a>
          <a href="#">Contacto</a>
          <a href="#">Términos y Política de Privacidad</a>
        </div>

        <div className="footer-subscribe">
          <h4>
            Suscribite para recibir novedades, descuentos y adelantos.
          </h4>

          <form className="footer-form">
            <input
              type="email"
              placeholder="Ingresar Email"
              aria-label="Ingresar email"
              required
            />

            <button type="submit">SUBSCRIBE</button>
          </form>

          <p className="footer-copyright">
            © 2024 Todos los derechos reservados: EventoXpress®
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;