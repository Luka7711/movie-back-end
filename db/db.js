// This is where we will set up our db connection
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}.cov0m.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// const connectionString = process.env.MONGODB_URI;
const connectionString = "mongodb://localhost/movie";
// that is automatically created
mongoose
  .connect(url)
  .then(() => console.log("mongoose is connected"))
  .catch((err) => console.log(err, "something went wrong"));
