const Draw = require("../models/Draw");
const DangerRecord = require("../models/DangerRecord");
const moment = require("moment");

class DrawController {
  async index(req, res) {
    const draws = await Draw.paginate(null, {
      limit: 100,
      populate: ["idsDraws.recordId", "idsDraws.recordId.user"],

      sort: "-createdAt",
    });

    return res.json(draws);
  }

  async store(req, res) {
    const records = await DangerRecord.find();

    var arr1 = [];

    records.map((arr) => {
      if (moment(arr.createdAt).month() === moment(Date().now).month()) {
        arr1.push(arr._id); // copy array
      }
    });

    arr1.sort(function () {
      return 0.5 - Math.random();
    }); // shuffle arrays

    var i = 0;
    var ids = [];

    for (i; i < 3; i++) {
      var idsRecord = arr1.pop(); // get the last value of arr1
      ids.push(idsRecord);
    }

    const draw = await Draw.create({ createAt: Date().now });

    await Promise.all(
      ids.map(async (record) => {
        draw.idsDraws.push({ recordId: record });
      })
    );

    await draw.save();

    return res.json();
  }

  async show(req, res) {
    const draw = await Draw.findById(req.params.id).populate([
      "idsDraws.recordId",
    ]);

    return res.json(draw);
  }

  async destroy(req, res) {
    await Draw.findOneAndDelete(req.params.id);

    return res.json();
  }
}

module.exports = new DrawController();
