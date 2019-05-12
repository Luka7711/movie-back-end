const mongoose = require('mongoose');
const Movie    = require('./movies'); 

const userSchema = new mongoose.Schema({
	
	username: { type: String, require: true },

	password: {type: String, require: true},

	moviesList: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Movie'
	}]
})

const User = mongoose.model('User', userSchema);

module.exports = User