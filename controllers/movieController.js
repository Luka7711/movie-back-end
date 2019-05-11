const express 		= require('express');
const router 		= express.Router();
const superagent 	= require('superagent');
const Movie 		= require('../models/movies');


router.get('/movies', (req, res, next) => {
	
	superagent
	.get('https://data.cityofchicago.org/resource/muku-wupu.json')
	.then((data) => {
		const actualData = JSON.parse(data.text);
		const dataWeNeed = actualData.map(data => {
			return {
				title: data.title,
				date: data.date,
				address: data.park_address,
				day: data.day,
				coordinates: data.location,
				park: data.park,
			}
		}) 
		res.status(200).json({
			data: dataWeNeed
		})
	})
})

module.exports = router;