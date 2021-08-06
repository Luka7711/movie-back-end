const axios = require("axios");
const request = require("superagent");
const superagent = require("superagent");

const getMovieEvents = async () => {
  const response = await superagent
    .get("https://data.cityofchicago.org/resource/muku-wupu.json")
    .then((apiData) => JSON.parse(apiData.text));

  const movieEvents = [];

  for (let i = 0; i < 30; i++) {
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

const getMoviesId = async (movieEvents) => {
  let options = {
    method: "GET",
    url: "https://imdb8.p.rapidapi.com/title/find",
    params: { q: "" },
    headers: {
      "x-rapidapi-key": "20a16b11demsh01d177a853c4fa0p1f60c3jsnf03f5408c9ed",
      "x-rapidapi-host": "imdb8.p.rapidapi.com",
    },
  };

  let atIndex = 0;
  let lastIndex = movieEvents.length;
  let requestCount = 5;
  let numTimes = 0;

  let requestTimer = setInterval(async () => {
    let itemsLeft = lastIndex - atIndex;

    if (itemsLeft >= requestCount) {
      numTimes = 5;
    } else if (itemsLeft < requestCount) {
      numTimes = itemsLeft;
    }

    let moviesForRequest = [];

    for (let i = 0; i < numTimes; i++) {
      moviesForRequest.push(movieEvents[atIndex].title);
      atIndex++;
    }
    await requestId(moviesForRequest);

    if (atIndex === lastIndex) clearInterval(requestTimer);
  }, 2000);

  // get array
  const requestId = async (movies, ids) => {
    movies.map(async (movie) => {
      options.params.q = movie;
      const response = await axios
        .request(options)
        .then(({ data }) => console.log(data.results[0]));
    });
  };

  // const response = await axios
  //   .request(options)
  //   .then((data) => data.data.results[0]);

  // return response;
};

module.exports = { getMovieEvents, getMoviesId };

/*save cast's(name, plot, movie photos), plot,

        1. find id of movie 
        url: title/find
        params: movie_title
        
        2. find over all details 
        url: title/get-overview-details 
        params: movie_id
        save {"id of movie","ratings","genres","releaseDate", "plotSummary", "image" }
        
        3. find top cast name id 
        url: title/get-top-cast 
        params: movie_id
        returns name's id of top cast in movie [0:"/name/nm0000158/", 1:"/name/nm0000166/"]
        
        4. find and save top cast's names
        url: actors/get-bio
        params: actor_name
        returns details about actor*/