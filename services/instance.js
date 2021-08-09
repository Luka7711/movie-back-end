const axios = require("axios");
const request = require("superagent");
const superagent = require("superagent");
const options = require("./options");

const getMovieEvents = async () => {
  const response = await superagent
    .get("https://data.cityofchicago.org/resource/muku-wupu.json")
    .then((apiData) => JSON.parse(apiData.text));

  const movieEvents = [];

  for (let i = 0; i < 5; i++) {
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

const getMovieDetails = async (movieEvent) => {
  let movie = {};

  let promise = new Promise((resolve, reject) => {
    timerId = setTimeout(() => {
      options.movie_id.params = { q: movieEvent.title };
      axios.request(options.movie_id).then((response) => {
        console.log(response.data.results[0]);
        resolve(response.results);
      });
    }, 2000);
  });
  return promise;
};

module.exports = { getMovieEvents, getMovieDetails };

/*save cast's(name, plot, movie photos), plot,

1. find id of movie 
const requestId = async (moviesForRequest, id_data) => {
  const ids = moviesForRequest.map(async (movie) => {
    options.params.q = movie;
    const response = await axios.request(options).then(({ data }) => {
      id_data.push(data.results[0].id);
      return id_data;
    });
  });
};
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
