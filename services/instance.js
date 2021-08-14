const axios = require("axios");
const request = require("superagent");
const superagent = require("superagent");
const options = require("./options");

const getMovieEvents = async () => {
  const response = await superagent
    .get("https://data.cityofchicago.org/resource/muku-wupu.json")
    .then((apiData) => JSON.parse(apiData.text));

  const movieEvents = await response.map((event) => {
    console.log(event.title, "event title");
    if (event.title !== undefined) return event;
  });

  movies = movieEvents.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  let index = 0;
  let newCollection = [];

  for (let j = 0; j < movies.length - 1; j++) {
    // take each movie event and compare to next element
    let current = movies[index];
    let nextElement = movies[j + 1];
    let { date } = current;
    let isEqual = current.title === nextElement.title;

    if (isEqual) {
      current.date = [...date, ...nextElement.date];
    } else {
      newCollection.push(movies[index]);
      index = j + 1;
    }
  }
  return newCollection;
};

const filterHelper = (movieTitle, data) => {
  for (let item of data) {
    let regex = new RegExp("^" + movieTitle, "i");
    let contains = regex.test(item.title);

    if (contains) {
      let id = item.id.replace("/title/", "");
      return id;
    }
  }
  return null;
};

// Making a request to IMDB && send back movie object to MOVIE CONTROLLER
const getMovieDetails = async (movieEvent) => {
  let details = {};

  const promise = new Promise((resolve, reject) => {
    timerId = setTimeout(async () => {
      options.movie_id.params = { q: movieEvent.title };

      await axios.request(options.movie_id).then(async ({ data }) => {
        let movieId = filterHelper(movieEvent.title, data.results);

        if (movieId) {
          options.details.params = { tconst: movieId };
          //get overview details
          await axios.request(options.details).then(({ data }) => {
            // save overview details {}
            Object.assign(details, data);
          });

          // set params for call
          options.mv_images.params = { tconst: movieId };
          // get images
          await axios.request(options.mv_images).then(({ data }) => {
            //save it
            if (data.totalImageCount > 0) {
              details.images = data.images.map((item) => item.url);
            } else details.images = [];
          });

          options.top_cast.params = { tconst: movieId };
          await axios.request(options.top_cast).then(({ data }) => {
            details.cast_ids = data;
          });
          resolve(details);
        } else resolve({});
      });
    }, 1500);
  });
  return promise;
};

module.exports = { getMovieEvents, getMovieDetails };
