import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import apiClient from '../api/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const CUISINE_TYPES = [
  { id: 'vegetarien', label: 'Végétarien' },
  { id: 'vegan', label: 'Végan' },
  { id: 'sans_gluten', label: 'Sans gluten' },
  { id: 'produits_locaux', label: 'Produits locaux' }
];

const CLOUDINARY_CONFIG = {
  cloudName: 'dxrttyi2g',
  uploadPreset: 'ml_default',
  folder: 'restaurants',
  apiUrl: 'https://api.cloudinary.com/v1_1'
};

const normalizeTime = (timeString) => {
  if (!timeString) return '12:00';
  
  // Supprime les espaces et convertit en minuscules
  timeString = timeString.trim().toLowerCase();
  
  // Gère les formats avec 'h' ou ':'
  const match = timeString.match(/^(\d{1,2})[h:](\d{2})$/);
  if (match) {
    const hours = match[1].padStart(2, '0');
    const minutes = match[2];
    // Validation supplémentaire
    if (parseInt(hours) > 23 || parseInt(minutes) > 59) {
      return '12:00';
    }
    return `${hours}:${minutes}`;
  }
  
  // Si c'est déjà au bon format HH:mm
  if (timeString.match(/^\d{2}:\d{2}$/)) {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (hours > 23 || minutes > 59) {
      return '12:00';
    }
    return timeString;
  }
  
  // Format par défaut si non reconnu
  return '12:00';
};

const parseTimeRange = (timeString) => {
  if (!timeString) return { debut: '12:00', fin: '14:00' };
  
  // Sépare et nettoie la plage horaire
  const parts = timeString.split('-').map(t => t.trim());
  
  return {
    debut: normalizeTime(parts[0] || '12:00'),
    fin: normalizeTime(parts[1] || '14:00')
  };
};

const formatTimeRange = (timeRange) => {
  if (!timeRange?.debut || !timeRange?.fin) return '';
  const debut = normalizeTime(timeRange.debut);
  const fin = normalizeTime(timeRange.fin);
  return `${debut} - ${fin}`;
};

const Restaurant = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/restaurant');
      // On prend le premier restaurant pour l'instant
      const firstRestaurant = response.data[0];
      setRestaurant(firstRestaurant);
      setEditedRestaurant({
        ...firstRestaurant,
        horaires: {
          midi: parseTimeRange(firstRestaurant.horaires?.midi),
          soir: parseTimeRange(firstRestaurant.horaires?.soir)
        },
        cuisine: firstRestaurant.cuisine || []
      });
      setImagePreview(firstRestaurant.imageUrl);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement du restaurant:', err);
      setError('Erreur lors du chargement du restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset edited data
    setEditedRestaurant({
      ...restaurant,
      horaires: {
        midi: parseTimeRange(restaurant.horaires?.midi),
        soir: parseTimeRange(restaurant.horaires?.soir)
      },
      cuisine: restaurant.cuisine || []
    });
    setImagePreview(restaurant.imageUrl);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRestaurant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeChange = (period, type, value) => {
    setEditedRestaurant(prev => ({
      ...prev,
      horaires: {
        ...prev.horaires,
        [period]: {
          ...prev.horaires[period],
          [type]: value
        }
      }
    }));
  };

  const handleCuisineChange = (cuisineId) => {
    setEditedRestaurant(prev => {
      const newCuisine = prev.cuisine.includes(cuisineId)
        ? prev.cuisine.filter(id => id !== cuisineId)
        : [...prev.cuisine, cuisineId];
      return {
        ...prev,
        cuisine: newCuisine
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    // Validation du fichier
    if (!file) {
      toast.error('Aucun fichier sélectionné', { position: "bottom-center" });
      return;
    }

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image', { position: "bottom-center" });
      return;
    }

    // Préparation du FormData avec logging
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder);

    // Debug des données envoyées
    console.log('Cloudinary Upload Config:', {
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      folder: CLOUDINARY_CONFIG.folder,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    try {
      // Construction de l'URL
      const uploadUrl = `${CLOUDINARY_CONFIG.apiUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
      console.log('Upload URL:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Cloudinary Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error,
          message: errorData.message,
          response: errorData
        });
        throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.secure_url) {
        console.error('Invalid Cloudinary Response:', data);
        throw new Error('URL de l\'image non reçue');
      }
      
      console.log('Upload Success:', {
        url: data.secure_url,
        format: data.format,
        size: data.bytes,
        path: data.public_id
      });
      
      setImagePreview(data.secure_url);
      setEditedRestaurant(prev => ({
        ...prev,
        imageUrl: data.secure_url
      }));
      toast.success('Image téléchargée avec succès', { position: "bottom-center" });
    } catch (err) {
      console.error('Upload Error:', err);
      toast.error(
        `Erreur d'upload : ${err.message || 'Erreur inconnue'}`,
        { position: "bottom-center" }
      );
    }
  };

  const handleSave = async () => {
    try {
      // Validation des données avant envoi
      if (!editedRestaurant.nom?.trim()) {
        toast.error('Le nom du restaurant est requis', { position: "bottom-center" });
        return;
      }

      // Formatage des horaires
      const formattedHoraires = {
        midi: formatTimeRange({
          debut: normalizeTime(editedRestaurant.horaires?.midi?.debut),
          fin: normalizeTime(editedRestaurant.horaires?.midi?.fin)
        }),
        soir: formatTimeRange({
          debut: normalizeTime(editedRestaurant.horaires?.soir?.debut),
          fin: normalizeTime(editedRestaurant.horaires?.soir?.fin)
        })
      };

      // Préparation des données
      const restaurantData = {
        ...editedRestaurant,
        nom: editedRestaurant.nom.trim(),
        description: editedRestaurant.description?.trim() || '',
        adresse: editedRestaurant.adresse?.trim() || '',
        telephone: editedRestaurant.telephone?.trim() || '',
        email: editedRestaurant.email?.trim() || '',
        capacite: parseInt(editedRestaurant.capacite) || 0,
        cuisine: Array.isArray(editedRestaurant.cuisine) ? editedRestaurant.cuisine : [],
        horaires: formattedHoraires,
        imageUrl: editedRestaurant.imageUrl || ''
      };

      const response = await apiClient.put(`/restaurant/${editedRestaurant._id}`, restaurantData);
      setRestaurant(response.data);
      setIsModalOpen(false);
      toast.success('Restaurant mis à jour avec succès!', { position: "bottom-center" });
      fetchRestaurant(); // Refresh data
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast.error('Erreur lors de la mise à jour du restaurant', { position: "bottom-center" });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;
  if (!restaurant) return <div className="text-center py-4">Aucun restaurant trouvé</div>;

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Header */}
      <header className="bg-white py-4 border-b border-ios-gray-separator">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-secondary text-2xl font-bold text-center">Fest!</h1>
          <p className="text-ios-gray-text text-center">Pro</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Bloc d'information du restaurant */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Image */}
            <div className="relative h-64 w-full rounded-xl overflow-hidden">
              {restaurant.imageUrl ? (
                <img 
                  src={restaurant.imageUrl} 
                  alt={restaurant.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="material-icons text-gray-400 text-6xl">restaurant</span>
                </div>
              )}
            </div>

            {/* Informations */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-primary">{restaurant.nom}</h2>
                <p className="text-gray-600 mt-2">{restaurant.description}</p>
              </div>

              <div className="flex items-center text-gray-500">
                <span className="material-icons text-sm mr-1">location_on</span>
                <span>{restaurant.adresse}</span>
              </div>
              
              <div className="flex items-center text-gray-500">
                <span className="material-icons text-sm mr-1">schedule</span>
                <div>
                  <p>Midi: {restaurant.horaires?.midi}</p>
                  <p>Soir: {restaurant.horaires?.soir}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-500">
                <span className="material-icons text-sm mr-1">people</span>
                <div>
                  <p>{restaurant.capacite?.midi} couverts midi</p>
                  <p>{restaurant.capacite?.soir} couverts soir</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {restaurant.cuisine?.map((type, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {CUISINE_TYPES.find(t => t.id === type)?.label || type}
                  </span>
                ))}
              </div>
            </div>

            {/* Bouton Modifier */}
            <button
              onClick={handleEditClick}
              className="w-full mt-6 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <span className="material-icons">edit</span>
              Modifier les informations
            </button>
          </div>
        </div>

        {/* Modal d'édition */}
        <Transition appear show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Modifier les informations
                    </Dialog.Title>

                    <div className="space-y-6">
                      {/* Image */}
                      <div className="space-y-4">
                        <div className="relative h-64 w-full rounded-xl overflow-hidden">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Aperçu"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="material-icons text-gray-400 text-6xl">restaurant</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-center">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                              <span className="material-icons">photo_camera</span>
                              Modifier l'image
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Formulaire */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du restaurant
                          </label>
                          <input
                            type="text"
                            name="nom"
                            value={editedRestaurant?.nom || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={editedRestaurant?.description || ''}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresse
                          </label>
                          <input
                            type="text"
                            name="adresse"
                            value={editedRestaurant?.adresse || ''}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        {/* Horaires */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900">Horaires</h3>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm text-gray-700 mb-2">Déjeuner</label>
                              <div className="flex items-center gap-4">
                                <TimePicker
                                  onChange={(value) => handleTimeChange('midi', 'debut', value)}
                                  value={editedRestaurant?.horaires.midi.debut}
                                  className="time-picker"
                                  clearIcon={null}
                                  format="HH:mm"
                                />
                                <span>-</span>
                                <TimePicker
                                  onChange={(value) => handleTimeChange('midi', 'fin', value)}
                                  value={editedRestaurant?.horaires.midi.fin}
                                  className="time-picker"
                                  clearIcon={null}
                                  format="HH:mm"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm text-gray-700 mb-2">Dîner</label>
                              <div className="flex items-center gap-4">
                                <TimePicker
                                  onChange={(value) => handleTimeChange('soir', 'debut', value)}
                                  value={editedRestaurant?.horaires.soir.debut}
                                  className="time-picker"
                                  clearIcon={null}
                                  format="HH:mm"
                                />
                                <span>-</span>
                                <TimePicker
                                  onChange={(value) => handleTimeChange('soir', 'fin', value)}
                                  value={editedRestaurant?.horaires.soir.fin}
                                  className="time-picker"
                                  clearIcon={null}
                                  format="HH:mm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Nombre de couverts */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-gray-900">Nombre de couverts</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-700 mb-2">Midi</label>
                              <input
                                type="number"
                                name="capacite.midi"
                                value={editedRestaurant?.capacite?.midi || 0}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-700 mb-2">Soir</label>
                              <input
                                type="number"
                                name="capacite.soir"
                                value={editedRestaurant?.capacite?.soir || 0}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Types de cuisine */}
                        <div className="space-y-3">
                          <h3 className="font-medium text-gray-900">Types de cuisine</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {CUISINE_TYPES.map((type) => (
                              <label
                                key={type.id}
                                className="flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-gray-50"
                              >
                                <input
                                  type="checkbox"
                                  checked={editedRestaurant?.cuisine.includes(type.id)}
                                  onChange={() => handleCuisineChange(type.id)}
                                  className="w-5 h-5 text-primary rounded focus:ring-primary"
                                />
                                <span>{type.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex gap-4 pt-6">
                        <button
                          onClick={handleCloseModal}
                          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
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
    </div>
  );
};

export default Restaurant; 