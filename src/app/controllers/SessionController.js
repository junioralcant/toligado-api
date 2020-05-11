const User = require("../models/User");

class SessionController {
  async store(req, resp) {
    const { cpf, password } = req.body;

    const user = await User.findOne({ cpf });
    if (!user) {
      return resp.status(400).json({ error: "Usuario não encontrado" });
    }

    if (!(await user.compareHash(password))) {
      return resp.status(400).json({ error: "Senha inválida" });
    }

    return resp.json({ user, token: User.generateToken(user) });
  }
}

module.exports = new SessionController();
