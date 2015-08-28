var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/add-to-newsletter', function(req, res, next) {
  var body = req.body;
      //access_token = body.access_token;


  res.send(body);
});

module.exports = router;
