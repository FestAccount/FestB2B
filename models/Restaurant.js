const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  description: String,
  cuisine: [String],
  address: String,
  rating: Number,
  priceRange: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  imageUrl: String,
  adresse: String,
  capacite: {
    midi: Number,
    soir: Number
  },
  email: {
    type: String,
    required: true
  },
  horaires: {
    midi: String,
    soir: String
  },
  nom: String,
  telephone: String
}, {
  timestamps: true
});

// Index pour améliorer les performances de tri
restaurantSchema.index({ name: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema, 'restaurants'); 