var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;

/* GET artists listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var db = req.db;

  db.collection('pages').findOne(function (err, page) {

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.type('application/json');
      var rtn  = JSON.stringify(page);
      console.log(rtn);
      res.send(rtn);

  });
});


/* GET page listing. */
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
