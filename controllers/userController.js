
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
	console.log(passwordHash, 'this is passwordHash');
	
	const userDbEntry = {};
	userDbEntry.username = req.body.username;
	userDbEntry.password = passwordHash;

	try{

		const createdUser = await User.create(userDbEntry);
		req.session.logged =  true;
		req.session.userDbId =  createdUser._id;

		res.json({
			status: 200,
			isLegit: true,
			data: createdUser,
			message: `Successfully created account for ${createdUser.username}`
		}) 
		
	console.log(createdUser)
	}catch(err){
		next(err)
	}
})

router.post('/login', async(req, res, next) => {

	try{
		const foundUser = await User.findOne({'username': req.body.username});

		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				req.session.logged = true;
				req.session.userDbId = foundUser._id;

				res.json({
					status: 200,
					isLegit: true,
					data: foundUser,
					message: `Thanks for sign in ${foundUser.username}`
				})
			}else{
				
				res.json({
					status: 404,
					islegit: false,
					message: 'username or password is incorrect'
				})
			}
		}else{
				res.json({
					status: 404,
					isLegit: false,
					message: 'username or password is incorrect'
				})
			}
	}catch(err){
		res(err)
	}
})


	router.get('/logout', (req, res) => {
		req.session.destroy((err)=>{
			if(err){
				res.json({
					status: 404
				})
			}else{
				res.json({
					status: 200,
					message: 'Thanks for visiting, comeback soon'
				})
			}
		})
	})


module.exports = router