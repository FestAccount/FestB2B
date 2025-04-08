const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances de tri
menuItemSchema.index({ categorie: 1, nom: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema, 'menuitems'); 