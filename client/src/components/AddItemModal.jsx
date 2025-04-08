import React, { useState } from 'react';
import api from '../utils/axios';

const AddItemModal = ({ isOpen, onClose, onItemAdded }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: '',
    image_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    document.getElementById('item-image-input').click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData(prev => ({
        ...prev,
        image_url: imageUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/menu', formData);
      onItemAdded(response.data);
      onClose();
      setFormData({
        nom: '',
        description: '',
        prix: '',
        categorie: '',
        image_url: ''
      });
      setPreviewImage(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1B4332]">Ajouter un item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="flex justify-center mb-4">
            <div 
              onClick={handleImageClick}
              className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-[#1B4332] cursor-pointer hover:opacity-90 transition-opacity"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="material-icons text-[#1B4332] text-3xl">add_photo_alternate</span>
                </div>
              )}
              <input
                type="file"
                id="item-image-input"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332]"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1B4332] focus:ring-[#1B4332]"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Entrées">Entrées</option>
              <option value="Plats">Plats</option>
              <option value="Desserts">Desserts</option>
              <option value="Boissons">Boissons</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#1B4332] text-white px-4 py-2 rounded-md hover:bg-[#1B4332]/90 focus:outline-none focus:ring-2 focus:ring-[#1B4332] focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal; 