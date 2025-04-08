import React, { useState, useEffect } from 'react';
import apiClient from '../api/config';
import { useNavigate } from 'react-router-dom';

const Restaurant = () => {
  const navigate = useNavigate();
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    adresse: '',
    telephone: '',
    email: '',
    horaires: {
      midi: '',
      soir: ''
    },
    capacite: {
      midi: 0,
      soir: 0
    },
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchRestaurantInfo();
  }, []);

  const fetchRestaurantInfo = async () => {
    try {
      setLoading(true);
      console.log('Début de la récupération des infos restaurant');
      const response = await apiClient.get('/restaurant');
      const data = response.data;
      console.log('Données restaurant reçues:', data);
      
      // S'assurer que les propriétés requises existent
      const normalizedData = {
        ...data,
        horaires: data.horaires || { midi: '', soir: '' },
        capacite: data.capacite || { midi: 0, soir: 0 }
      };
      
      // S'assurer que les structures internes sont correctes
      if (typeof normalizedData.horaires !== 'object') {
        normalizedData.horaires = { midi: '', soir: '' };
      }
      
      if (typeof normalizedData.capacite !== 'object') {
        normalizedData.capacite = { midi: 0, soir: 0 };
      }
      
      console.log('Données restaurant normalisées:', normalizedData);
      setRestaurantInfo(normalizedData);
      setFormData(normalizedData);
    } catch (err) {
      console.error('Erreur détaillée lors du chargement des informations:', err);
      if (err.response) {
        console.error('Réponse d\'erreur:', err.response.data);
      }
      setError('Erreur lors du chargement des informations: ' + (err.message || 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create temporary preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Début de la soumission du formulaire');
      let imageUrl = formData.image_url || formData.image || ''; // Keep existing image URL by default

      // If there's a new file selected, upload it first
      if (selectedFile) {
        console.log('Upload du nouveau fichier image');
        // Convert file to base64
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        // Upload to Cloudinary
        console.log('Envoi de l\'image au serveur');
        try {
          const uploadResponse = await apiClient.post('/upload-image', {
            image: base64Image
          });
          imageUrl = uploadResponse.data.imageUrl;
          console.log('Image URL reçue:', imageUrl);
        } catch (uploadErr) {
          console.error('Erreur lors de l\'upload de l\'image:', uploadErr);
          // Continue with the existing image if upload fails
          console.log('Utilisation de l\'image existante');
        }
      }

      // Ensure data structure is complete
      const { _id, __v, created_at, updated_at, ...dataToSend } = formData;
      const updatedData = {
        ...dataToSend,
        image_url: imageUrl,
        horaires: {
          midi: formData.horaires?.midi || '',
          soir: formData.horaires?.soir || ''
        },
        capacite: {
          midi: parseInt(formData.capacite?.midi || 0, 10),
          soir: parseInt(formData.capacite?.soir || 0, 10)
        }
      };

      console.log('Données à envoyer pour mise à jour:', updatedData);
      const response = await apiClient.put('/restaurant', updatedData);
      console.log('Réponse de mise à jour reçue:', response.data);
      
      setRestaurantInfo(response.data);
      setIsModalOpen(false);
      setSelectedFile(null); // Clear selected file
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview); // Clean up preview URL
        setImagePreview(null);
      }
      // Rafraîchir les données
      fetchRestaurantInfo();
    } catch (err) {
      console.error('Erreur détaillée lors de la mise à jour:', err);
      if (err.response) {
        console.error('Réponse d\'erreur:', err.response.data);
      }
      setError('Erreur lors de la mise à jour: ' + (err.message || 'Erreur inconnue'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex flex-col justify-center items-center p-4">
        <div className="text-red-600 text-center py-4 mb-4">{error}</div>
        <button 
          onClick={fetchRestaurantInfo} 
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* Header */}
      <header className="bg-white py-4 border-b border-ios-gray-separator">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-secondary text-2xl font-bold text-center">Fest!</h1>
          <p className="text-ios-gray-text text-center">Pro</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Restaurant Info Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-64 w-full">
            {restaurantInfo?.image_url ? (
              <img 
                src={restaurantInfo.image_url} 
                alt={restaurantInfo.nom}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="material-icons text-gray-400 text-5xl">restaurant</span>
              </div>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-2">{restaurantInfo.nom}</h2>
                <p className="text-gray-600 mb-6">{restaurantInfo.description}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-ios-gray-text">
                <span className="material-icons text-primary mr-3">location_on</span>
                <span>{restaurantInfo.adresse}</span>
              </div>
              <div className="flex items-center text-ios-gray-text">
                <span className="material-icons text-primary mr-3">phone</span>
                <span>{restaurantInfo.telephone}</span>
              </div>
              <div className="flex items-center text-ios-gray-text">
                <span className="material-icons text-primary mr-3">email</span>
                <span>{restaurantInfo.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hours Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Horaires</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="font-medium text-primary">Midi</p>
                <p className="text-ios-gray-text">{restaurantInfo?.horaires?.midi || 'Non défini'}</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-primary">Soir</p>
                <p className="text-ios-gray-text">{restaurantInfo?.horaires?.soir || 'Non défini'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Capacité</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="font-medium text-primary">Midi</p>
                <p className="text-ios-gray-text">{restaurantInfo?.capacite?.midi || 0} couverts</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-primary">Soir</p>
                <p className="text-ios-gray-text">{restaurantInfo?.capacite?.soir || 0} couverts</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-2">
            Image du restaurant
          </label>
          <div className="space-y-4">
            {(imagePreview || formData.image) && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                  src={imagePreview || formData.image}
                  alt="Prévisualisation"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary">
                <span className="material-icons text-gray-400 text-3xl mb-2">cloud_upload</span>
                <span className="text-sm text-gray-500">Cliquez pour sélectionner une image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-ios-gray-separator pb-safe-bottom">
        <div className="flex justify-around py-2">
          <button onClick={() => navigate('/')} className="flex flex-col items-center px-6 py-1">
            <span className="material-icons text-ios-gray-secondary">home</span>
            <span className="text-xs text-ios-gray-secondary">Accueil</span>
          </button>
          <button onClick={() => navigate('/menu')} className="flex flex-col items-center px-6 py-1">
            <span className="material-icons text-ios-gray-secondary">menu_book</span>
            <span className="text-xs text-ios-gray-secondary">Menu</span>
          </button>
          <button onClick={() => navigate('/restaurant')} className="flex flex-col items-center px-6 py-1">
            <span className="material-icons text-primary">store</span>
            <span className="text-xs text-primary">Restaurant</span>
          </button>
        </div>
      </nav>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-primary">Modifier les informations</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Nom du restaurant
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Horaires
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="horaires.midi"
                        value={formData.horaires.midi}
                        onChange={handleChange}
                        placeholder="Midi"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="horaires.soir"
                        value={formData.horaires.soir}
                        onChange={handleChange}
                        placeholder="Soir"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Capacité
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        name="capacite.midi"
                        value={formData.capacite.midi}
                        onChange={handleChange}
                        placeholder="Midi"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        name="capacite.soir"
                        value={formData.capacite.soir}
                        onChange={handleChange}
                        placeholder="Soir"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Image du restaurant
                  </label>
                  <div className="space-y-4">
                    {(imagePreview || formData.image) && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <img
                          src={imagePreview || formData.image}
                          alt="Prévisualisation"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-center w-full">
                      <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary">
                        <span className="material-icons text-gray-400 text-3xl mb-2">cloud_upload</span>
                        <span className="text-sm text-gray-500">Cliquez pour sélectionner une image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant; 