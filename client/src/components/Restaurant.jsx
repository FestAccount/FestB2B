import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/config';

const Restaurant = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRestaurant, setEditedRestaurant] = useState(null);
  const [notification, setNotification] = useState(null);

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

  const handleRestaurantClick = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditedRestaurant(restaurant);
    await fetchMenus(restaurant._id);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedRestaurant({ ...selectedRestaurant });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedRestaurant(selectedRestaurant);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedRestaurant(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedRestaurant(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const response = await apiClient.put(`/restaurant/${editedRestaurant._id}`, editedRestaurant);
      setSelectedRestaurant(response.data);
      setIsEditing(false);
      setNotification({
        type: 'success',
        message: 'Restaurant mis à jour avec succès!'
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setNotification({
        type: 'error',
        message: 'Erreur lors de la mise à jour du restaurant'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* Header */}
      <header className="bg-white py-4 border-b border-ios-gray-separator">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-secondary text-2xl font-bold text-center">Fest!</h1>
          <p className="text-ios-gray-text text-center">Pro</p>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

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
                <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 text-sm font-medium text-primary">
                  {restaurant.rating} ★
                </div>
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
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Détails du restaurant sélectionné */}
        {selectedRestaurant && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        value={editedRestaurant.nom}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={editedRestaurant.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Adresse</label>
                      <input
                        type="text"
                        name="adresse"
                        value={editedRestaurant.adresse}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Horaires Midi</label>
                        <input
                          type="text"
                          name="horaires.midi"
                          value={editedRestaurant.horaires?.midi}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Horaires Soir</label>
                        <input
                          type="text"
                          name="horaires.soir"
                          value={editedRestaurant.horaires?.soir}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Capacité Midi</label>
                        <input
                          type="number"
                          name="capacite.midi"
                          value={editedRestaurant.capacite?.midi}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Capacité Soir</label>
                        <input
                          type="number"
                          name="capacite.soir"
                          value={editedRestaurant.capacite?.soir}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold text-primary">Informations du restaurant</h2>
                    <button
                      onClick={handleEditClick}
                      className="p-2 text-primary hover:bg-gray-100 rounded-full"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                  </>
                )}
              </div>
              
              {!isEditing && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedRestaurant.nom}</h3>
                    <p className="text-gray-600 mt-1">{selectedRestaurant.description}</p>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="material-icons text-sm mr-1">location_on</span>
                    <span>{selectedRestaurant.adresse}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="material-icons text-sm mr-1">schedule</span>
                    <span>
                      Midi: {selectedRestaurant.horaires?.midi}, Soir: {selectedRestaurant.horaires?.soir}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <span className="material-icons text-sm mr-1">people</span>
                    <span>
                      {selectedRestaurant.capacite?.midi} couverts midi, {selectedRestaurant.capacite?.soir} couverts soir
                    </span>
                  </div>
                </div>
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