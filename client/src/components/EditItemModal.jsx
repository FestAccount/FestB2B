import React, { useState, useEffect } from 'react';
import api from '../utils/axios';

const EditItemModal = ({ isOpen, onClose, item, onItemUpdated, onItemDeleted }) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    categorie: '',
    image_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        nom: item.nom || '',
        description: item.description || '',
        prix: item.prix?.toString() || '',
        categorie: item.categorie || '',
        image_url: item.image_url || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`/menu/${item._id}`, formData);
      onItemUpdated(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la modification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/menu/${item._id}`);
      onItemDeleted(item._id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Modifier l'élément</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Entrées">Entrées</option>
              <option value="Plats">Plats</option>
              <option value="Desserts">Desserts</option>
              <option value="Boissons">Boissons</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">URL de l'image</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Modification...' : 'Modifier'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal; 