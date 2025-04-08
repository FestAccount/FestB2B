import React, { useState } from 'react';

const TablesModal = ({ isOpen, onClose, onTableSelect }) => {
  // Simuler des tables avec des statuts aléatoires
  const tables = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    number: index + 1,
    isReserved: Math.random() < 0.5 // 50% de chance d'être réservé
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#1B4332]">Tables du restaurant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => !table.isReserved && onTableSelect(table)}
              disabled={table.isReserved}
              className={`p-4 rounded-lg border ${
                table.isReserved
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'bg-white border-[#1B4332] hover:bg-[#1B4332] hover:text-white cursor-pointer'
              } transition-colors duration-200`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Table {table.number}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  table.isReserved
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {table.isReserved ? 'Réservée' : 'Libre'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TablesModal; 