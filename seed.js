require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

console.log('Connecting to MongoDB for seeding...');
console.log('Database name:', dbName);

// Seed data for menu items
const menuItems = [
  // Entrées
  {
    nom: "Salade César",
    description: "Laitue romaine, croûtons maison, parmesan, sauce césar traditionnelle",
    prix: 12.00,
    categorie: "Entrées",
    image_url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    nom: "Soupe à l'Oignon",
    description: "Oignons caramélisés, bouillon de bœuf, croûtons, gratiné au fromage",
    prix: 10.50,
    categorie: "Entrées",
    image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  // Plats
  {
    nom: "Entrecôte Grillée",
    description: "Entrecôte de bœuf, sauce au poivre, pommes de terre sautées",
    prix: 28.00,
    categorie: "Plats",
    image_url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    nom: "Magret de Canard",
    description: "Magret de canard, sauce au miel, légumes de saison",
    prix: 26.00,
    categorie: "Plats",
    image_url: "https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  // Desserts
  {
    nom: "Tarte Tatin",
    description: "Tarte aux pommes caramélisées servie avec crème fraîche",
    prix: 9.50,
    categorie: "Desserts",
    image_url: "https://images.unsplash.com/photo-1562007908-17c67e878c6c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    nom: "Crème Brûlée",
    description: "Crème pâtissière vanillée et caramélisée",
    prix: 8.00,
    categorie: "Desserts",
    image_url: "https://images.unsplash.com/photo-1625126128700-4fe969115ae1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  // Boissons
  {
    nom: "Vin Rouge Bordeaux",
    description: "Bouteille AOP Bordeaux Supérieur",
    prix: 32.00,
    categorie: "Boissons",
    image_url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    nom: "Eau Minérale",
    description: "Bouteille 75cl plate ou gazeuse",
    prix: 3.50,
    categorie: "Boissons",
    image_url: "https://images.unsplash.com/photo-1565717536890-33b8a212fd3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, { dbName });
    
    console.log('Connected to MongoDB. Starting seed...');
    
    // Delete existing menu items
    const deleted = await MenuItem.deleteMany({});
    console.log(`Deleted ${deleted.deletedCount} existing menu items`);
    
    // Insert new menu items
    const result = await MenuItem.insertMany(menuItems);
    console.log(`Successfully seeded ${result.length} menu items`);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed
seedDatabase(); 