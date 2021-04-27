//import mysql and dotenv and initialize it
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

const authController = require('../controllers/auth');

exports.getUserData = async (id, callback) => {
  const db = authController.db;
  
  db.query('SELECT * FROM users WHERE id = ?', [id], async (error, results) => {
    if(error) {
      console.log(error);
      callback();
      return;
    }

    if(results.length != 1){
      console.log("something has gone very very wrong");
      callback();
      return;
    }
    callback(results[0]);
  });
}
