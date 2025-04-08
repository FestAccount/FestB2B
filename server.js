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

// Import du modèle MenuItem
const MenuItem = require('./models/MenuItem');

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

// Route pour les restaurants
router.get('/restaurant', (req, res) => {
  // TODO: Implémenter la logique de récupération des restaurants depuis la base de données
  res.json([
    {
      _id: '1',
      nom: 'Restaurant Test',
      description: 'Description du restaurant test',
      adresse: 'Adresse test',
      cuisine: ['Français']
    }
  ]);
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