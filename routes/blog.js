var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;
var http = require('http');
var https = require("https");

/* GET blog postings. */
router.get('/', function(req, res1, next) {
  //res.send('respond with a resource');
  var db = req.db;

  var url = 'http://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://vividartsapp.com/blog/feed/&num=20';
  http.get(url, function(res) {
      var body = '',
          response = '';

      res.on('data', function(chunk) {
          body += chunk;
      });

      res.on('end', function() {
        response = JSON.parse(body);
        console.log("Got response: ", response.responseData);


        res1.setHeader('Access-Control-Allow-Origin', '*');
        res1.type('application/json');
        console.log(response.responseData);
        res1.send(response.responseData);
      });

  }).on('error', function(e) {
        console.log("Got error: ", e);
  });

});


/* GET blog article. */
router.get('/:name', function(req, res, next) {
  //res.send('respond with a resource');

  var db = req.db,
      pageName = req.params.name;

  db.collection('pages').findOne({name:pageName}, function (err, page) {

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.type('application/json');
      var rtn  = JSON.stringify(page);
      console.log(rtn);
      res.send(rtn);

  });

});

module.exports = router;
