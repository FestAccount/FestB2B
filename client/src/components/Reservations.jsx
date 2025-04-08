import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reservations = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulation des tables du restaurant
  const tables = [
    { id: 1, number: 1, capacity: 2, isReserved: true },
    { id: 2, number: 2, capacity: 2, isReserved: false },
    { id: 3, number: 3, capacity: 4, isReserved: true },
    { id: 4, number: 4, capacity: 4, isReserved: false },
    { id: 5, number: 5, capacity: 6, isReserved: true },
    { id: 6, number: 6, capacity: 6, isReserved: false },
    { id: 7, number: 7, capacity: 2, isReserved: false },
    { id: 8, number: 8, capacity: 4, isReserved: true },
    { id: 9, number: 9, capacity: 4, isReserved: false },
    { id: 10, number: 10, capacity: 8, isReserved: true },
  ];

  const handleTableClick = (table) => {
    if (!table.isReserved) {
      setIsModalOpen(true);
    }
  };

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
          <h2 className="text-2xl font-semibold text-primary mb-4">Réservations</h2>
          
          {/* Tables Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`p-4 rounded-xl border ${
                  table.isReserved 
                    ? 'bg-gray-100 border-gray-200' 
                    : 'bg-white border-primary hover:bg-primary/5'
                } transition-colors relative`}
              >
                <div className="flex flex-col items-center">
                  <span className="material-icons text-3xl mb-2">
                    {table.capacity <= 2 ? 'table_restaurant' : 'deck'}
                  </span>
                  <span className="font-medium">Table {table.number}</span>
                  <span className="text-sm text-gray-500">{table.capacity} places</span>
                  <div className={`mt-2 px-2 py-1 rounded-full text-xs ${
                    table.isReserved 
                      ? 'bg-gray-200 text-gray-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {table.isReserved ? 'Réservé' : 'Disponible'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
              <span>Réservé</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
              <span>Disponible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Promotion de table</h3>
            <p className="text-gray-600 mb-6">
              Votre restaurant sera mis en avant pendant une heure sur l'application côté client pour compléter vos réservations !
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              C'est compris
            </button>
          </div>
        </div>
      )}

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

export default Reservations; 