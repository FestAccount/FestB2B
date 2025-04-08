import axios from 'axios';

const API_URL = 'https://fest-b2b-backend.onrender.com/api';

// Configuration d'axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Données des restaurants
const restaurants = [
  {
    nom: "Le Bistrot Parisien",
    description: "Une cuisine française authentique dans un cadre chaleureux et convivial.",
    adresse: "23 rue du Commerce, 75015 Paris",
    midi: 40,
    soir: 50,
    cuisine: ["Français", "Traditionnel"],
    email: "contact@bistrotparisien.fr",
    horaires: {
      midi: "12:00 - 14:30",
      soir: "19:00 - 22:30"
    },
    imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8",
    priceRange: "medium",
    rating: 4.5,
    telephone: "0145678910"
  },
  {
    nom: "L'Italien",
    description: "Une authentique trattoria italienne où les pâtes sont faites maison.",
    adresse: "45 avenue des Ternes, 75017 Paris",
    midi: 35,
    soir: 45,
    cuisine: ["Italien", "Pizza", "Pâtes"],
    email: "contact@litalien.fr",
    horaires: {
      midi: "12:00 - 15:00",
      soir: "18:30 - 23:00"
    },
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    priceRange: "medium",
    rating: 4.6,
    telephone: "0144556677"
  },
  {
    nom: "Le Jardin Secret",
    description: "Un havre de paix en plein cœur de la ville avec une cuisine créative.",
    adresse: "12 rue des Jardins, 75004 Paris",
    midi: 30,
    soir: 40,
    cuisine: ["Moderne", "Créatif", "Bio"],
    email: "contact@jardinsecret.fr",
    horaires: {
      midi: "12:00 - 14:00",
      soir: "19:30 - 22:00"
    },
    imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    priceRange: "high",
    rating: 4.7,
    telephone: "0123456789"
  }
];

// Menus pour chaque restaurant
const generateMenus = (restaurantId) => {
  return [
    {
      restaurantId,
      nom: "Tartare de saumon",
      description: "Saumon frais, avocat, mangue et vinaigrette aux agrumes",
      prix: 14.50,
      type: "entrée",
      imageUrl: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58"
    },
    {
      restaurantId,
      nom: "Foie gras maison",
      description: "Foie gras mi-cuit, chutney de figues et pain brioché",
      prix: 18.90,
      type: "entrée",
      imageUrl: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa"
    },
    {
      restaurantId,
      nom: "Filet de bœuf Rossini",
      description: "Filet de bœuf, foie gras poêlé, sauce aux truffes",
      prix: 34.90,
      type: "plat",
      imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e"
    },
    {
      restaurantId,
      nom: "Saint-Jacques snackées",
      description: "Saint-Jacques, purée de panais, émulsion au safran",
      prix: 29.90,
      type: "plat",
      imageUrl: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8"
    },
    {
      restaurantId,
      nom: "Tarte au citron meringuée",
      description: "Crème de citron, meringue italienne",
      prix: 9.90,
      type: "dessert",
      imageUrl: "https://images.unsplash.com/photo-1628787165828-a0e1221cd89d"
    },
    {
      restaurantId,
      nom: "Moelleux au chocolat",
      description: "Chocolat Valrhona 70%, glace vanille bourbon",
      prix: 11.90,
      type: "dessert",
      imageUrl: "https://images.unsplash.com/photo-1602351447937-745cb720612f"
    }
  ];
};

// Fonction pour insérer les données
const seedData = async () => {
  try {
    console.log('Début de l\'insertion des données...');

    // Insérer les restaurants
    for (const restaurant of restaurants) {
      console.log(`Création du restaurant: ${restaurant.nom}`);
      const restaurantResponse = await api.post('/restaurant', restaurant);
      const restaurantId = restaurantResponse.data._id;
      console.log(`Restaurant créé avec l'ID: ${restaurantId}`);

      // Générer et insérer les menus pour ce restaurant
      const menus = generateMenus(restaurantId);
      for (const menu of menus) {
        console.log(`Création du menu: ${menu.nom} pour le restaurant: ${restaurant.nom}`);
        await api.post('/menu', menu);
      }
    }

    console.log('Insertion des données terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
};

// Exécuter le script
seedData(); 