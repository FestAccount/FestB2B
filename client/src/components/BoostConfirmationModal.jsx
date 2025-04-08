import React from 'react';

const BoostConfirmationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="my-6">
          <div className="flex justify-center mb-4">
            <span className="material-icons text-green-500 text-6xl">check_circle</span>
          </div>
          <p className="text-lg text-gray-800 mb-4">
            Votre restaurant sera mis en avant pendant une heure sur l'application des clients pour compléter vos réservations
          </p>
          <button
            onClick={onClose}
            className="bg-[#1B4332] text-white px-6 py-2 rounded-lg hover:bg-[#1B4332]/90 transition-colors duration-200"
          >
            Compris
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoostConfirmationModal; 