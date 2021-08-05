const axios = require("axios");

const getMovieId = {
  url: "https://imdb8.p.rapidapi.com/auto-complete",
  headers: {
    "x-rapidapi-key": "20a16b11demsh01d177a853c4fa0p1f60c3jsnf03f5408c9ed",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },

  params: {
    q: "Bee",
  },
  method: "GET",
};

module.exports = getMovieId;
