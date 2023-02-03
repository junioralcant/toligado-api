const mongoose = require('mongoose');
const mongoosePagiante = require('mongoose-paginate');

const DangerRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true,
  },

  imageResolved: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: false,
  },

  resolved: {
    type: Boolean,
    required: true,
    default: false,
  },

  resolvedNote: {
    type: String,
  },

  resolvedApproved: {
    type: String,
    required: true,
    default: 'ANALYSIS',
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

  disapprovedReasonResolved: {
    type: String,
  },

  drawn: {
    type: Boolean,
    required: true,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DangerRecordSchema.plugin(mongoosePagiante);
module.exports = mongoose.model('DangerRecord', DangerRecordSchema);
