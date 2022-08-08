const mongoose = require('mongoose');

const Company = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    required: true,
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', Company);
