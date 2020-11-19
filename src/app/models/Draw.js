const mongoose = require("mongoose");
const mongoosePagiante = require("mongoose-paginate");

const Draw = new mongoose.Schema({
  idsDraws: [
    {
      recordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DangerRecord",
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

Draw.plugin(mongoosePagiante);
module.exports = mongoose.model("Draw", Draw);
