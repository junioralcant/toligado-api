const DangerRecord = require('../models/DangerRecord');
const Image = require('../models/Image');
const User = require('../models/User');
const moment = require('moment');
class DangerRecordController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    if (userLogged) {
      if (userLogged.blockedUser) {
        return res.status(400).json({ error: 'Usuário bloqueado!' });
      }
    }

    const { initialDate, finalDate, company } = req.query;

    const filters = {};

    if (userLogged) {
      const dangers = await DangerRecord.find({
        user: userLogged._id,
      })
        .populate('image')
        .populate('imageResolved')
        .sort('-createdAt');

      return res.json(dangers);
    }

    if (initialDate && finalDate) {
      filters.createdAt = {};

      const initial = moment(initialDate).format(
        'YYYY-MM-DDT00:mm:ss.SSSZ'
      );

      const final = moment(finalDate).format(
        'YYYY-MM-DDT23:59:ss.SSSZ'
      );

      filters.createdAt.$gte = initial;
      filters.createdAt.$lte = final;
    }

    let dangers = await DangerRecord.paginate(filters, {
      limit: 1000000000,
      populate: ['image', 'imageResolved', 'user'],

      sort: '-createdAt',
    });

    // Filtra por dados do mes e ano atual
    if (!initialDate || !finalDate) {
      dangers = dangers.docs.filter(
        (danger) =>
          moment(danger.createdAt).month() ===
            moment(Date.now()).month() &&
          moment(danger.createdAt).year() ===
            moment(Date.now()).year()
      );

      if (company) {
        dangers = dangers.filter(
          (danger) =>
            String(danger.user.belongsCompany) === String(company)
        );
      }

      return res.json(dangers);
    }

    if (company) {
      dangers = dangers.docs.filter(
        (danger) =>
          String(danger.user.belongsCompany) === String(company)
      );

      return res.json(dangers);
    }

    return res.json(dangers.docs);
  }

  async store(req, res) {
    const userLogged = await User.findById(req.userId);

    if (userLogged) {
      if (userLogged.blockedUser) {
        return res.status(400).json({ error: 'Usuário bloqueado!' });
      }
    }
    const {
      originalname: name,
      size,
      key,
      location: url = '',
    } = req.file;

    const image = await Image.create({
      name,
      size,
      key,
      url,
    });

    const { location = '', description = '' } = req.body;

    const danger = await DangerRecord.create({
      location,
      description,
      user: userLogged,
      image: image._id,
    });

    req.io.emit('newRecord', {
      message: 'New record.',
    });

    return res.json(danger);
  }

  async show(req, res) {
    const userLogged = await User.findById(req.userId);

    if (userLogged) {
      if (userLogged.blockedUser) {
        return res.status(400).json({ error: 'Usuário bloqueado!' });
      }
    }

    const danger = await DangerRecord.findById(req.params.id);

    return res.json(danger);
  }

  async updade(req, res) {
    const userLogged = await User.findById(req.userId);

    if (userLogged) {
      if (userLogged.blockedUser) {
        return res.status(400).json({ error: 'Usuário bloqueado!' });
      }
    }

    const { id } = req.params;

    const danger = await DangerRecord.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    return res.json(danger);
  }

  async destroy(req, res) {
    const userLogged = await User.findById(req.userId);

    if (userLogged) {
      if (userLogged.blockedUser) {
        return res.status(400).json({ error: 'Usuário bloqueado!' });
      }
    }
    const danger = await DangerRecord.findById(req.params.id);

    const { image: imageId } = danger;

    const image = await Image.findById(imageId);

    await image.remove();

    await DangerRecord.findByIdAndRemove(req.params.id);

    res.send();
  }
}

module.exports = new DangerRecordController();
