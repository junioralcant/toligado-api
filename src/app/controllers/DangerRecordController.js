const DangerRecord = require("../models/DangerRecord");
const Image = require("../models/Image");

class DangerRecordController {
  async index(req, res) {
    const dangers = await DangerRecord.paginate(null, {
      populate: ["image"],
      sort: "-createdAt",
    });

    return res.json(dangers);
  }

  async store(req, res) {
    const userLogged = req.userId;

    const { originalname: name, size, key, location: url = "" } = req.file;

    const image = await Image.create({
      name,
      size,
      key,
      url,
    });

    const { location = "", description = "" } = req.body;

    const danger = await DangerRecord.create({
      location,
      description,
      user: userLogged,
      image: image._id,
    });

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
