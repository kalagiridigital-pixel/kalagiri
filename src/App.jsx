import './App.css';
import '@fontsource/cormorant-garamond/400.css';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInWindow, setIsMouseInWindow] = useState(true);
  const sceneRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitStatus('');
    setFormData({ name: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized position (-1 to 1)
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);
      
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsMouseInWindow(true);
    const handleMouseLeave = () => {
      setIsMouseInWindow(false);
      setMousePosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Calculate parallax transform
  const calculateTransform = () => {
    const maxTranslate = 15; // max ±15px
    const maxRotate = 3; // max ±3deg
    
    const translateX = mousePosition.x * maxTranslate;
    const translateY = mousePosition.y * maxTranslate;
    const rotateX = -mousePosition.y * maxRotate; // Negative for natural tilt
    const rotateY = mousePosition.x * maxRotate;
    
    return `translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Create WhatsApp message
      const whatsappNumber = '919619262139'; // +91 96192 62139 without + and spaces
      const message = encodeURIComponent(`Hello Kalagiri!\n\nName: ${formData.name}\nMessage: ${formData.message}`);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      setSubmitStatus('success');
      setTimeout(() => {
        closeModal();
      }, 1500);

    } catch (error) {
      console.error('Failed to open WhatsApp:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell" ref={sceneRef}>
      <div className="scene">
        <img src="/src/assets/Kalagiri_Round Logo.png" alt="Kalagiri logo" className="logo-badge" />

        <section className="hero-panel">
          <div className="hero-copy">
            <img 
              src="/src/assets/Kalagiri_Logo.png" 
              alt="कलागिरी" 
              className={isMouseInWindow ? 'pause-floating' : ''}
              style={{
                transform: isMouseInWindow ? calculateTransform() : 'translate(0, 0) rotateX(0) rotateY(0)',
                transition: 'transform 0.15s ease-out',
                transformStyle: 'preserve-3d'
              }}
            />
            <p className="hero-email">kalagiri.digital@gmail.com</p>
            <button className="enquiry-btn" onClick={openModal}>
              WhatsApp Us
            </button>
          </div>
        </section>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-art__shape" />
          <div className="hero-art__glow" />
        </div>
        
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
              <h2 className="modal-title">Get in Touch</h2>
              <p className="modal-subtitle">We'll respond via WhatsApp</p>
              
              <form className="enquiry-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4" 
                    value={formData.message}
                    onChange={handleInputChange}
                    required 
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="success-message">
                    Opening WhatsApp... We'll get back to you soon!
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="error-message">
                    <p>Failed to open WhatsApp.</p>
                    <p>Please message us directly at:</p>
                    <a 
                      href="https://wa.me/919619262139" 
                      className="email-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeModal();
                      }}
                    >
                      +91 96192 62139
                    </a>
                  </div>
                )}
                
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Opening...' : 'Send via WhatsApp'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
