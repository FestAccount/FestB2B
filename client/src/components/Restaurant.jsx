import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const parseTimeRange = (timeString) => {
  if (!timeString) return { debut: '12:00', fin: '14:00' };
  const parts = timeString.split('-').map(t => t.trim());
  return {
    debut: parts[0] || '12:00',
    fin: parts[1] || '14:00'
  };
};

const Restaurant = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/restaurant');
      setRestaurants(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des restaurants:', err);
      setError('Erreur lors du chargement des restaurants');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async (restaurantId) => {
    try {
      const response = await apiClient.get(`/menu?restaurantId=${restaurantId}`);
      setMenus(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des menus:', err);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedRestaurant({
      ...selectedRestaurant,
      horaires: {
        midi: parseTimeRange(selectedRestaurant.horaires?.midi),
        soir: parseTimeRange(selectedRestaurant.horaires?.soir)
      },
      cuisine: selectedRestaurant.cuisine || []
    });
    setImagePreview(selectedRestaurant.imageUrl);
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
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dxrttyi2g/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      setImagePreview(data.secure_url);
      setEditedRestaurant(prev => ({
        ...prev,
        imageUrl: data.secure_url
      }));
      toast.success('Image téléchargée avec succès');
    } catch (err) {
      console.error('Erreur lors du téléchargement de l\'image:', err);
      toast.error('Erreur lors du téléchargement de l\'image');
    }
  };

  const handleSave = async () => {
    try {
      const restaurantData = {
        ...editedRestaurant,
        horaires: {
          midi: `${editedRestaurant.horaires.midi.debut} - ${editedRestaurant.horaires.midi.fin}`,
          soir: `${editedRestaurant.horaires.soir.debut} - ${editedRestaurant.horaires.soir.fin}`
        }
      };

      const response = await apiClient.put(`/restaurant/${editedRestaurant._id}`, restaurantData);
      setSelectedRestaurant(response.data);
      setIsEditing(false);
      toast.success('Restaurant mis à jour avec succès!');
      fetchRestaurants(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast.error('Erreur lors de la mise à jour du restaurant');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <ToastContainer />
      
      {/* Header */}
      <header className="bg-white py-4 border-b border-ios-gray-separator">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-secondary text-2xl font-bold text-center">Fest!</h1>
          <p className="text-ios-gray-text text-center">Pro</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Liste des restaurants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              <div className="relative h-48 w-full">
                {restaurant.imageUrl ? (
                  <img 
                    src={restaurant.imageUrl} 
                    alt={restaurant.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="material-icons text-gray-400 text-5xl">restaurant</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-primary mb-2">{restaurant.nom}</h2>
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-gray-500">
                    <span className="material-icons text-sm mr-1">location_on</span>
                    <span className="text-sm">{restaurant.adresse}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="material-icons text-sm mr-1">schedule</span>
                    <span className="text-sm">
                      Midi: {restaurant.horaires?.midi}, Soir: {restaurant.horaires?.soir}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="material-icons text-sm mr-1">people</span>
                    <span className="text-sm">
                      {restaurant.capacite?.midi} couverts midi, {restaurant.capacite?.soir} couverts soir
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {restaurant.cuisine?.map((type, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {CUISINE_TYPES.find(t => t.id === type)?.label || type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton Modifier */}
        {selectedRestaurant && !isEditing && (
          <button
            onClick={handleEditClick}
            className="w-full mt-6 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <span className="material-icons">edit</span>
            Modifier les informations
          </button>
        )}

        {/* Détails du restaurant sélectionné */}
        {selectedRestaurant && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8">
            <div className="p-6">
              {!isEditing ? (
                <>
                  {/* Mode lecture */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-semibold text-primary">Informations du restaurant</h2>
                    </div>

                    {/* Image */}
                    <div className="relative h-64 w-full rounded-xl overflow-hidden">
                      {selectedRestaurant.imageUrl ? (
                        <img 
                          src={selectedRestaurant.imageUrl} 
                          alt={selectedRestaurant.nom}
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
                        <h3 className="font-medium text-gray-900">{selectedRestaurant.nom}</h3>
                        <p className="text-gray-600 mt-1">{selectedRestaurant.description}</p>
                      </div>
                      
                      <div className="flex items-center text-gray-500">
                        <span className="material-icons text-sm mr-1">schedule</span>
                        <div>
                          <p>Midi: {selectedRestaurant.horaires?.midi}</p>
                          <p>Soir: {selectedRestaurant.horaires?.soir}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedRestaurant.cuisine?.map((type, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                          >
                            {CUISINE_TYPES.find(t => t.id === type)?.label || type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Mode édition */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-primary">Modifier les informations</h2>

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
                          value={editedRestaurant.nom}
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
                          value={editedRestaurant.description}
                          onChange={handleInputChange}
                          rows="4"
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
                                value={editedRestaurant.horaires.midi.debut}
                                className="time-picker"
                                clearIcon={null}
                                format="HH:mm"
                              />
                              <span>-</span>
                              <TimePicker
                                onChange={(value) => handleTimeChange('midi', 'fin', value)}
                                value={editedRestaurant.horaires.midi.fin}
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
                                value={editedRestaurant.horaires.soir.debut}
                                className="time-picker"
                                clearIcon={null}
                                format="HH:mm"
                              />
                              <span>-</span>
                              <TimePicker
                                onChange={(value) => handleTimeChange('soir', 'fin', value)}
                                value={editedRestaurant.horaires.soir.fin}
                                className="time-picker"
                                clearIcon={null}
                                format="HH:mm"
                              />
                            </div>
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
                                checked={editedRestaurant.cuisine.includes(type.id)}
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
                        onClick={handleCancelEdit}
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
                </>
              )}
            </div>
          </div>
        )}
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