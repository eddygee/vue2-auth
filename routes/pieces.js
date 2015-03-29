var express = require('express');
var router = express.Router();
var BSON = require('mongodb').BSONPure;

/* GET pieces listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  var db = req.db;
  db.collection('pieces').find({status:'published'}).toArray(function (err, items) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.type('application/json');
    var rtn  = JSON.stringify(items);
    //console.log(rtn);
    res.send(rtn);
    //res.json(items);
  });
});

/* GET featured piece. */
router.get('/featured', function(req, res, next) {
  //res.send('respond with a resource');
  var db = req.db;
  db.collection('pieces').findOne({status:'published',featured:true}, function (err, items) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.type('application/json');
    var rtn  = JSON.stringify(items);
    //console.log(rtn);
    res.send(rtn);
    //res.json(items);
  });
});

router.get('/:lng/:lat', function(req, res, next) {
  //res.send('respond with a resource');

  var db = req.db,
      lng = parseFloat(req.params.lng),
      lat = parseFloat(req.params.lat);

  db.collection('pieces').ensureIndex({"loc":"2d"});
  db.collection('pieces').find({loc: {'$near':[lng,lat]}, 'status':'published'}).toArray(function (err, items) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.type('application/json');
      var rtn  = JSON.stringify(items);
      //console.log(rtn);
      res.send(rtn);
      //res.json(items);
  });
});

/* GET piece listing. */
router.get('/:pieceId', function(req, res, next) {
  //res.send('respond with a resource');

  var db = req.db;
  var pieceId = BSON.ObjectID.createFromHexString(req.params.pieceId);

  //console.log('Looking for piece '+pieceId);
  db.collection('pieces').findOne(pieceId, function (err, pieces) {
    var addressId = pieces.location.address;
    //var spotId = BSON.ObjectID.createFromHexString(addressId);
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

    //console.log('Looking for '+addressId);
    db.collection('spots').findOne(addressId, function (err, spot) {
      var spotAddress = constructAddress(spot);

      pieces.location.spotAddress = spotAddress;
      pieces.location.spot = spot;


      //console.log(typeof(addressId));
      //console.log(addressId);
      if(typeof(pieces.artists) != 'undefined' ){

        var artistsId = pieces.artists.ids;
        var temp = [];
        if(typeof(pieces.artists.artist1)!='undefined')
          temp.push(pieces.artists.artist1);
        if(typeof(pieces.artists.artist2)!='undefined')
          temp.push(pieces.artists.artist2);
        if(typeof(pieces.artists.artist3)!='undefined')
          temp.push(pieces.artists.artist3);
        if(typeof(pieces.artists.artist4)!='undefined')
          temp.push(pieces.artists.artist4);
        if(typeof(pieces.artists.artist5)!='undefined')
          temp.push(pieces.artists.artist5);

        if(temp.length){
          db.collection('artists').find({_id : { "$in" : temp } })
            .toArray(function (err, collection) {
              pieces.artists.collection = collection;

              //Find Nearby Pieces
              db.collection('pieces')
                .find({loc: {'$near':[pieces.loc[0],pieces.loc[1]]}, 'status':'published'}).toArray(function (err, items) {
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.type('application/json');

                  pieces.nearby = items;
                  var rtn  = JSON.stringify(pieces);
                  //console.log(rtn);
                  res.send(rtn);
                  //res.json(items);
                });

            });
        }

      }else{

        //Find Nearby Pieces
        db.collection('pieces').find({loc: {'$near':[lng,lat]}, 'status':'published'}).toArray(function (err, items) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.type('application/json');
          var rtn  = JSON.stringify(items);
          //console.log(rtn);
          res.send(rtn);
          //res.json(items);
        });

      }
      

    });
    /*
    */

    //console.log(rtn);
    //res.json(pieces);
  });
});

module.exports = router;
