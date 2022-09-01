const User = require('../models/User');
const Admin = require('../models/Admin');

class SessionController {
  async store(req, resp) {
    const { cpf, email, password } = req.body;

    if (!email) {
      const user = await User.findOne({ cpf });

      if (user) {
        if (user.blockedUser) {
          return resp
            .status(400)
            .json({ error: 'Usuário bloqueado!' });
        }
      }

      if (!user) {
        return resp
          .status(400)
          .json({ error: 'Usuario não encontrado' });
      }

      return resp.json({ user, token: User.generateToken(user) });
    } else {
      const admin = await Admin.findOne({ email });

      if (!admin) {
        return resp
          .status(400)
          .json({ error: 'Usuario não encontrado' });
      }

      if (!(await admin.compareHash(password))) {
        return resp
          .status(400)
          .json({ error: 'Usuario não encontrado' });
      }

      return resp.json({ admin, token: Admin.generateToken(Admin) });
    }
  }
}

module.exports = new SessionController();
