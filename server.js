const express = require('express');
const app = express();
<<<<<<< HEAD
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const unirest = require("unirest");
const session = require("express-session");
=======
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const unirest = require('unirest');
const cors = require('cors');
const session = require('express-session');
>>>>>>> 3e482223edf8add49ecc0a25e3aebecc27ad898b

require('dotenv').config();
require('./db/db');

const PORT = process.env.PORT;

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);

console.log(PORT);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// app.use(cors(corsOptions));

const userController = require('./controllers/userController');
const movieController = require('./controllers/movieController');
app.use('/auth', userController);
app.use('/chicago-cinema', movieController);

app.listen(PORT || 9000, () => {
  console.log('listenining on port');
});
