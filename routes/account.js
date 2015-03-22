var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;


/* POST pieces listing. */
router.post('/login', function(req, res, next) {
    var email = req.body.email,
        db = req.db;

        console.log(req.body);

      /*
      return false;
      res.send(rtn);
      */

    /* RETRIEVE USER IF EXISTS */
    db.collection('users').findOne({profile.email:req.body.email}, function (err, payload) {
      
      console.log('USER PAYLOAD', payload);

      /* IF USER DOES NOT EXISTS,
       * SAVE TO USERS COLLECTION
       */
      if(!payload){
        console.log('CREATING NEW USER');

        var newUser = {};
            newUser.email= req.body.email;
            newUser.createdAt= new Date().toISOString();

            newUser.profile = {};
            newUser.profile.captured = [];
            newUser.profile.name = req.body.name;
        
        db.collection('users').insert(newUser, function(err, result) {
            if (err) throw err;
            if (result) console.log('New User Added!');
        });

      }else{
        console.log('user already exists', payload);
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.type('application/json');
      var rtn  = JSON.stringify( payload );
      res.send(rtn);
    });

});
module.exports = router;