import React, { useState } from 'react';
import axios from 'axios';

const RestaurantProfile = ({ profileImage, onImageUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      onImageUpdate(imageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-2">
        <div 
          className="w-full h-full rounded-full overflow-hidden border-4 border-[#1B4332] cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={profileImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
            alt="Restaurant Profile"
            className="w-full h-full object-cover"
          />
          <input
            type="file"
            id="profile-image-input"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-[#1B4332] text-white text-xs px-2 py-1 rounded-full">
          New
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-800">Restaurant gastronomique français</h2>
      </div>
    </div>
  );
};

export default RestaurantProfile; 