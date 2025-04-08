import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORY_MAP = {
  'entrees': 'Entrées',
  'plats': 'Plats',
  'desserts': 'Desserts',
  'boissons': 'Boissons'
};

function MenuItems() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/menu');
        if (isMounted) {
          const filteredItems = response.data.filter(
            item => item.categorie === CATEGORY_MAP[category]
          );
          setItems(filteredItems);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erreur lors du chargement des items');
          console.error('Error fetching items:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [category]);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`/api/menu/${itemId}`);
      setItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucun item dans cette catégorie
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {item.image_url && (
            <img 
              src={item.image_url} 
              alt={item.nom} 
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{item.nom}</h3>
            <p className="text-gray-600 mt-1">{item.description}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-[#1B4332] font-bold">
                {parseFloat(item.prix).toFixed(2)}€
              </span>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:text-red-800"
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MenuItems; 