import { useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const MenuForm = ({ onSubmissionSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/menu-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: 'Formulaire soumis avec succès !'
        });
        setFormData({ nom: '', prenom: '', email: '', message: '' });
        onSubmissionSuccess();
      } else {
        throw new Error(data.message || 'Erreur lors de la soumission');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Une erreur est survenue'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section bg-black p-6 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nom" className="block text-white text-sm font-medium mb-2">
              Nom
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="form-input w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-0 transition-colors"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-white text-sm font-medium mb-2">
              Prénom
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="form-input w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-0 transition-colors"
              placeholder="Votre prénom"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-0 transition-colors"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            className="form-textarea w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:border-white focus:ring-0 transition-colors resize-y"
            placeholder="Votre message..."
          />
        </div>

        {status.message && (
          <div className={`rounded-lg p-4 ${status.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'} flex items-center gap-2`}>
            {status.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <ExclamationCircleIcon className="w-5 h-5" />
            )}
            <p>{status.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-white/90 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

export default MenuForm;
