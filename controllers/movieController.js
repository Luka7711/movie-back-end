const express 		= require('express');
const router 		= express.Router();
const superagent 	= require('superagent');
const User 			= require('../models/user');
const Movie 		= require('../models/movies');


//ADDING ALL MOVIES TO DATABASE
router.post('/movies', async(req, res, next) => {
	
	superagent
	.get('https://data.cityofchicago.org/resource/muku-wupu.json')
	.then((data) => {
		const actualData = JSON.parse(data.text);
		const dataWeNeed = actualData.map((data) => {
			return {
				
				title: data.title,
				date: data.date,
				address: data.park_address,
				day: data.day,
				lng: 42.8746,
				lat: 74.5698,
				park: data.park
			}
		}) 
		
		dataWeNeed.map((data) => {
			const movies  =  Movie.create(data)

		})

		res.status(200).json({
			status: 200,
			message: 'successfully added data to database'
		})

	}).catch((err)=>{
		res.status(400).json({
			status: 400
		})
	})
})

//returns all movies
router.get('/movies', async(req, res, next) => {

	try{

		const foundMovies = await Movie.find({});

		res.json({
			status: 200, 
			id: foundMovies._id,
			data: foundMovies
		})

	} catch(err){
		res.status(400).json({
			status: 400,
			message: 'No movies found'
		})
	}
})


//returns one movie event is show page
router.get('/movies/:id', async(req, res, next) => {

	try{
	
	const foundMovie = await Movie.findById(req.params.id)

	res.json({
		status: 200,
		data: foundMovie
	})
	
	}catch(err){
		next(err)
	}
})


// SAVES MOVIE EVENT IN USERS LIST
router.post('/mylist/:id', async(req, res, next) => {

	try{
	
		const currentUser = await User.findById(req.session.userDbId);
		const movieToAdd = await Movie.findById(req.params.id);

		console.log(currentUser, '<--current user');
		console.log(movieToAdd, '<--movieToAdd');

		currentUser.moviesList.push(movieToAdd._id);
		await currentUser.save()

		res.json({
			status: 200,
			data: currentUser,
			message: 'successfully added movie to you list'
		})
		

	}catch(err){
		res.status(404).json({
			status: 404, 
			message: 'Something went wrong'
		})
	}
})

//returning users saved movie events on the page

router.get('/mylist', async(req, res, next) => {
	
	try{

		const currentUser = await User.findById(req.session.userDbId);
		console.log(currentUser, '<--this is current user')
		//find an user by his id
		await User.findById(req.session.userDbId)
		.populate('moviesList')
		.exec((err, foundUser) => {
				res.status(200).json({
				status: 200,
				data: foundUser.moviesList
			})
		})
		//send movie list as JSON data

	}catch(err){
		res.status(404).json({
			status: 404,
			message: 'Failed to show your list'
		})
	}
})



module.exports = router;









