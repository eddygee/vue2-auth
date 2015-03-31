var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;

/* GET spots listing. */
router.get('/', function(req, res, next) {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  var str = 'loaderio-1c8e8b375aa7f7ac9c319a7a42f2182e';
  //console.log(rtn);
  res.send(str);

});
