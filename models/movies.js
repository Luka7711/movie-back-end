const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  event: {
    title: String,
    date: String,
    address: String,
    cordinates: String,
    park: String,
  },
  details: {},
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
