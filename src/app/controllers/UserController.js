const User = require("../models/User");

class UserController {
  async index(req, res) {
    const users = await User.find();

    return res.json(users);
  }

  async store(req, res) {
    const UserExists = await User.findOne({ cpf: req.body.cpf });
    if (UserExists) {
      return res.status(400).json({ error: "CPF já existente." });
    }
    const user = await User.create(req.body);

    return res.json(user);
  }

  async show(req, res) {
    const user = await User.findById(req.params.id);

    return res.json(user);
  }

  async update(req, res) {
    const { cpf, password } = req.body;

    const user = await User.findById(req.userId); // busca o usuário pela PK

    if (cpf != user.cpf) {
      const userExists = await User.findOne({ where: { cpf } }); // verifica se o cpf informado já existe no bd

      if (userExists) {
        return res.status(400).json({ error: "CPF não encontrado." });
      }
    }

    if (password && !(await user.checkPassword(password))) {
      return res.status(401).json({
        error: "A senha informada não corresponde com a antiga senha",
      });
    }
    await user.update(req.body, { new: true });

    return res.json(user);
  }

  async destroy(req, res) {
    await User.findOneAndDelete(req.params.id);

    return res.json();
  }
}

module.exports = new UserController();
