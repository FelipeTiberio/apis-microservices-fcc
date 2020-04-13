const mongoose = require('mongoose');

const Exercise = new mongoose.Schema( {
    description : String,
    duration    : Number,
    date        : Date,
    userId      : String
});

module.exports = mongoose.model('Exercise', Exercise);