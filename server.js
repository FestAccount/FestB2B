const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Liste des origines autorisées
const allowedOrigins = [
  'https://festb2b.netlify.app',
  'http://localhost:3000'
];

// Configuration CORS personnalisée
const corsOptions = {
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (comme les appels API directs)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS - Origin: ' + origin + ' non autorisée'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Appliquer CORS avec les options personnalisées
app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB Atlas'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Import des modèles
const MenuItem = require('./models/MenuItem');
const Restaurant = require('./models/Restaurant');

// Gestionnaire d'erreurs CORS
app.use((err, req, res, next) => {
  if (err.message.includes('Non autorisé par CORS')) {
    res.status(403).json({
      error: 'Accès refusé',
      message: 'Cette origine n\'est pas autorisée à accéder à l\'API',
      origin: req.headers.origin,
      allowedOrigins: allowedOrigins
    });
  } else {
    next(err);
  }
});

// Routes de l'API
const router = express.Router();

// Route de test
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API opérationnelle' });
});

// Route pour les menus - maintenant avec MongoDB
router.get('/menu', async (req, res) => {
  try {
    // Récupérer tous les items du menu, triés par catégorie puis par nom
    const menuItems = await MenuItem.find({ disponible: true })
      .sort({ categorie: 1, nom: 1 })
      .select('-__v'); // Exclure le champ __v

    res.json(menuItems);
  } catch (error) {
    console.error('Erreur lors de la récupération des items du menu:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les items du menu'
    });
  }
});

// Route pour ajouter un nouvel élément au menu
router.post('/menu', async (req, res) => {
  try {
    const menuItemData = req.body;
    
    // Créer le nouvel élément
    const newMenuItem = new MenuItem(menuItemData);
    
    // Sauvegarder dans la base de données
    const savedMenuItem = await newMenuItem.save();
    
    // Retourner l'élément créé sans le champ __v
    res.status(201).json(savedMenuItem.toObject({ versionKey: false }));
  } catch (error) {
    console.error('Erreur lors de la création de l\'élément du menu:', error);
    
    // Si l'erreur est une erreur de validation Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Erreur de validation',
        message: 'Les données fournies sont invalides',
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de créer l\'élément du menu'
    });
  }
});

// Route pour mettre à jour un élément du menu
router.put('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedMenuItem) {
      return res.status(404).json({
        error: 'Non trouvé',
        message: 'Élément du menu non trouvé'
      });
    }

    res.json(updatedMenuItem);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'élément du menu:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour l\'élément du menu'
    });
  }
});

// Route pour les restaurants - maintenant avec MongoDB
router.get('/restaurant', async (req, res) => {
  try {
    // Récupérer tous les restaurants, triés par nom
    const restaurants = await Restaurant.find()
      .sort({ name: 1 })
      .select('-__v'); // Exclure le champ __v

    res.json(restaurants);
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les restaurants'
    });
  }
});

// Route pour mettre à jour un restaurant
router.put('/restaurant/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedRestaurant) {
      return res.status(404).json({
        error: 'Non trouvé',
        message: 'Restaurant non trouvé'
      });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du restaurant:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour le restaurant'
    });
  }
});

// Monter les routes sous /api
app.use('/api', router);

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erreur serveur',
    message: 'Une erreur inattendue s\'est produite'
  });
});

// Port d'écoute
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log('Origines autorisées:', allowedOrigins);
}); 