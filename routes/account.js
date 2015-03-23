var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;


/* POST pieces listing. */
router.post('/login', function(req, res, next) {
    var db = req.db,
        body = req.body,
        data = body.payload;

      /*
      return false;
      res.send(rtn);
      */

    /* RETRIEVE USER IF EXISTS */
    var q = {'profile.email':data.email};
    db.collection('users').findOne(q, function (err, payload) {
      
      console.log('USER PAYLOAD', payload);
      console.log('query', q);

      /* IF USER DOES NOT EXISTS,
       * SAVE TO USERS COLLECTION
       */
      if(!payload){
        console.log('CREATING NEW USER');

        var newUser = {};
            newUser.createdAt= new Date().toISOString();

            newUser.profile = {};
            newUser.profile.email= data.email;
            newUser.profile.captured = [];
            newUser.profile.name = data.name;
            newUser.profile.locale = 'wpb'; //3 character code

            if(body.type === 'fb'){
              if(typeof(newUser.services)==='undefined'){
                newUser.services = {};
                newUser.services.facebook = {};
              }
              newUser.services.facebook.accessToken = body.accesTokens.facebook;
              newUser.services.facebook.email = data.email;

              //newUser.services.facebook.expiresAt: 1428581707658,
              newUser.services.facebook.first_name = payload.first_name;
              newUser.services.facebook.gender = payload.gender;
              newUser.services.facebook.id = payload.id;
              newUser.services.facebook.last_name = payload.last_name;
              newUser.services.facebook.link = payload.link;
              newUser.services.facebook.locale = payload.locale;
              newUser.services.facebook.name = payload.name;
              newUser.services.facebook.resume = {
                loginTokens: []
              };

            }
        
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