var express = require('express');
var router = express.Router();
var passport = require('../auth');
var BSON = require('mongodb').BSONPure;


/* POST pieces listing. */
router.post('/register', function(req, res, next) {
  var db = req.db,
      body = req.body;

  console.log('HOORAY!!',req);
  console.log('BODY', body);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.type('application/json');
  var rtn  = JSON.stringify( body );
  res.send(rtn);
});

router.post('/create',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    var db = req.db,
        body = req.body;

    var q = {'profile.email':data.email};
    db.collection('users').findOne(q, function (err, payload) {
      
      console.log('BODY', body);
      console.log('USER PAYLOAD', payload);
      console.log('query', q);
    }):

    console.log('AUTH SUCCESSFUL!!!!!!!!!!');
    //res.redirect('/users/' + req.user.username);
  },
  function(req,res){
    console.log('FAILED!!!!!!!');
  });



/* POST pieces listing. */
router.post('/fetch-user', function(req, res, next) {
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
      
      console.log('BODY', body);
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
            newUser.profile.status = 1;

            if(body.type === 'fb'){
              if(typeof(newUser.services)==='undefined'){
                newUser.services = {};
              }
              newUser.services.facebook = {};
              if(typeof(body.accesTokens.facebook)!=='undefined')
                newUser.services.facebook.accessToken = body.accesTokens.facebook;
              if(typeof(data.email)!=='undefined')
                newUser.services.facebook.email = data.email;

              //if(typeof(body.accesTokens.facebook)!=='undefined')
                //newUser.services.facebook.expiresAt = 1428581707658;

              if(typeof(data.first_name)!=='undefined')
                newUser.services.facebook.first_name = data.first_name;

              if(typeof(data.gender)!=='undefined')
                newUser.services.facebook.gender = data.gender;
              
              if(typeof(data.id)!=='undefined')
                newUser.services.facebook._id = data.id;
              
              if(typeof(data.last_name)!=='undefined')
                newUser.services.facebook.last_name = data.last_name;
              
              if(typeof(data.link)!=='undefined')
                newUser.services.facebook.link = data.link;
              
              if(typeof(data.locale)!=='undefined')
                newUser.services.facebook.locale = data.locale;
              
              if(typeof(data.name)!=='undefined')
                newUser.services.facebook.name = data.name;
              
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
        var newToken =  {
          when : new Date().toISOString()
        }

        db.collection('users').update({_id:payload._id}, {'$push':{'services.facebook.resume.loginTokens':newToken}}, function(err, result) {
            if (err) throw err;
            if (result) console.log('Added Token');
        });
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.type('application/json');
      var rtn  = JSON.stringify( payload );
      res.send(rtn);
    });

});
module.exports = router;