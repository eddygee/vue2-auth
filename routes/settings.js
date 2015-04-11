var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;

/* GET app settings. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var db = req.db;
  db.collection('settings').find().toArray(function (err, items) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.type('application/json');
    var rtn  = JSON.stringify(items);
    //console.log(rtn);
    res.send(rtn);
    //res.json(items);
  });

  var gateway = braintree.connect({
      environment:  braintree.Environment.Sandbox,
      merchantId:   'nfdbxxrdftj5238x',
      publicKey:    'p4rthbds4zg4x8vz',
      privateKey:   'f9289ea9b948eabb399b6c6eaa5e17b2'
  });
  
});

module.exports = router;
