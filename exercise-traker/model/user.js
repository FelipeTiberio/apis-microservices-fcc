const mongoose = require('mongoose');

const User = new mongoose.Schema({
  username: {type: String, required: true},
  count: { type: Number,  default: 0},
  log : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref  : "Exercise"
    }
  ],
});

module.exports = mongoose.model('User', User);
