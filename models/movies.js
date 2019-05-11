const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	title: String,
	date: String,
	parkName: String,
	address: String
})


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie 