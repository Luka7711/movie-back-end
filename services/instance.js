const axios = require("axios");
const request = require("superagent");
const superagent = require("superagent");
const options = require("./options");

const getMovieEvents = async () => {
  const response = await superagent
    .get("https://data.cityofchicago.org/resource/muku-wupu.json")
    .then((apiData) => JSON.parse(apiData.text));

  const movieEvents = [];

  for (let i = 5; i < 25; i++) {
    let eventDetail = {
      title: response[i].title,
      park: response[i].park,
      address: response[i].park_address,
      cordinates: response[i].location.cordinates,
      date: response[i].date,
    };
    movieEvents.push(eventDetail);
  }

  return movieEvents;
};

const filterByTitle = (movieTitle, data) => {
  for (let item of data) {
    if (movieTitle === item.title) {
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
        let movieId = filterByTitle(movieEvent.title, data.results);

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
    }, 2500);
  });
  return promise;
};

module.exports = { getMovieEvents, getMovieDetails };
