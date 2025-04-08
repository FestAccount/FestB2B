const mongoose = require('mongoose');
require('dotenv').config();

// Supprimer l'avertissement de dépréciation
mongoose.set('strictQuery', false);

// IMPORTANT: L'URI MongoDB doit être identique dans tous les fichiers .env:
// 1. .env principal à la racine
// 2. functions/.env
// 3. functions/.env.production
const uri = process.env.MONGODB_URI;
console.log('Tentative de connexion à MongoDB avec l\'URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

// Options de connexion
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    retryWrites: true,
    w: 'majority',
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000
};

// Événements de connexion
mongoose.connection.on('connecting', () => {
    console.log('Tentative de connexion à MongoDB...');
});

mongoose.connection.on('connected', () => {
    console.log('Connecté à MongoDB avec succès');
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    console.log('Database:', mongoose.connection.name);
});

mongoose.connection.on('error', (err) => {
    console.error('Erreur de connexion MongoDB:', err);
    console.error('Détails de l\'erreur:', {
        name: err.name,
        message: err.message,
        code: err.code,
        codeName: err.codeName
    });
});

mongoose.connection.on('disconnected', () => {
    console.log('Déconnecté de MongoDB');
});

// Tentative de connexion
mongoose.connect(uri, options)
    .then(() => {
        console.log('Connexion MongoDB établie');
        console.log('État de la connexion:', mongoose.connection.readyState);
        console.log('Base de données:', mongoose.connection.db.databaseName);
    })
    .catch(err => {
        console.error('Erreur détaillée de connexion à MongoDB:');
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        console.error('Stack:', err.stack);
        process.exit(1);
    });

module.exports = mongoose; 