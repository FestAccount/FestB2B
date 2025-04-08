import React, { useState } from 'react';
import TablesModal from './TablesModal';
import BoostConfirmationModal from './BoostConfirmationModal';

const QuickActions = () => {
  const [isTablesModalOpen, setIsTablesModalOpen] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

  return (
    <div className="bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="w-full flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            onClick={() => window.location.href = '/menu'}
          >
            <span className="material-icons text-xl mr-3 text-[#1B4332]">restaurant_menu</span>
            <span className="text-base text-gray-700 font-medium">Modifier le menu</span>
          </button>

          <button
            className="w-full flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            onClick={() => setIsTablesModalOpen(true)}
          >
            <span className="material-icons text-xl mr-3 text-[#1B4332]">event_available</span>
            <span className="text-base text-gray-700 font-medium">Complétez vos réservations</span>
          </button>

          <button
            className="w-full flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <span className="material-icons text-xl mr-3 text-[#1B4332]">integration_instructions</span>
            <span className="text-base text-gray-700 font-medium">Connectez vos services partenaires</span>
          </button>
        </div>
      </div>

      {/* Modales */}
      <TablesModal
        isOpen={isTablesModalOpen}
        onClose={() => setIsTablesModalOpen(false)}
        onTableSelect={(table) => {
          setIsTablesModalOpen(false);
          setIsBoostModalOpen(true);
        }}
      />

      <BoostConfirmationModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
      />
    </div>
  );
};

export default QuickActions; 