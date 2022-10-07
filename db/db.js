// This is where we will set up our db connection
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;

const url =
  "mongodb+srv://ulukbek:7T7tQE3PkDh2PBIV@cluster7.cov0m.mongodb.net/movies?retryWrites=true&w=majority";

// that is automatically created
mongoose
  .connect(url, { useNewUrlParser:true, useUnifiedTopology: true })
  .then(() => console.log("mongoose is connected"))
  .catch((err) => console.log(err, "something went wrong"));
