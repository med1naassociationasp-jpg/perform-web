import { useState } from 'react';
import './App.css';

export default function App() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    cf_1023: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessageType('success');
        setMessage('✅ Solicitud enviada correctamente. Te contactaremos pronto.');
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          mobile: '',
          cf_1023: '',
          description: '',
        });
      } else {
        setMessageType('error');
        setMessage('⚠️ Error al enviar. Por favor intenta nuevamente.');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('⚠️ Error al enviar. Por favor intenta nuevamente.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <h1>Solicita tu Consulta Gratuita</h1>
        <p className="subtitle">Completa el formulario y nos pondremos en contacto contigo</p>

        <form onSubmit={handleSubmit} className="form">
          {/* Nombres */}
          <div className="form-group">
            <label htmlFor="firstname">Nombres *</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </div>

          {/* Apellidos */}
          <div className="form-group">
            <label htmlFor="lastname">Apellidos *</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Tu apellido"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Teléfono móvil */}
          <div className="form-group">
            <label htmlFor="mobile">Teléfono móvil *</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+52 123 456 7890"
              required
            />
          </div>

          {/* Módulos de Interés */}
          <div className="form-group">
            <label htmlFor="cf_1023">Módulos de Interés *</label>
            <select
              id="cf_1023"
              name="cf_1023"
              value={formData.cf_1023}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un servicio</option>
              <option value="ERP">ERP</option>
              <option value="CRM">CRM</option>
              <option value="ERP & CRM">ERP & CRM</option>
              <option value="Consultoría">Consultoría</option>
              <option value="Capacitación">Capacitación</option>
              <option value="Soporte Técnico">Soporte Técnico</option>
            </select>
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Cuéntanos más sobre tu proyecto o necesidad..."
              rows={5}
              required
            ></textarea>
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
}
