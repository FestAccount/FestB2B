import React from 'react';
import { useNavigate } from 'react-router-dom';

const Integrations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {/* Header */}
      <header className="bg-white py-4 border-b border-ios-gray-separator">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-secondary text-2xl font-bold text-center">Fest!</h1>
          <p className="text-gray-500 text-center">Pro</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">Intégrations</h2>
          <p className="text-gray-600 mb-6">
            Connectez vos services préférés pour optimiser la gestion de votre restaurant.
          </p>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-3">restaurant_menu</span>
                  <div>
                    <h3 className="font-medium">TheFork Manager</h3>
                    <p className="text-sm text-gray-500">Gestion des réservations</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg">
                  Connecter
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-3">delivery_dining</span>
                  <div>
                    <h3 className="font-medium">Uber Eats</h3>
                    <p className="text-sm text-gray-500">Livraison de repas</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg">
                  Connecter
                </button>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-3">point_of_sale</span>
                  <div>
                    <h3 className="font-medium">Square</h3>
                    <p className="text-sm text-gray-500">Système de caisse</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg">
                  Connecter
                </button>
              </div>
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
            <span className="material-icons text-ios-gray-secondary">store</span>
            <span className="text-xs text-ios-gray-secondary">Restaurant</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Integrations; 