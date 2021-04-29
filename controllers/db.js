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

db.connect( (err) => {
  if(err) {
     console.log(err);
  } else {
     console.log("MySQL connection established...");
  }
});

exports.getUserData = async (id, callback) => {
  
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
