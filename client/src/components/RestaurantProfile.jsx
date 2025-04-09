import React, { useState } from 'react';
import axios from 'axios';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

const RestaurantProfile = ({ restaurant }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calcul du total des couverts
  const totalCouverts = (restaurant?.capacite?.midi || 0) + (restaurant?.capacite?.soir || 0);

  const handleImageClick = () => {
    document.getElementById('profile-image-input').click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      // Pour l'instant, nous utiliserons une URL temporaire
      const imageUrl = URL.createObjectURL(file);
      // onImageUpdate(imageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Image du restaurant */}
      <div className="w-full h-48 mb-6 rounded-lg overflow-hidden">
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

      <h2 className="text-2xl font-bold text-gray-800 mb-4">{restaurant?.nom || 'Restaurant'}</h2>
      
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

      {/* Reste du contenu existant */}
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