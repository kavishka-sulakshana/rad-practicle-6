const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  caption: String,
  imgname: String,
});

const Photos = mongoose.model('photo',photoSchema);

module.exports = Photos;