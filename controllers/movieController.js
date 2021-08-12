const express = require("express");
const router = express.Router();
const unirest = require("unirest");
const User = require("../models/user");
const Movie = require("../models/movies");
const movieApi = require("../services/instance.js");
const axios = require("axios");

//ADDING ALL MOVIES TO DATABASE
router.post("/movies", async (req, res, next) => {
  try {
    const events = await movieApi.getMovieEvents();

    const getDetails = async (events) => {
      let movies_db;
      for (let i = 0; i < events.length; i++) {
        let movieDetail = await movieApi.getMovieDetails(events[i]);
        Movie.create({ event: events[i], details: movieDetail });
      }
      movies_db = await Movie.find({});
      return movies_db;
    };

    getDetails(events).then((movie_data) => {
      console.log(movie_data.length, "movie data");
      res.json({
        status: 200,
        data: movie_data,
      });
    });
  } catch (err) {
    res.json({
      status: 404,
      text: "ERROR",
    });
  }
});

//returns all movies
router.get("/movies", async (req, res, next) => {
  try {
    let movies = await Movie.find({});

    res.json({
      status: 200,
      id: movies._id,
      data: movies,
    });
  } catch (err) {
    res.json({
      status: 400,
      message: "Something went wrong",
    });
  }
});

//returns one movie event is show page
router.get("/movies/:id", async (req, res, next) => {
  try {
    const foundMovie = await Movie.findById(req.params.id);

    res.json({
      status: 200,
      data: foundMovie,
    });
  } catch (err) {
    next(err);
  }
});

// SAVES MOVIE EVENT IN USERS LIST
router.post("/mylist/:id", async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.userDbId);
    const movieToAdd = await Movie.findById(req.params.id);

    console.log(currentUser, "<--current user");
    console.log(movieToAdd, "<--movieToAdd");

    currentUser.moviesList.push(movieToAdd._id);
    await currentUser.save();

    res.json({
      status: 200,
      data: currentUser,
      message: "successfully added movie to you list",
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "Something went wrong",
    });
  }
});

//returning users saved movie events on the page

router.get("/mylist", async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.userDbId);
    console.log(currentUser, "<--this is current user");
    //find an user by his id
    await User.findById(req.session.userDbId)
      .populate("moviesList")
      .exec((err, foundUser) => {
        res.status(200).json({
          status: 200,
          data: foundUser.moviesList,
        });
      });
    //send movie list as JSON data
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "Failed to show your list",
    });
  }
});

//SHOW ROUTE, RETURN ONE MOVIE EVENT FROM USERS LIST

router.get("/myMovie/:id", async (req, res, next) => {
  try {
    const currentEvent = await Movie.findById(req.params.id);

    res.status(200).json({
      status: 200,
      data: currentEvent,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: "Failed to show movie event",
    });
  }
});

//delete movie event from users list

router.delete("/myMovie/:id", async (req, res, next) => {
  try {
    //find current user
    const currentUser = await User.findById(req.session.userDbId);
    //find a movie, that user wants to delete from the list
    const currentMovie = await Movie.findById(req.params.id);

    currentUser.moviesList.remove(currentMovie._id);
    currentUser.save();

    res.status(200).json({
      status: 200,
      message: "Data removed",
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "failed to delete data from users list",
    });
  }
});

router.get("/plot/:title", async (req, res, next) => {
  try {
    unirest
      .get(
        `https://movie-database-imdb-alternative.p.rapidapi.com/?page=1&r=json&s=${req.params.title}`
      )
      .header(
        "X-RapidAPI-Host",
        "movie-database-imdb-alternative.p.rapidapi.com"
      )
      .header(
        "X-RapidAPI-Key",
        "42c942c36bmsh07b78ab42f4a156p1199e9jsn7ddb5f6127a2"
      )
      .end(function (result) {
        if (result.body.Response === "True") {
          let id = result.body.Search[0].imdbID;
          unirest
            .get(
              `https://movie-database-imdb-alternative.p.rapidapi.com/?i=${id}&r=json`
            )
            .header(
              "X-RapidAPI-Host",
              "movie-database-imdb-alternative.p.rapidapi.com"
            )
            .header(
              "X-RapidAPI-Key",
              "42c942c36bmsh07b78ab42f4a156p1199e9jsn7ddb5f6127a2"
            )
            .end(function (resol) {
              // console.log(resol.body.Plot, 'get me PLOT');

              const actualData = resol.body.Plot;
              const moviePoster = resol.body.Poster;
              res.json({
                status: 200,
                data: actualData,
                poster: moviePoster,
              });
            });
        } else if (result.body.Response === "False") {
          res.json({
            status: 404,
            message: "Movie with such name is not found",
          });
        }
      });
  } catch (err) {
    res.json({
      message: "Not such a movie",
    });
  }
});

router.delete("/movies/delete/all", async (req, res, next) => {
  try {
    await Movie.deleteMany({}, function (err) {
      if (!err) {
        console.log("removed");
      } else {
        console.log(err);
      }
    });
    console.log(Movie.find({}));
    console.log("movies deleted");
  } catch (err) {
    res.json({
      status: 404,
      message: "something went wrong",
    });
  }
});

router.get("/weather/in/chicago", async (req, res, next) => {
  try {
    // await console.log("weather")
    let response = await superagent
      .get(
        "http://api.openweathermap.org/data/2.5/weather?q=Chicago,USA&APPID=24efa750a9ff8ae4b68abe4adc16f424"
      )
      .then((result) => {
        console.log("result body");
        console.log(result.body);
        return result.body;
      });
    console.log("this is response");
    console.log(response.main.temp);
    res.json({
      status: 200,
      fahren:
        Math.floor(((Number(response.main.temp) - 273.15) * 9) / 5 + 32) + "°F",
      cels: Math.floor(Number(response.main.temp) - 273.15) + "°C",
      weatherCondit: response.weather[0].main.toLowerCase(),
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
