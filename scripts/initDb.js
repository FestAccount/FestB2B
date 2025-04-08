require('dotenv').config();
const { MongoClient } = require('mongodb');

async function initializeDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000
    });

    try {
        // Connexion à MongoDB
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Successfully connected to MongoDB.');

        // Obtention de la référence à la base de données
        const db = client.db('festpro');

        // Création des collections
        console.log('Creating collections...');
        const categories = db.collection('categories');
        const menuItems = db.collection('menu_items');

        // Nettoyage des données existantes
        console.log('Cleaning existing data...');
        await Promise.all([
            categories.deleteMany({}),
            menuItems.deleteMany({})
        ]);

        // Préparation des données
        const categoriesData = [
            { nom: 'Entrées', ordre: 1, active: true },
            { nom: 'Plats', ordre: 2, active: true },
            { nom: 'Desserts', ordre: 3, active: true },
            { nom: 'Boissons', ordre: 4, active: true }
        ];

        const menuItemsData = [
            {
                nom: 'Salade César',
                description: 'Laitue romaine, croûtons, parmesan, sauce césar maison',
                prix: 8.50,
                categorie: 'Entrées',
                disponible: true
            },
            {
                nom: 'Soupe à l\'oignon',
                description: 'Oignons caramélisés, bouillon de bœuf, croûtons, fromage gratiné',
                prix: 7.00,
                categorie: 'Entrées',
                disponible: true
            },
            {
                nom: 'Steak Frites',
                description: 'Entrecôte grillée, frites maison, sauce au poivre',
                prix: 22.00,
                categorie: 'Plats',
                disponible: true
            },
            {
                nom: 'Saumon grillé',
                description: 'Filet de saumon, légumes de saison, sauce hollandaise',
                prix: 24.00,
                categorie: 'Plats',
                disponible: true
            }
        ];

        // Insertion des données
        console.log('Inserting data...');
        const [categoriesResult, menuItemsResult] = await Promise.all([
            categories.insertMany(categoriesData),
            menuItems.insertMany(menuItemsData)
        ]);

        console.log(`Inserted ${categoriesResult.insertedCount} categories`);
        console.log(`Inserted ${menuItemsResult.insertedCount} menu items`);

        // Création des index
        console.log('Creating indexes...');
        await Promise.all([
            categories.createIndex({ nom: 1 }, { unique: true }),
            menuItems.createIndex({ categorie: 1 }),
            menuItems.createIndex({ nom: 1 })
        ]);

        console.log('Database initialization completed successfully');
    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        // Fermeture de la connexion
        await client.close();
        console.log('Database connection closed');
    }
}

// Exécution de la fonction d'initialisation
initializeDatabase().catch(console.error); 