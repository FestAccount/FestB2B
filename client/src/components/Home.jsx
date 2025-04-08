import React, { useState } from 'react';
import QuickActions from './QuickActions';
import RestaurantProfile from './RestaurantProfile';

const Home = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleProfileImageUpdate = (newImageUrl) => {
    setProfileImage(newImageUrl);
    // Ici, vous pouvez ajouter la logique pour sauvegarder l'URL de l'image dans la base de données
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-[#C25E37] text-2xl font-bold text-center">Fest!</h1>
          <p className="text-gray-500 text-center">Pro</p>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <RestaurantProfile
          profileImage={profileImage}
          onImageUpdate={handleProfileImageUpdate}
        />
        <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1B4332]">42</div>
              <div className="text-sm text-gray-500">couverts<br/>Midi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1B4332]">42</div>
              <div className="text-sm text-gray-500">couverts<br/>Soir</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1B4332]">84</div>
              <div className="text-sm text-gray-500">couverts<br/>Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <a href="/" className="flex flex-col items-center text-[#1B4332]">
            <span className="material-icons">home</span>
            <span className="text-xs">Homepage</span>
          </a>
          <a href="/menu" className="flex flex-col items-center text-gray-400">
            <span className="material-icons">menu_book</span>
            <span className="text-xs">Menu</span>
          </a>
          <a href="/restaurant" className="flex flex-col items-center text-gray-400">
            <span className="material-icons">store</span>
            <span className="text-xs">Mon Restaurant</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Home; 