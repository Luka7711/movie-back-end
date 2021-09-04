const express = require("express");
const app = express();
require("dotenv").config();
require("./db/db");

const PORT = process.env.PORT;

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://movies-in-park.herokuapp.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  next();
});

app.get("/", (req, res) => res.send("Helllo world"));

const userController = require("./controllers/userController");
const movieController = require("./controllers/movieController");
app.use("/auth", userController);
app.use("/chicago-cinema", movieController);

app.listen(PORT || 9000, () => {
  console.log("listenining on port");
});
