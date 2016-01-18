var express = require('express');
var router = express.Router();
var fs = require('fs');
var ftcomm = require('ftcommon');

/* GET home page. */
router.get('/', function(req, res, next) {
  if ( ftcomm.isDebugEnv() ) {
    res.send('This is debug environment.');
  }
  else {
    res.send('This is production environment.');
  }
  res.end();
});

router.get('/fruitAnnounce', function(req, res){
  res.redirect('http://www.zhongledp.tv/intro/fruit/index.html')
});

module.exports = router;
