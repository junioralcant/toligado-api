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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', Company);
