const Draw = require('../models/Draw');
const DangerRecord = require('../models/DangerRecord');
const moment = require('moment');

class DrawController {
  async index(req, res) {
    const draws = await Draw.paginate(null, {
      limit: 100,
      populate: ['idsDraws.recordId', 'idsDraws.recordId.user'],

      sort: '-createdAt',
    });

    return res.json(draws);
  }

  async store(req, res) {
    const records = await DangerRecord.find();

    var arr1 = [];

    records.map((arr) => {
      if (
        moment(arr.createdAt).month() ===
          moment(Date().now).month() &&
        arr.approved === true &&
        arr.drawn === false &&
        moment(arr.createdAt).year() === moment(Date().now).year()
      ) {
        arr1.push(arr._id); // copy array
      }
    });

    if (arr1.length === 0) {
      return res
        .status(400)
        .json({ error: 'Não há nem um registro para ser sorteado' });
    }

    arr1.sort(function () {
      return 0.5 - Math.random();
    }); // shuffle arrays

    var i = 0;
    var ids = [];

    for (i; i < 1; i++) {
      var idsRecord = arr1.pop(); // get the last value of arr1
      ids.push(idsRecord);
    }

    const draw = await Draw.create({ createAt: Date().now });

    await Promise.all(
      ids.map(async (record) => {
        draw.idsDraws.push({ recordId: record });
      })
    );

    const record = await DangerRecord.findById(ids[0]);

    record.drawn = true;

    await draw.save();
    await record.save();

    return res.json();
  }

  async show(req, res) {
    const draw = await Draw.findById(req.params.id).populate([
      'idsDraws.recordId',
    ]);

    return res.json(draw);
  }

  async destroy(req, res) {
    const draw = await Draw.findById(req.params.id);

    const record = await DangerRecord.findById(
      draw.idsDraws[0].recordId
    );

    record.drawn = false;

    await record.save();

    draw.deleteOne();

    return res.json();
  }
}

module.exports = new DrawController();
