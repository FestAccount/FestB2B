const express = require('express');
const cors = require('cors');
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

// Route pour les menus
router.get('/menu', (req, res) => {
  // TODO: Implémenter la logique de récupération des menus depuis la base de données
  res.json([
    {
      _id: '1',
      nom: 'Menu Test',
      description: 'Description du menu test',
      prix: 25.00,
      type: 'plat'
    }
  ]);
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

// Port d'écoute
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log('Origines autorisées:', allowedOrigins);
}); 