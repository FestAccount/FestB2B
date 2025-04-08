const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
const MenuItem = require('./models/MenuItem');
const Restaurant = require('./models/Restaurant');

const app = express();
const port = process.env.PORT || 3002;

// Configuration CORS améliorée
app.use(cors({
  origin: '*', // Permettre toutes les origines pour le développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '50mb' })); // Augmenter la limite pour les uploads d'images

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

// Initialisation de Mongoose pour les modèles
mongoose.connect(uri, {
  dbName: dbName
})
.then(() => console.log('Mongoose connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion Mongoose:', err));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
        error: 'Erreur serveur',
        message: err.message
    });
});

// Configuration Unsplash
const UNSPLASH_ACCESS_KEY = '1CgQiDr2_o1zQHDqbkdhCzcwCYvEpcKtlJ65Nl8Kmew';

// Fonction pour obtenir une image Unsplash
async function getUnsplashImage(category) {
    try {
        let searchQuery;
        switch (category) {
            case 'Entrées':
                searchQuery = 'gourmet appetizer french';
                break;
            case 'Plats':
                searchQuery = 'main course dish french restaurant';
                break;
            case 'Desserts':
                searchQuery = 'gourmet dessert french';
                break;
            case 'Boissons':
                searchQuery = 'french wine cocktail';
                break;
            default:
                searchQuery = 'french food';
        }

        const response = await axios.get(`https://api.unsplash.com/photos/random`, {
            params: {
                query: searchQuery,
                orientation: 'landscape'
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        return response.data.urls.regular;
    } catch (error) {
        console.error('Erreur Unsplash:', error.message);
        return null;
    }
}

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Vérification de la configuration Cloudinary
console.log('Configuration Cloudinary :', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Configuré' : 'Non configuré',
  api_key: process.env.CLOUDINARY_API_KEY ? 'Configuré' : 'Non configuré',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Configuré' : 'Non configuré'
});

// Initialiser la base de données si nécessaire
async function initializeDatabase() {
    try {
        // Vérifier et initialiser le menu
        const menuCount = await MenuItem.countDocuments();
        
        if (menuCount === 0) {
            console.log('Aucun élément de menu trouvé. Initialisation de la base de données...');
            // Vous pouvez insérer des données d'exemple ici si nécessaire
            
            // Exemple d'insertion d'un élément de menu
            const demoItem = new MenuItem({
                nom: "Salade César",
                description: "Laitue romaine, croûtons maison, parmesan, sauce césar traditionnelle",
                prix: 12.00,
                categorie: "Entrées",
                image_url: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9"
            });
            
            await demoItem.save();
            console.log('Base de données initialisée avec des données de démonstration.');
        } else {
            console.log(`${menuCount} éléments de menu trouvés dans la base de données.`);
        }
        
        // Vérifier et initialiser les données du restaurant
        const restaurantCount = await Restaurant.countDocuments();
        
        if (restaurantCount === 0) {
            console.log('Aucune information de restaurant trouvée. Initialisation...');
            
            const demoRestaurant = new Restaurant({
                nom: "Le Fest",
                description: "Une expérience gastronomique unique au cœur de la ville.",
                adresse: "123 Avenue de la Gastronomie, 75001 Paris",
                telephone: "01 23 45 67 89",
                email: "contact@lefest.fr",
                horaires: {
                    midi: "12h00 - 14h30",
                    soir: "19h00 - 22h30"
                },
                capacite: {
                    midi: 45,
                    soir: 60
                }
            });
            
            await demoRestaurant.save();
            console.log('Données du restaurant initialisées.');
        } else {
            console.log('Informations du restaurant trouvées dans la base de données.');
        }
    } catch (err) {
        console.error('Erreur lors de l\'initialisation de la base de données:', err);
    }
}

// Routes de l'API
app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    console.log(`${menuItems.length} éléments de menu récupérés`);
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.get('/api/restaurant', async (req, res) => {
  try {
    console.log('GET /api/restaurant: début de la requête');
    
    // Récupérer les données du restaurant depuis la base de données
    const restaurant = await Restaurant.findOne({});
    console.log('Restaurant trouvé dans la BD:', restaurant ? 'Oui' : 'Non');
    
    // Si aucun restaurant n'est trouvé, renvoyer un restaurant par défaut
    if (!restaurant) {
      console.log('Aucun restaurant trouvé, renvoi des données par défaut');
      const defaultRestaurant = {
        nom: "Le Fest",
        description: "Une expérience gastronomique unique au cœur de la ville.",
        adresse: "123 Avenue de la Gastronomie, 75001 Paris",
        telephone: "01 23 45 67 89",
        email: "contact@lefest.fr",
        horaires: {
          midi: "12h00 - 14h30",
          soir: "19h00 - 22h30"
        },
        capacite: {
          midi: 45,
          soir: 60
        },
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
      };
      return res.json(defaultRestaurant);
    }
    
    // Assurez-vous que les structures d'objets horaires et capacite existent
    const restaurantData = restaurant.toObject();
    if (!restaurantData.horaires) restaurantData.horaires = { midi: '', soir: '' };
    if (!restaurantData.capacite) restaurantData.capacite = { midi: 0, soir: 0 };
    
    console.log('Données du restaurant envoyées avec succès');
    res.json(restaurantData);
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération du restaurant:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    });
  }
});

// Nouvelle route PUT pour mettre à jour les informations du restaurant
app.put('/api/restaurant', async (req, res) => {
  try {
    console.log('PUT /api/restaurant - Début de la mise à jour');
    console.log('Données reçues:', JSON.stringify(req.body, null, 2));
    
    const updatedData = req.body;
    
    // Vérifier que les propriétés horaires et capacite sont correctement structurées
    if (!updatedData.horaires) {
      updatedData.horaires = { midi: '', soir: '' };
    } else if (typeof updatedData.horaires !== 'object') {
      updatedData.horaires = { midi: '', soir: '' };
    }
    
    if (!updatedData.capacite) {
      updatedData.capacite = { midi: 0, soir: 0 };
    } else if (typeof updatedData.capacite !== 'object') {
      updatedData.capacite = { midi: 0, soir: 0 };
    }
    
    // S'assurer que les capacités sont des nombres
    if (updatedData.capacite.midi && typeof updatedData.capacite.midi !== 'number') {
      updatedData.capacite.midi = parseInt(updatedData.capacite.midi, 10) || 0;
    }
    
    if (updatedData.capacite.soir && typeof updatedData.capacite.soir !== 'number') {
      updatedData.capacite.soir = parseInt(updatedData.capacite.soir, 10) || 0;
    }
    
    console.log('Données normalisées:', JSON.stringify(updatedData, null, 2));
    
    // Chercher le restaurant existant
    let restaurant = await Restaurant.findOne({});
    
    if (!restaurant) {
      console.log('Aucun restaurant trouvé, création d\'un nouveau');
      restaurant = new Restaurant(updatedData);
    } else {
      console.log('Restaurant trouvé, mise à jour complète');
      
      // Créer un nouvel objet avec uniquement les champs du schéma
      const restaurantData = {
        nom: updatedData.nom || '',
        description: updatedData.description || '',
        adresse: updatedData.adresse || '',
        telephone: updatedData.telephone || '',
        email: updatedData.email || '',
        image_url: updatedData.image_url || '',
        horaires: {
          midi: updatedData.horaires.midi || '',
          soir: updatedData.horaires.soir || ''
        },
        capacite: {
          midi: updatedData.capacite.midi || 0,
          soir: updatedData.capacite.soir || 0
        }
      };
      
      // Mettre à jour le restaurant avec les nouvelles données
      Object.assign(restaurant, restaurantData);
      
      // Supprimer les anciennes propriétés qui ne sont pas dans le schéma
      for (const key in restaurant.toObject()) {
        if (!restaurantData.hasOwnProperty(key) && !['_id', '__v', 'created_at', 'updated_at'].includes(key)) {
          restaurant[key] = undefined;
        }
      }
    }
    
    // Sauvegarder les modifications
    await restaurant.save();
    console.log('Restaurant sauvegardé avec succès');
    
    // Envoyer la réponse avec les données mises à jour
    const responseData = restaurant.toObject();
    console.log('Réponse envoyée:', JSON.stringify(responseData, null, 2));
    res.json(responseData);
  } catch (error) {
    console.error('Erreur détaillée lors de la mise à jour du restaurant:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    });
  }
});

app.post('/api/menu', async (req, res, next) => {
    const { nom, description, prix, categorie, image_url } = req.body;
    
    try {
        let imageUrlToUse = image_url;
        
        // Si pas d'image_url fournie, obtenir une image d'Unsplash
        if (!imageUrlToUse) {
            imageUrlToUse = await getUnsplashImage(categorie);
        }
        
        const menuItem = new MenuItem({
            nom,
            description,
            prix: parseFloat(prix),
            categorie,
            image_url: imageUrlToUse
        });

        const savedItem = await menuItem.save();
        res.json(savedItem);
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'un item:', error);
        next(error);
    }
});

app.put('/api/menu/:id', async (req, res, next) => {
    const { id } = req.params;
    const { nom, description, prix, categorie, image_url } = req.body;

    try {
        let updateData = {
            nom,
            description,
            prix: parseFloat(prix),
            categorie
        };

        // Si une nouvelle image_url est fournie, l'utiliser
        if (image_url) {
            updateData.image_url = image_url;
        }
        // Sinon, si la catégorie a changé, obtenir une nouvelle image
        else {
            const currentItem = await MenuItem.findById(id);
            if (currentItem && currentItem.categorie !== categorie) {
                const newImageUrl = await getUnsplashImage(categorie);
                if (newImageUrl) {
                    updateData.image_url = newImageUrl;
                }
            }
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item non trouvé' });
        }

        res.json(updatedItem);
    } catch (err) {
        next(err);
    }
});

app.delete('/api/menu/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item non trouvé' });
        }
        res.json({ message: 'Item supprimé avec succès' });
    } catch (err) {
        next(err);
    }
});

// Endpoint de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Route pour uploader une image
app.post('/api/upload-image', async (req, res) => {
  try {
    console.log('POST /api/upload-image - Début de l\'upload');
    const { image } = req.body;
    
    if (!image) {
      console.log('Aucune image fournie');
      return res.status(400).json({ error: 'Aucune image fournie' });
    }
    
    // Vérifier que l'image est au format base64
    if (!image.startsWith('data:image')) {
      console.log('Format d\'image non valide');
      return res.status(400).json({ error: 'Format d\'image non valide. Doit être une chaîne base64' });
    }
    
    console.log('Upload de l\'image vers Cloudinary...');
    // Upload l'image à Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        image,
        {
          folder: 'fest-restaurant',
          transformation: [
            { width: 1000, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.log('Erreur lors de l\'upload Cloudinary:', error);
            reject(error);
          } else {
            console.log('Upload Cloudinary réussi');
            resolve(result);
          }
        }
      );
    });
    
    console.log('Image uploadée avec succès:', result.secure_url);
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('Erreur détaillée lors de l\'upload d\'image:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Erreur lors de l\'upload de l\'image', 
      message: error.message,
      stack: error.stack 
    });
  }
});

// Démarrer le serveur et initialiser la base de données
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API is available at http://localhost:${port}/api`);
  
  // Initialiser la base de données après démarrage du serveur
  await initializeDatabase();
}); 