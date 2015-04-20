var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;

/* GET spots listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var db = req.db;
  db.collection('spots').find({status:'published'}).sort({name:1}).toArray(function (err, items) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.type('application/json');
    var rtn  = JSON.stringify(items);
    //console.log(rtn);
    res.send(rtn);
    //res.json(items);
  });
});

/* GET spot listing. */
router.get('/:spotId', function(req, res, next) {
  //res.send('respond with a resource');
  var constructAddress = function(spot){
    var address = '';
    if(typeof(spot.location.name)!='undefined'&&spot.location.name!=null)
      address += spot.location.name + '<br/>';
    if(typeof(spot.location.street1)!='undefined'&&spot.location.street1!=null)
      address += spot.location.street1 + '<br/>';
    if(typeof(spot.location.suburb)!='undefined'&&spot.location.suburb!=null)
      address += spot.location.suburb;
    if(typeof(spot.location.state)!='undefined'&&spot.location.state!=null)
      address += ', ' + spot.location.state;
    if(typeof(spot.location.postcode)!='undefined'&&spot.location.postcode!=null)
      address += ' ' + spot.location.postcode;
    return address;
  };

  var db = req.db;
  var spotId = BSON.ObjectID.createFromHexString(req.params.spotId);
  db.collection('spots').findOne(spotId, function (err, spot) {

    spot.formattedAddress = constructAddress(spot);

    db.collection('pieces').find({status:'published','location.address':spot._id}).toArray(function (err, items) {
      spot.pieces = items;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.type('application/json');
      var rtn  = JSON.stringify(spot);
      res.send(rtn);
    });
  });

});


/* GET spot listing. */
router.get('/:spotId/:lng/:lat', function(req, res, next) {
  //res.send('respond with a resource');
  var constructAddress = function(spot){
    var address = '';
    if(typeof(spot.location.name)!='undefined'&&spot.location.name!=null)
      address += spot.location.name + '<br/>';
    if(typeof(spot.location.street1)!='undefined'&&spot.location.street1!=null)
      address += spot.location.street1 + '<br/>';
    if(typeof(spot.location.suburb)!='undefined'&&spot.location.suburb!=null)
      address += spot.location.suburb;
    if(typeof(spot.location.state)!='undefined'&&spot.location.state!=null)
      address += ', ' + spot.location.state;
    if(typeof(spot.location.postcode)!='undefined'&&spot.location.postcode!=null)
      address += ' ' + spot.location.postcode;
    return address;
  };

  var db = req.db,
      lng = parseFloat(req.params.lng),
      lat = parseFloat(req.params.lat);
  
  var spotId = BSON.ObjectID.createFromHexString(req.params.spotId);
  db.collection('spots').findOne(spotId, function (err, spot) {
    spot.formattedAddress = constructAddress(spot);

    db.collection('pieces').ensureIndex({"loc":"2d"});
    db.collection('pieces').find({loc: {'$near':[lng,lat]}, status:'published','location.address':spot._id}).toArray(function (err, items) {
      spot.pieces = items;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.type('application/json');
      var rtn  = JSON.stringify(spot);
      res.send(rtn);
    });
  });

});


module.exports = router;
