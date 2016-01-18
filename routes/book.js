var express = require('express');
var router = express.Router();
var fs = require('fs');
var ftcomm = require('ftcommon');
var co = require('co');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('This is default page for /book.');
  } );

router.all('/userBookList', function(req, res) {
	var args = req;
	message.messageList(args, result.response(req, res));
});

router.all('/updateMessageStatus', function(req, res) {
	var args = req.jsonData;
	message.updateMessageStatus(args, result.response(req, res));
});

router.all('/operate', function(req, res) {
    co(function*(){
       try{
            var args = req.jsonData;
            var ret = yield message.operate(args);
            res.json(ret);
       }catch(e){
              console.log(e);
       }
    });
});

module.exports = router;
