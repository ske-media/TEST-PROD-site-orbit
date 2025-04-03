import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader } from 'lucide-react';

function PartnershipForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    website: '',
    experience: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setFormSuccess(false);

    try {
      // Préparer les données pour Netlify Forms
      const netlifyFormData = new FormData();
      netlifyFormData.append('form-name', 'partnership');
      netlifyFormData.append('bot-field', ''); // Honeypot field for spam detection
      
      // Ajouter toutes les données du formulaire
      Object.entries(formData).forEach(([key, value]) => {
        netlifyFormData.append(key, value.toString());
      });

      await fetch('/', {
        method: 'POST',
        body: netlifyFormData
      });

      setFormSuccess(true);
      setTimeout(() => {
        navigate('/success/partnership');
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setFormError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hidden field for honeypot - anti-spam protection */}
      <p className="hidden">
        <input name="bot-field" />
      </p>

      <div className="max-w-4xl mx-auto px-4">
        <Link to="/devenir-partenaire" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft className="h-5 w-5" />
          Retour
        </Link>

        <h1 className="text-4xl font-bold mb-8 gradient-text">Devenir Partenaire</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-300 mb-1 block">Nom complet *</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                />
              </label>

              <label className="block">
                <span className="text-gray-300 mb-1 block">Email professionnel *</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                />
              </label>

              <label className="block">
                <span className="text-gray-300 mb-1 block">Téléphone *</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                />
              </label>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-300 mb-1 block">Entreprise</span>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                />
              </label>

              <label className="block">
                <span className="text-gray-300 mb-1 block">Site web</span>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                />
              </label>

              <label className="block">
                <span className="text-gray-300 mb-1 block">Expérience dans la vente *</span>
                <select
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white"
                >
                  <option value="">Sélectionnez une option</option>
                  <option value="1-2">1-2 ans</option>
                  <option value="3-5">3-5 ans</option>
                  <option value="5+">Plus de 5 ans</option>
                </select>
              </label>
            </div>
          </div>

          <label className="block">
            <span className="text-gray-300 mb-1 block">Message (Optionnel)</span>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full p-4 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B026FF] text-white resize-none"
              placeholder="Parlez-nous de vos objectifs en tant que partenaire..."
            />
          </label>

          {/* Form status messages */}
          {formError && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg">
              {formError}
            </div>
          )}
          
          {formSuccess && (
            <div className="bg-green-500/10 text-green-400 p-3 rounded-lg">
              Formulaire envoyé avec succès! Redirection en cours...
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 w-full md:w-auto bg-[#B026FF] px-8 py-4 rounded-full text-lg font-medium hover:bg-[#B026FF]/80 transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(176,38,255,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer ma candidature
                <Send className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PartnershipForm;