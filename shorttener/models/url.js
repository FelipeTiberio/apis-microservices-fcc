const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const Url = new mongoose.Schema({
    original_url  : { type: String, required : true },
    short_url     : { type: Number, unique   : true, default: 0 } 
});

autoIncrement.initialize(mongoose.connection);
Url.plugin(autoIncrement.plugin, {
    model : 'Url',
    field : 'short_url', 
    startAt: 0,
    incrementBy: 1
});

module.exports = mongoose.model('Url', Url);

