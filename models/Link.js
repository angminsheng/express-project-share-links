const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const linkSchema = new Schema({
  url: {
    type: String,
    match: /^https?\:\/\// // Must start by "http://" or "https://"
  },
  _owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: null, // no field 'updatedAt'
  }
});

const Link = mongoose.model('Link', linkSchema);
module.exports = Link;
