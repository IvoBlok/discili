
//const dbController = require('../controllers/db');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//import mysql and dotenv and initialize it
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

exports.db = db;

var test = "testing purposes";

db.connect( (err) => {
  if(err) {
     console.log(err);
  } else {
     console.log("MySQL connection established...");
  }
});

exports.getUserData = (id) => {
  console.log("test");
}

exports.register = (req, res) => {

  // Getting the form data
  const { name, email, password, passwordConfirm} = req.body;
  
  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if(error) {
      console.log(error);
      return
    }

    if(results.length > 0){
      return res.render('register', {
        message: 'That email is already in use'
      })
    }
    if( password !== passwordConfirm) {
      return res.render('register', {
        message: 'The passwords do not match'
      })
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    
    db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
      if(error) {
        console.log(error);
        return
      }
      console.log("User registered");
      return res.render('register', {
        message: 'User registered'
      })
    });
  });
  
}

exports.login = async (req, res) => {
  	try {
      const { email, password } = req.body;

      //very basic checks for input validation
      if(!email || !password) {
        return res.status(400).render('login', {
          message: 'Please provide an email and password'
        })
      }
      
      db.query(' SELECT * FROM users WHERE email = ?', [email], async (error, results) => {

        if(results.length != 1 || !(await bcrypt.compare(password, results[0].password))){
          return res.status(401).render('login', {
            message: 'Email or Password is incorrect'
          })
        }

      //#region Old cookie system
      // If the email is valid, and the password matched, you succesfully logged in
      /*
      const id = results[0].id;
      const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });

      console.log("The token is: " + token);

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      }

      res.cookie('accountLoginCookie', token, cookieOptions);
      */
      //#endregion

      var save_session = function(req, id){
        req.session.user = id;
        req.session.updateTime = Date.now();
      }

      save_session(req, results[0].id);

      res.status(200).redirect("/")
      }); 
    } catch (error) {
      console.log(error.message);
    }
}

exports.logout = async (req, res) => {
  req.session.destroy();
  res.status(200).redirect("/login");
}