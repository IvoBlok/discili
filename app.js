const cookieParser = require('cookie-parser');
const session = require('express-session');

const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

//Define the server app
const express = require('express');
const app = express();

//set up the 'path' to the views and stylesheets
const path = require('path');
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));


//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
//Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: true
}));

app.set('view engine', 'hbs');


//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

//Define what port express should be looking for to get requests
//Also it has a callback function to make sure it has started listening
app.listen(5000, () => {
   console.log("Server started on port 5000")
});