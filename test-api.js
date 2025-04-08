// Test script for API endpoints
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:3002/api';

// Fonction pour tester l'endpoint GET /restaurant
async function testGetRestaurant() {
  try {
    console.log('Test GET /restaurant');
    const response = await axios.get(`${API_URL}/restaurant`);
    console.log('Statut:', response.status);
    console.log('Données reçues:', JSON.stringify(response.data, null, 2).substring(0, 300) + '...');
    return true;
  } catch (error) {
    console.error('Erreur lors du test GET /restaurant:', error.message);
    if (error.response) {
      console.error('Statut:', error.response.status);
      console.error('Données:', error.response.data);
    }
    return false;
  }
}

// Fonction pour tester l'endpoint PUT /restaurant
async function testPutRestaurant() {
  try {
    console.log('\nTest PUT /restaurant');
    
    // D'abord, récupérer les données actuelles
    const getResponse = await axios.get(`${API_URL}/restaurant`);
    const currentData = getResponse.data;
    
    // Préparer les données à mettre à jour
    const updateData = {
      ...currentData,
      nom: "Le Fest Test",
      description: "Description mise à jour pour test",
      horaires: {
        midi: currentData.horaires?.midi || "12h00 - 14h30",
        soir: currentData.horaires?.soir || "19h00 - 22h30"
      },
      capacite: {
        midi: parseInt(currentData.capacite?.midi || 45, 10),
        soir: parseInt(currentData.capacite?.soir || 60, 10)
      }
    };
    
    // Supprimer les champs qui ne doivent pas être envoyés
    delete updateData._id;
    delete updateData.__v;
    delete updateData.created_at;
    delete updateData.updated_at;
    
    console.log('Données à envoyer:', JSON.stringify(updateData, null, 2).substring(0, 300) + '...');
    
    // Envoyer la requête PUT
    const putResponse = await axios.put(`${API_URL}/restaurant`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Statut:', putResponse.status);
    console.log('Données reçues:', JSON.stringify(putResponse.data, null, 2).substring(0, 300) + '...');
    return true;
  } catch (error) {
    console.error('Erreur lors du test PUT /restaurant:', error.message);
    if (error.response) {
      console.error('Statut:', error.response.status);
      console.error('Données:', error.response.data);
    }
    return false;
  }
}

// Fonction pour tester l'endpoint GET /menu
async function testGetMenu() {
  try {
    console.log('\nTest GET /menu');
    const response = await axios.get(`${API_URL}/menu`);
    console.log('Statut:', response.status);
    console.log('Nombre d\'éléments:', response.data.length);
    if (response.data.length > 0) {
      console.log('Premier élément:', JSON.stringify(response.data[0], null, 2));
    }
    return true;
  } catch (error) {
    console.error('Erreur lors du test GET /menu:', error.message);
    if (error.response) {
      console.error('Statut:', error.response.status);
      console.error('Données:', error.response.data);
    }
    return false;
  }
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('=== DÉBUT DES TESTS ===');
  
  const testResults = {
    getRestaurant: await testGetRestaurant(),
    putRestaurant: await testPutRestaurant(),
    getMenu: await testGetMenu()
  };
  
  console.log('\n=== RÉSULTATS DES TESTS ===');
  Object.entries(testResults).forEach(([test, result]) => {
    console.log(`${test}: ${result ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
  });
  
  const success = Object.values(testResults).every(result => result);
  console.log(`\n=== RÉSULTAT GLOBAL: ${success ? '✅ SUCCÈS' : '❌ ÉCHEC'} ===`);
}

// Exécuter les tests
runAllTests(); 