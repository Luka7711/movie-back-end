const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  event: {},
  details: {},
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
