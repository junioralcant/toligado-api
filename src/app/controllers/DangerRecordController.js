const DangerRecord = require('../models/DangerRecord');
const Image = require('../models/Image');
const User = require('../models/User');

class DangerRecordController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    if (userLogged) {
      const dangers = await DangerRecord.find({
        user: userLogged._id,
      })
        .populate('image')
        .populate('imageResolved')
        .sort('-createdAt');

      return res.json(dangers);
    }

    const dangers = await DangerRecord.paginate(null, {
      limit: 100,
      populate: ['image', 'user', 'imageResolved'],
      sort: '-createdAt',
    });

    return res.json(dangers);
  }

  async store(req, res) {
    const userLogged = req.userId;

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
    const danger = await DangerRecord.findById(req.params.id);

    return res.json(danger);
  }

  async updade(req, res) {
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
    const danger = await DangerRecord.findById(req.params.id);
    const { image: imageId } = danger;

    const image = await Image.findById(imageId);

    await image.remove();

    await DangerRecord.findByIdAndRemove(req.params.id);

    res.send();
  }
}

module.exports = new DangerRecordController();
