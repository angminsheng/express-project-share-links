const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const likeSchema = new Schema({
  _link: {
    type: Schema.Types.ObjectId,
    ref: 'Link'
  },
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
