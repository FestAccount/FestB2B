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
    await fetchMenus(restaurant._id);
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
                      {restaurant.midi} couverts midi, {restaurant.soir} couverts soir
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

        {/* Détails du restaurant sélectionné et ses menus */}
        {selectedRestaurant && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-primary mb-6">Menus de {selectedRestaurant.nom}</h2>
              
              {/* Entrées */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary mb-4">Entrées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menus
                    .filter(menu => menu.type === 'entrée')
                    .map(menu => (
                      <div key={menu._id} className="bg-gray-50 rounded-lg overflow-hidden">
                        {menu.imageUrl && (
                          <img 
                            src={menu.imageUrl} 
                            alt={menu.nom}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{menu.nom}</h4>
                              <p className="text-gray-600 text-sm mt-1">{menu.description}</p>
                            </div>
                            <span className="font-medium">{menu.prix.toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Plats */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary mb-4">Plats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menus
                    .filter(menu => menu.type === 'plat')
                    .map(menu => (
                      <div key={menu._id} className="bg-gray-50 rounded-lg overflow-hidden">
                        {menu.imageUrl && (
                          <img 
                            src={menu.imageUrl} 
                            alt={menu.nom}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{menu.nom}</h4>
                              <p className="text-gray-600 text-sm mt-1">{menu.description}</p>
                            </div>
                            <span className="font-medium">{menu.prix.toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Desserts */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-primary mb-4">Desserts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menus
                    .filter(menu => menu.type === 'dessert')
                    .map(menu => (
                      <div key={menu._id} className="bg-gray-50 rounded-lg overflow-hidden">
                        {menu.imageUrl && (
                          <img 
                            src={menu.imageUrl} 
                            alt={menu.nom}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{menu.nom}</h4>
                              <p className="text-gray-600 text-sm mt-1">{menu.description}</p>
                            </div>
                            <span className="font-medium">{menu.prix.toFixed(2)}€</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
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