let movie_id = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/title/find",
  headers: {
    "x-rapidapi-key": "20a16b11demsh01d177a853c4fa0p1f60c3jsnf03f5408c9ed",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },
};

module.exports = { movie_id };
