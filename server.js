const express 			= require('express');
const app 				= express();
const bodyParser 		= require('body-parser');
const methodOverride 	= require('method-override');
const cors 				= require('cors')
const session 			= require('express-session');



require('./db/db');

const userController = require('./controllers/userController');



app.use(session({
	secret:'keep it safe',
	resave:false,
	saveUninitialized:false
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true,
	optionSuccessStatus: 200
}

app.use(cors(corsOptions))


app.use('/auth', userController);


app.listen(process.env.PORT || 9000, ()=> {
	console.log('listenining on port 9000')
})





