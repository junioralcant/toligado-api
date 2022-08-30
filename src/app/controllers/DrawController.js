const Draw = require('../models/Draw');
const DangerRecord = require('../models/DangerRecord');
const moment = require('moment');
const User = require('../models/User');

class DrawController {
  async index(req, res) {
    const userLogged = await User.findById(req.userId);

    if (userLogged) {
      if (userLogged.blockedUser) {
        return res.status(400).json({ error: 'Usuário bloqueado!' });
      }
    }

    const { company } = req.query;

    let filtersDraws = [];

    let draws = await Draw.paginate(null, {
      limit: 100000,
      populate: ['idsDraws.recordId ', 'idsDraws.recordId.user'],
      sort: '-createdAt',
    });

    if (company) {
      await Promise.all(
        draws.docs.map(async (draw) => {
          const user = await User.findById(
            draw.idsDraws[0].recordId.user
          );

          if (String(user.belongsCompany) === String(company)) {
            // console.log(draw);
            filtersDraws.push(draw);
            return draw;
          }
        })
      ).finally(() => {
        return res.json(filtersDraws);
      });
    } else {
      return res.json(draws.docs);
    }
  }

  async store(req, res) {
    const { company } = req.query;

    const records = await DangerRecord.find().populate('user');

    var recordsDraw = [];

    records.map((record) => {
      if (
        moment(record.createdAt).month() ===
          moment(Date().now).month() &&
        record.approved === true &&
        record.drawn === false &&
        moment(record.createdAt).year() ===
          moment(Date().now).year() &&
        String(record.user.belongsCompany) === String(company)
      ) {
        recordsDraw.push(record._id); // copy array
      }
    });

    if (recordsDraw.length === 0) {
      return res
        .status(400)
        .json({ error: 'Não há nem um registro para ser sorteado' });
    }

    recordsDraw.sort(function () {
      return 0.5 - Math.random();
    }); // shuffle arrays

    var i = 0;
    var ids = [];

    for (i; i < 1; i++) {
      var idsRecord = recordsDraw.pop(); // get the last value of recordsDraw
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
