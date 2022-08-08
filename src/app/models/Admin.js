const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

AdminSchema.pre('save', async function (next) {
  // criptografa a senha antes de salvar no bd
  if (!this.isModified('password')) {
    // se pass não foi modificado
    return next();
  }

  this.password = await bcrypt.hash(this.password, 4);
});

// cria um method comparar a senha informada pelo usuario com a senha cryptografada do bd
AdminSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },
};

// methods staticus
AdminSchema.statics = {
  //craia um token para o usuário
  generateToken({ id }) {
    return jwt.sign({ id }, 'apptoligado', {
      expiresIn: 30 * 24 * 60 * 60 * 1000, // um período para que esse token inspire, // um período para que esse token inspire
    });
  },
};

module.exports = mongoose.model('Admin', AdminSchema);
