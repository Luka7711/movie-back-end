
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');



//USER CREATES AN ACCOUNT
router.post('/register', async(req, res, next) => {
	
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

	//create an object for the db entry, the properties of this object
	//will match up with our model

	const userDbEntry = {};
	userDbEntry.username = req.body.username;
	userDbEntry.password = passwordHash;

	try{

		const createdUser = await User.create(req.body);
		req.session.logged =  true;
		req.session.userDbId =  createdUser._id;

		res.json({
			status: 200,
			isLegit: true,
			data: createdUser,
			message: `Successfully created account for ${createdUser.username}`
		}) 
		

	}catch(err){
		next(err)
	}
})

// router.post('/login', async(req, res, next) => {

// 	try{
// 		const foundUser = await User.findOne({'username': req.body.username});

// 		if(foundUser){
// 			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
// 				req.session.logged = true;
// 				req.session.userDbId = foundUser._id;
// 			}else{
				
// 			}
// 		}
// 	}catch(err){
// 		console.log(err)
// 	}
// })


module.exports = router