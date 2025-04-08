const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    adresse: {
        type: String
    },
    telephone: {
        type: String
    },
    email: {
        type: String
    },
    horaires: {
        midi: String,
        soir: String
    },
    capacite: {
        midi: Number,
        soir: Number
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

module.exports = mongoose.model('Restaurant', restaurantSchema); 