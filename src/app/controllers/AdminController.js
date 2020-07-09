const Admin = require("../models/Admin");

class UserController {
  async index(req, res) {
    const users = await Admin.find();

    return res.json(users);
  }

  async store(req, res) {
    const UserExists = await Admin.findOne({ email: req.body.email });
    if (UserExists) {
      return res.status(400).json({ error: "E-mail já existente." });
    }
    const user = await Admin.create(req.body);

    return res.json(user);
  }

  async show(req, res) {
    const user = await Admin.findById(req.params.id);

    return res.json(user);
  }

  async update(req, res) {
    const { email, password } = req.body;

    const user = await Admin.findById(req.userId); // busca o usuário pela PK

    if (email != user.email) {
      const userExists = await Admin.findOne({ where: { email } }); // verifica se o email informado já existe no bd

      if (userExists) {
        return res.status(400).json({ error: "email não encontrado." });
      }
    }

    if (password && !(await Admin.checkPassword(password))) {
      return res.status(401).json({
        error: "A senha informada não corresponde com a antiga senha",
      });
    }
    await Admin.update(req.body, { new: true });

    return res.json(user);
  }

  async destroy(req, res) {
    await Admin.findOneAndDelete(req.params.id);

    return res.json();
  }
}

module.exports = new UserController();
