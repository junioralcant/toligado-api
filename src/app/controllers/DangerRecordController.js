const DangerRecord = require("../models/DangerRecord");

class DangerRecordController {
  async index(req, res) {
    const dangers = await DangerRecord.paginate();

    return res.json(dangers);
  }

  async store(req, res) {
    const userLogged = req.userId;
    const { location = "", description = "", url = "" } = req.body;

    const danger = await DangerRecord.create({
      location,
      description,
      url,
      user: userLogged,
    });

    return res.json(danger);
  }

  async destroy(req, res) {
    await DangerRecord.findByIdAndRemove(req.params.id);

    res.send();
  }
}

module.exports = new DangerRecordController();
