const DangerRecord = require('../models/DangerRecord');
const Image = require('../models/Image');

class ResolvedDangerController {
  async update(req, res) {
    const record = await DangerRecord.findById(req.params.id);

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

    if (record.imageResolved) {
      const image = await Image.findById(record.imageResolved);
      await image.remove();
    }

    record.resolved = true;
    record.imageResolved = image._id;

    await record.save();

    return res.json(record);
  }
}

module.exports = new ResolvedDangerController();
