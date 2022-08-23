const User = require('../models/User');

class UserController {
  async index(req, res) {
    const users = await User.find().populate('belongsCompany');

    return res.json(users);
  }

  async store(req, res) {
    const UserExists = await User.findOne({ cpf: req.body.cpf });
    if (UserExists) {
      return res.status(400).json({ error: 'CPF já existente.' });
    }
    const user = await User.create(req.body);

    return res.json(user);
  }

  async show(req, res) {
    const user = await User.findById(req.params.id);

    return res.json(user);
  }

  async update(req, res) {
    const { id } = req.params;

    const user = await User.findById(id);

    await user.update(req.body, { new: true });

    return res.json(user);
  }

  async destroy(req, res) {
    await User.findOneAndDelete(req.params.id);

    return res.json();
  }
}

module.exports = new UserController();
