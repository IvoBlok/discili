const express = require('express');
const router = express.Router();

const dotenv = require('dotenv');
dotenv.config({ path: './.env'});

const db = require('../controllers/db');


router.get('/', (req, res) => {
  //Get the user account cookie
  let sessionUser = req.session.user;

  if(!sessionUser){
    return res.redirect('login');
  }

  //#region session expire check and update
  let deltaUpdateTime = parseFloat(req.session.updateTime) + parseFloat(process.env.SESSION_EXPIRES_IN);

  if((parseFloat(Date.now())) > deltaUpdateTime){
    req.session.destroy();
    return res.redirect('login');    
  }

  req.session.updateTime = Date.now();
  //#endregion

  db.getUserData(sessionUser, (result) => {
    if(!result){
      res.render('index', {
        message: 'error occured while searching for the user data'
      });
      return;
    };
    
    res.render('index', {
      userName: result.name
    });
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;