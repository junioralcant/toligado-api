const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// methods staticus
UserSchema.statics = {
  //craia um token para o usuário
  generateToken({ id }) {
    return jwt.sign({ id }, 'apptoligado', {
      expiresIn: 30 * 24 * 60 * 60 * 1000, // um período para que esse token inspire
    });
  },
};

module.exports = mongoose.model('User', UserSchema);
