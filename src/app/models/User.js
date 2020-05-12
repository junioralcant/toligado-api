const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  provider: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  // criptografa a senha antes de salvar no bd
  if (!this.isModified("password")) {
    // se pass não foi modificado
    return next();
  }

  this.password = await bcrypt.hash(this.password, 4);
});

// cria um method comparar a senha informada pelo usuario com a senha cryptografada do bd
UserSchema.methods = {
  compareHash(password) {
    return bcrypt.compare(password, this.password);
  },
};

// methods staticus
UserSchema.statics = {
  //craia um token para o usuário
  generateToken({ id }) {
    return jwt.sign({ id }, "apptoligado", {
      expiresIn: 86400, // um período para que esse token inspire
    });
  },
};

module.exports = mongoose.model("User", UserSchema);
