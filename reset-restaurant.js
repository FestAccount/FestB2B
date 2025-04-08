// Script pour réinitialiser complètement les données du restaurant
require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

// URI de connexion à MongoDB
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

async function resetRestaurant() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(uri, {
      dbName: dbName
    });
    console.log('Connecté à MongoDB');
    
    // Supprimer tous les documents de la collection Restaurant
    console.log('Suppression de tous les restaurants...');
    await Restaurant.deleteMany({});
    console.log('Tous les restaurants ont été supprimés');
    
    // Créer un nouveau restaurant avec les données correctes
    const newRestaurant = new Restaurant({
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
    });
    
    // Sauvegarder le nouveau restaurant
    console.log('Création d\'un nouveau restaurant...');
    const savedRestaurant = await newRestaurant.save();
    console.log('Nouveau restaurant créé avec succès:');
    console.log(JSON.stringify(savedRestaurant, null, 2));
    
    console.log('Réinitialisation terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du restaurant:', error);
  } finally {
    // Fermer la connexion à MongoDB
    mongoose.connection.close();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter la fonction
resetRestaurant(); 