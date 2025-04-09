import React from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const RestaurantProfile = ({ restaurant }) => {
  // Calcul du total des couverts
  const totalCouverts = (restaurant?.capacite?.midi || 0) + (restaurant?.capacite?.soir || 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">Fest!</div>
        <div className="text-sm text-gray-500">Pro</div>

        {/* Image du restaurant en cercle */}
        <div className="relative w-24 h-24 mx-auto my-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={restaurant?.imageUrl || '/default-restaurant.jpg'}
            alt={restaurant?.nom || 'Restaurant'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-restaurant.jpg';
            }}
          />
        </div>

        {/* Statistiques des couverts */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {restaurant?.capacite?.midi || 0}
            </div>
            <div className="text-sm text-gray-500">
              couverts<br/>Midi
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {restaurant?.capacite?.soir || 0}
            </div>
            <div className="text-sm text-gray-500">
              couverts<br/>Soir
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {totalCouverts}
            </div>
            <div className="text-sm text-gray-500">
              couverts<br/>Total
            </div>
          </div>
        </div>
      </div>

      {/* Informations du restaurant */}
      <div className="space-y-4">
        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{restaurant?.adresse || 'Adresse non renseignée'}</span>
        </div>
        <div className="flex items-center">
          <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{restaurant?.telephone || 'Téléphone non renseigné'}</span>
        </div>
        <div className="flex items-center">
          <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">{restaurant?.email || 'Email non renseigné'}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div className="text-gray-600">
            <div>Midi : {restaurant?.horaires?.midi || 'Horaires non renseignés'}</div>
            <div>Soir : {restaurant?.horaires?.soir || 'Horaires non renseignés'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile; 