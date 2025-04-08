import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

function Homepage() {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Démarrage du chargement des données...');
        setLoading(true);
        setError(null);
        
        const [menuResponse, restaurantResponse] = await Promise.all([
          api.get('/menu'),
          api.get('/restaurant')
        ]);
        
        console.log('Données menu reçues:', menuResponse.data);
        console.log('Données restaurant reçues:', restaurantResponse.data);
        
        setMenuItems(menuResponse.data || []);
        setRestaurantInfo(restaurantResponse.data || {});
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const countByCategory = (category) => {
    return menuItems.filter(item => item.categorie === category).length;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="mb-4">
          <h1 className="text-[#C25E37] text-2xl font-bold">Fest!</h1>
          <p className="text-gray-500">Pro</p>
        </div>
        
        <div className="w-24 h-24 mx-auto mb-4 relative">
          {restaurantInfo?.image_url ? (
            <img
              src={restaurantInfo.image_url}
              alt={restaurantInfo.nom}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
              <span className="material-icons text-gray-400 text-3xl">restaurant</span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <span className="mr-1">New</span>
            <span className="material-icons text-sm">check_circle</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{restaurantInfo?.description}</p>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{restaurantInfo?.capacite?.midi}</div>
            <div className="text-sm text-gray-500">couverts<br />Midi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{restaurantInfo?.capacite?.soir}</div>
            <div className="text-sm text-gray-500">couverts<br />Soir</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {(restaurantInfo?.capacite?.midi || 0) + (restaurantInfo?.capacite?.soir || 0)}
            </div>
            <div className="text-sm text-gray-500">couverts<br />Total</div>
          </div>
        </div>
      </header>

      {/* Actions rapides */}
      <section className="px-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
        <div className="space-y-3">
          <Link 
            to="/menu"
            className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <span className="material-icons mr-3">menu_book</span>
            <span>Modifier le menu</span>
          </Link>
          <Link 
            to="/reservations"
            className="w-full flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <span className="material-icons mr-3">event_seat</span>
            <span>Complétez vos réservations</span>
          </Link>
          <Link 
            to="/integrations"
            className="w-full flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <span className="material-icons mr-3">integration_instructions</span>
            <span>Connectez vos services partenaires</span>
          </Link>
        </div>
      </section>

      {/* Menu du jour */}
      <section className="px-6 mb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Menu du jour</h2>
        </div>

        {/* Entrées */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg">Entrées</h3>
            <span className="text-sm text-gray-500">{countByCategory('Entrées')} plats</span>
          </div>
          {menuItems
            .filter(item => item.categorie === 'Entrées')
            .slice(0, 1)
            .map(item => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm mb-4">
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.nom}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.nom}</h4>
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 text-sm mr-1">edit</span>
                      <span className="font-medium">{parseFloat(item.prix).toFixed(2)}€</span>
                      <span className="material-icons text-gray-400 text-sm ml-1">edit</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Plats */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg">Plats</h3>
            <span className="text-sm text-gray-500">{countByCategory('Plats')} plats</span>
          </div>
          {menuItems
            .filter(item => item.categorie === 'Plats')
            .slice(0, 1)
            .map(item => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm mb-4">
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.nom}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.nom}</h4>
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 text-sm mr-1">edit</span>
                      <span className="font-medium">{parseFloat(item.prix).toFixed(2)}€</span>
                      <span className="material-icons text-gray-400 text-sm ml-1">edit</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Desserts */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg">Desserts</h3>
            <span className="text-sm text-gray-500">{countByCategory('Desserts')} plats</span>
          </div>
          {menuItems
            .filter(item => item.categorie === 'Desserts')
            .slice(0, 1)
            .map(item => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm mb-4">
                {item.image_url && (
                  <img 
                    src={item.image_url} 
                    alt={item.nom}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.nom}</h4>
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 text-sm mr-1">edit</span>
                      <span className="font-medium">{parseFloat(item.prix).toFixed(2)}€</span>
                      <span className="material-icons text-gray-400 text-sm ml-1">edit</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <Link 
          to="/menu"
          className="block w-full py-3 px-4 bg-[#1B4332] text-white text-center rounded-lg hover:bg-[#1B4332]/90"
        >
          Voir le menu complet
        </Link>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link to="/" className="flex flex-col items-center text-[#1B4332]">
            <span className="material-icons">home</span>
            <span className="text-xs">Homepage</span>
          </Link>
          <Link to="/menu" className="flex flex-col items-center text-gray-400">
            <span className="material-icons">menu_book</span>
            <span className="text-xs">Menu</span>
          </Link>
          <Link to="/restaurant" className="flex flex-col items-center text-gray-400">
            <span className="material-icons">store</span>
            <span className="text-xs">Mon Restaurant</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Homepage; 