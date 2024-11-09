import '../public/Landing.css';
import React from 'react';

export function Landing() {
  const goToChatbot = () => {
    window.location.href = '/chatbot';
  }
  return (
    <div className="home">
      <section className="hero">
        <div className="background-svg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#bfe8ef"
              fillOpacity="1"
              d="M0,64L34.3,74.7C68.6,85,137,107,206,101.3C274.3,96,343,64,411,58.7C480,53,549,75,617,106.7C685.7,139,754,181,823,186.7C891.4,192,960,160,1029,128C1097.1,96,1166,64,1234,69.3C1302.9,75,1371,117,1406,138.7L1440,160L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
            />
          </svg>
        </div>

        <div className="container">
          <div className="content">
            <h1>Hola! Soy Budy</h1>
            <p className="subtitle">
              Un simpático perro interactivo que está aquí para ayudarte a cuidar tu salud de manera fácil y segura.
            </p>
            <p className="description">
              Solo tienes que decirle cómo te sientes.
              Gracias a la inteligencia artificial y la tecnología blockchain,
              toda la información que compartes con Budy es completamente privada y segura,
              tienes el control total de tu salud sin preocupaciones.
            </p>
          </div>
          <div className="image-container">
            <img src="/images/budy.png" alt="logo budy" className="logo" />
          </div>
        </div>
      </section>

      <section className="features">
        <div className="chatWithBudy" onClick={goToChatbot}>
          <img src="/images/budyDialog.svg" alt="Chat with Budy" className='budyChat'/>
        </div>
        <div className="feature-item-1">
          <div className="feature-text-1">
            <h3>Accede de manera autónoma y privada, sos dueño de tus datos</h3>
            <p>
              Para que Budy pueda asesorarte con la mejor precisión,
              tenga en cuenta consultas anteriores y documentos compartidos.
              Buscamos lo mejor para vos
            </p>
          </div>
          <div className="feature-image">
            <img src="/images/item-1.svg" alt="Login image" />
          </div>
        </div>
        <div className="feature-item-2">
          <div className="feature-text-2">
            <p>Carga tu historial clínico e informes médicos <br /> Budy está para vos</p>
          </div>
          <div className="feature-image">
            <img src="/images/item-2.svg" alt="Chat image" />
          </div>
        </div>

        <div className="feature-item-3">
          <div className="feature-image">
            <img src="/images/item-3.svg" alt="Whatsapp chat image" />
          </div>
          <div className="feature-text-3">
            <p>Escríbenos desde nuestra web o para una mejor experiencia en la comodidad de tu WhatsApp</p>
          </div>
        </div>
      </section>

      <section className="bg-dark-blue">
        <div className="darkBlueText">
          <h2 className="title">Te ofrecemos</h2>
          <ul className="list">
            <li>Cargar y controlar tus historiales médicos de manera segura</li>
            <li>Budy en WhatsApp te acompaña en tu autocuidado de salud</li>
            <li>Asistencia personalizada para mejorar tu bienestar</li>
            <li>Seguimiento de tus síntomas y ofrecerte apoyo en cualquier momento.</li>
            <li>Garantizamos que solo tú tienes control total sobre tu información</li>
            <li>Buscamos facilitar el servicio del sistema de salud para optimizar el trabajo de los profesionales</li>
          </ul>
        </div>
      </section>

      <footer className="footer">
        <div className="footerContainer">
          <h2>Siempre a tu alcance</h2>
          <p>
            En Budy, utilizamos la tecnología blockchain para garantizar
            la máxima seguridad y privacidad de tu información de salud.
            A través de un smart contract, se crea un acuerdo digital que permite
            a Budy acceder únicamente a la información necesaria cuando interactúas con la aplicación.
            Este smart contract asegura que, fuera de estas interacciones,
            Budy no tiene acceso a tu wallet ni a tu información personal.
            Además, la naturaleza descentralizada del blockchain significa que tu información no puede ser alterada,
            vulnerada o utilizada para otros fines sin tu consentimiento.
            Tu privacidad y seguridad están siempre protegidas,
            permitiéndote confiar en Budy como tu compañero de salud.
          </p>
        </div>
      </footer>
    </div>
  );
}
