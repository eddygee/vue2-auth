var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;

/* GET artists listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var db = req.db;
  db.collection('artists').find({status:'published'}).sort({name:1}).toArray(function (err, items) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.type('application/json');
    var rtn  = JSON.stringify(items);
    //console.log(rtn);
    res.send(rtn);
    //res.json(items);
  });
});

/* GET artist listing. */
router.get('/:artistId', function(req, res, next) {
  //res.send('respond with a resource');

  var db = req.db;

  var artistId = BSON.ObjectID.createFromHexString(req.params.artistId);
  db.collection('artists').findOne(artistId, function (err, artist) {

    var aid = artist._id.toString();
    db.collection('pieces').find({status:'published','artists.ids' : {'$in':[aid]}}).toArray(function (err, items) {
      artist.pieces = items;
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.type('application/json');
      var rtn  = JSON.stringify(artist);
      res.send(rtn);
    });

  });

});

router.get('/:artistId/:lng/:lat', function(req, res, next) {
  //res.send('respond with a resource');

  var db = req.db,
      lng = parseFloat(req.params.lng),
      lat = parseFloat(req.params.lat);

  var artistId = BSON.ObjectID.createFromHexString(req.params.artistId);
  db.collection('artists').findOne(artistId, function (err, artist) {
    var aid = artist._id.toString();

    db.collection('pieces').ensureIndex({"loc":"2d"});
    db.collection('pieces').find({loc: {'$near':[lng,lat]}, 'status':'published','artists.ids' : {'$in':[aid]}}).toArray(function (err, items) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.type('application/json');
        artist.pieces = items;
        var rtn  = JSON.stringify(artist);
        //console.log(rtn);
        res.send(rtn);
        //res.json(items);
    });

  });

});
module.exports = router;
