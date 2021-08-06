const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  date: String,
  address: String,
  cordinates: String,
  park: String,
  plot: String,
  posterURL: String,
  cast: [],
  moviePhotoColl: [],
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
