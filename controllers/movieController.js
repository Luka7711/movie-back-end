const express 		= require('express');
const router 		= express.Router();
const superagent 	= require('superagent');
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

router.post('/movies/mylist/')



module.exports = router;









