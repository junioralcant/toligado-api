const mongoose = require("mongoose");
const mongoosePagiante = require("mongoose-paginate");

const DangerRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
  location: {
    type: String,
  },

  description: {
    type: String,
  },

  analyzed: {
    type: Boolean,
    required: true,
    default: false,
  },

  approved: {
    type: Boolean,
    required: true,
    default: false,
  },

  disapproved: {
    type: Boolean,
    required: true,
    default: false,
  },

  disapprovedReason: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DangerRecordSchema.plugin(mongoosePagiante);
module.exports = mongoose.model("DangerRecord", DangerRecordSchema);
