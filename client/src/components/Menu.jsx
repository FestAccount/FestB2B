import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/config';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import { defaultMenuItems } from '../data/defaultMenu';

const CATEGORIES = ['Entrées', 'Plats', 'Desserts', 'Boissons'];

function Menu() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Entrées');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      console.log('Fetching menu items...');
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/menu');
      console.log('API Response:', response);
      console.log('API Response Data:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format: expected an array');
      }
      
      if (response.data.length === 0) {
        console.log('No items found, using default data');
        setItems(defaultMenuItems);
      } else {
        console.log('Items found:', response.data.length);
        console.log('First item example:', response.data[0]);
        setItems(response.data);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
      console.log('Using default menu items due to error');
      setItems(defaultMenuItems);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('Menu component mounted, fetching items...');
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (category) {
      console.log('Category changed to:', category);
      const matchedCategory = CATEGORIES.find(cat => 
        normalizeCategory(cat) === normalizeCategory(category)
      );
      console.log('Matched category:', matchedCategory);
      if (matchedCategory) {
        setActiveCategory(matchedCategory);
      } else {
        console.log('No matching category found, defaulting to Entrées');
        setActiveCategory('Entrées');
      }
    } else {
      console.log('No category provided, defaulting to Entrées');
      setActiveCategory('Entrées');
    }
  }, [category]);

  const handleCategoryChange = (newCategory) => {
    console.log('Changing category to:', newCategory);
    setActiveCategory(newCategory);
    navigate(`/menu/${newCategory.toLowerCase()}`);
  };

  const normalizeCategory = (category) => {
    if (!category) return '';
    return category
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  const filteredItems = items.filter(item => {
    if (!item?.categorie) {
      console.log('Item without category:', item);
      return false;
    }
    
    const normalizedItemCategory = normalizeCategory(item.categorie);
    const normalizedActiveCategory = normalizeCategory(activeCategory);
    
    console.log('Filtering item:', {
      itemCategory: item.categorie,
      normalizedItemCategory,
      activeCategory,
      normalizedActiveCategory,
      matches: normalizedItemCategory === normalizedActiveCategory
    });
    
    return normalizedItemCategory === normalizedActiveCategory;
  });

  console.log('Filtered items:', filteredItems);

  const handleItemAdded = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleItemUpdated = (updatedItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  const handleItemDeleted = (deletedItemId) => {
    setItems(prevItems => prevItems.filter(item => item._id !== deletedItemId));
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-[#C25E37] text-2xl font-bold text-center">Fest!</h1>
          <p className="text-gray-500 text-center">Pro</p>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`py-4 px-1 relative ${
                  normalizeCategory(activeCategory) === normalizeCategory(cat)
                    ? 'text-[#1B4332] font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                } whitespace-nowrap`}
              >
                {cat}
                {normalizeCategory(activeCategory) === normalizeCategory(cat) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4332]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden relative"
            >
              {item.image_url && (
                <div className="relative h-48">
                  <img 
                    src={item.image_url} 
                    alt={item.nom}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-[#1B4332]">{item.nom}</h3>
                    <span className="text-lg font-medium">{parseFloat(item.prix).toFixed(2)}€</span>
                  </div>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleEditClick(item)}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <span className="material-icons text-[#1B4332]">edit</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Button */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-3 bg-[#1B4332] text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-[#1B4332]/90"
        >
          <span className="material-icons">add_circle</span>
          <span>Ajouter un élément</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <a href="/" className="flex flex-col items-center text-gray-400">
            <span className="material-icons">home</span>
            <span className="text-xs">Homepage</span>
          </a>
          <a href="/menu" className="flex flex-col items-center text-[#1B4332]">
            <span className="material-icons">menu_book</span>
            <span className="text-xs">Menu</span>
          </a>
          <a href="/restaurant" className="flex flex-col items-center text-gray-400">
            <span className="material-icons">store</span>
            <span className="text-xs">Mon Restaurant</span>
          </a>
        </div>
      </nav>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onItemAdded={handleItemAdded}
      />

      {/* Edit Item Modal */}
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onItemUpdated={handleItemUpdated}
        onItemDeleted={handleItemDeleted}
      />
    </div>
  );
}

export default Menu; 