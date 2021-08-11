const axios = require("axios");
const request = require("superagent");
const superagent = require("superagent");
const options = require("./options");

const getMovieEvents = async () => {
  const response = await superagent
    .get("https://data.cityofchicago.org/resource/muku-wupu.json")
    .then((apiData) => JSON.parse(apiData.text));

  const movieEvents = [];

  for (let i = 5; i < 15; i++) {
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
            details.images = data.images;
          });

          options.top_cast.params = { tconst: movieId };
          await axios.request(options.top_cast).then(({ data }) => {
            details.cast_ids = data;
          });
          resolve(details);
        } else resolve({});
      });
    }, 1000);
  });
  return promise;
};

module.exports = { getMovieEvents, getMovieDetails };

/*save cast's(name, plot, movie photos), plot,
        1. find id of movie 
        url: title/find
        params: movie_title
        
        2. find over all details 
        url: title/get-overview-details 
        params: movie_id
        save {"id of movie","ratings","genres","releaseDate", "plotSummary", "image" }
        
        3 find IMAGES OF MOVIE title/get-images
        params: movie_id

        3. find top cast name id 
        url: title/get-top-cast 
        params: movie_id
        returns name's id of top cast in movie [0:"/name/nm0000158/", 1:"/name/nm0000166/"]
        
        4. find and save top cast's names
        url: actors/get-bio
        params: actor_name
        returns details about actor*/
