const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    prix: {
        type: Number,
        required: true
    },
    categorie: {
        type: String,
        required: true,
        enum: ['Entrées', 'Plats', 'Desserts', 'Boissons']
    },
    disponible: {
        type: Boolean,
        default: true
    },
    image_url: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('MenuItem', menuItemSchema); 