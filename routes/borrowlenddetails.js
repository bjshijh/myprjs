var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var ftcomm = require('ftcommon');
var co = require('co');
var formidable = require('formidable');
var util = require('util');

var AppUser = require( '../model/AppUser');
var brBiz = require( '../model/BorrowRequestBiz');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render( 'login');
  } );

router.all('/query', function(req, res) {
    var args = req.jsonData ;
    var user = new AppUser();
    co ( function *() {
        yield user.getUser( args.userid );
        if ( !user ) 
            res.json( { errCode:-1, result: 'user does not exist'} );
            return;
        
        var qresult; 
        if (!args.fromdate)
            args.fromdate = new Date('2010-01-01'); 
        
        // 查找: 
        if ( args.biztype ==0 ) { // 借书记录
            qresult = yield queryBorrowDetails( args ); 
        
        res.json( { errCode:0,  result: '0k', value: qresult} );
    } );
  }  );

function * queryBorrowDetails(  args ) {
    // userId, fromDat, ticketStatus,  pageNum, pageSize
    var rows = yield brBiz.queryDetails( args.userid, args.fromdate, args.ticketstatus,  args.pagenum, args.pagesize ); 
    return rows; 
}

module.exports = router;
