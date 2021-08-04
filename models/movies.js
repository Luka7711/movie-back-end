const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  date: String,
  address: String,
  day: String,
  lat: Number,
  lng: Number,
  park: String,
  parkphone: String,
  plot: String,
  posterURL: String,
  cast: [],
  moviePhotoColl: [],
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
