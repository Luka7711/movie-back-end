const movie_id = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/title/find",
  headers: {
    "x-rapidapi-key": "d3e39eeecfmsh3998390045e2466p154abfjsna7eb052dce03",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },
};

const details = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/title/get-overview-details",
  params: { tconst: "tt0944947", currentCountry: "US" },
  headers: {
    "x-rapidapi-key": "d3e39eeecfmsh3998390045e2466p154abfjsna7eb052dce03",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },
};

const mv_images = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/title/get-images",
  params: { tconst: "tt0944947", limit: "10" },
  headers: {
    "x-rapidapi-key": "d3e39eeecfmsh3998390045e2466p154abfjsna7eb052dce03",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },
};

const top_cast = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/title/get-top-cast",
  headers: {
    "x-rapidapi-key": "d3e39eeecfmsh3998390045e2466p154abfjsna7eb052dce03",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },
};

module.exports = { movie_id, details, mv_images, top_cast };
