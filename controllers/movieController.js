const express 		= require('express');
const router 		= express.Router();
const superagent 	= require('superagent');
const unirest		= require('unirest')
const User 			= require('../models/user');
const Movie 		= require('../models/movies');


//ADDING ALL MOVIES TO DATABASE
router.post('/movies', async(req, res, next) => {
	
	superagent
	.get('https://data.cityofchicago.org/resource/muku-wupu.json')
	.then((apiData) => {

		const actualData = JSON.parse(apiData.text);
		// console.log(actualData)
		
		console.log("actual data has " + actualData.length + " elements")

		for(let i = 0; i < actualData.length; i++) {
			if(!Object.keys(actualData[i]).includes('location')) {
				console.log("this one doesn't have a location:")
				console.log(actualData[i])
			}
		}

		const dataWeNeed = actualData.map((data) => {
			
			// console.log(data)
			// console.log("1st coord", data.location.coordinates[0]);
			// console.log("2nd coord", data.location.coordinates[1])
			// return 1


			let lat;
			let lng;
			if(!Object.keys(data).includes('location')) {
				console.log("this one doesn't have a location:")
				console.log(data)
				// address a location manually: (use downtown Chicago as default lat long)
				lat = 41.8786; 
				lng = 87.6251;
			} else {
				lat = data.location.coordinates[1];
				lng = data.location.coordinates[0]
			}

			return {

				title: data.title,
				date: data.date,
				address: data.park_address,
				day: data.day,
				lat: lat,
				lng: lng,
				park: data.park,
				parkphone: data.park_phone

			}
		}) 

		console.log(dataWeNeed)
		// console.log("\nhere is data we need")
		// dataWeNeed.forEach(async (data) => {
		// 	const movies  =  await Movie.create(data)

		// })

		dataWeNeed.map((data) => {
			const movies = Movie.create(data)
		})

		res.status(200).json({
			status: 200,
			message: 'successfully added data to database'
		})

	}).catch((err)=>{
		next(err)
		// res.status(400).json({
		// 	status: 400
		// })
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

//SHOW ROUTE, RETURN ONE MOVIE EVENT FROM USERS LIST

router.get('/myMovie/:id', async(req, res, next) => {

	try{

		const currentEvent = await Movie.findById(req.params.id);
		
		res.status(200).json({
			status: 200,
			data: currentEvent
	})

	}catch(err){
		res.status(400).json({
			status: 400,
			message: 'Failed to show movie event'
		})
	}
});


//delete movie event from users list

router.delete('/myMovie/:id', async(req, res, next) => {

	try{
		//find current user
		const currentUser = await User.findById(req.session.userDbId);
		//find a movie, that user wants to delete from the list
		const currentMovie = await Movie.findById(req.params.id)
		
		currentUser.moviesList.remove(currentMovie._id)
		currentUser.save()

		res.status(200).json({
			status: 200,
			message: 'Data removed'
		})

	}catch(err){
		res.status(404).json({
			status: 404,
			message: 'failed to delete data from users list'
		})
	}
})


router.get('/plot/:title', async(req, res, next) => {

		try{
			

			unirest
 			.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?page=1&r=json&s=${req.params.title}`)
			.header("X-RapidAPI-Host", "movie-database-imdb-alternative.p.rapidapi.com")
			.header("X-RapidAPI-Key", '42c942c36bmsh07b78ab42f4a156p1199e9jsn7ddb5f6127a2')
			.end(function (result) {
 				
  			let id = result.body.Search[0].imdbID
  			console.log(typeof(id), '<--saved data in id ')

			unirest.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${id}&r=json`)
			.header("X-RapidAPI-Host", "movie-database-imdb-alternative.p.rapidapi.com")
			.header("X-RapidAPI-Key", '42c942c36bmsh07b78ab42f4a156p1199e9jsn7ddb5f6127a2')
			.end(function (resol) {
  				// console.log(resol.body.Plot, 'get me PLOT');

  			const actualData = resol.body.Plot;

  			res.json({
  				status: 200,
  				data: actualData,
  				message: 'dskgdfglkdfnglkdfng'
  			})
			});	
			})

			
		}catch(err){
			res.json({
				message:'Not such a movie'
			})
		}
})

module.exports = router;









