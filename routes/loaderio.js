var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;

/* GET spots listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var db = req.db;
  db.collection('spots').find({status:'published'}).toArray(function (err, items) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.type('application/json');
    var str = 'loaderio-1c8e8b375aa7f7ac9c319a7a42f2182e';
    var rtn  = JSON.stringify(items);
    //console.log(rtn);
    res.send(rtn);
    //res.json(items);
  });
});
