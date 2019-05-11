const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
	id: String,
	title: String,
	date: String,
	address: String,
	day: String,
	lat: Number,
	lng: Number,
	park: String

})


const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie 