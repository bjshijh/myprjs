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
var bizConst = require('../common/bizConstants');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render( 'login');
  } );

router.all('/query', function(req, res) {
    var args = req.jsonData ;
    console.log( args );
    
    var user = new AppUser();
    co ( function *() {
        yield user.getUser( args.userid );
        if ( !user ) {
            res.json( { errCode:-1, result: 'user does not exist'} );
            return;
        }
        
        var qresult; 
        if (!args.fromdate)
            args.fromdate = new Date('2010-01-01'); 
        
        // 查找: 
        if ( args.biztype == bizConst.BizType_Borrow ) { // 1 借入记录
            qresult = yield queryBorrowDetails( args );  
        } else if ( args.biztype == bizConst.BizType_Lend ) { // 2 借出记录
            qresult = yield queryLendDetails( args );  
        }
        res.json( { errCode:0,  result: '0k', value: qresult} );
    } );
  }  );

router.all('/cancelBorrowing', function(req, res) {
    var args = req.jsonData ;
    console.log( args );
    
    var user = new AppUser();
    co ( function *() {
        yield user.getUser( args.userid );
        if ( !user ) {
            res.json( { errCode:-1, result: 'user does not exist'} );
            return;
        }
        
        var rec = yield brBiz.getBorrowRecord(  args.borrowrecordid ); 
        if ( !rec) {
            res.json( { errCode: -901, result: '借书记录不存在'} );
            return;
        }
        if ( rec.borrowerid != args.userid ) {
            res.json( { errCode: -902, result: '用户不是借书人'} );
            return;
        }
        
        var result =0; 
        if ( rec.requestconfirmed == 0 ) { // 借书人为未确认借书，可以取消
            result = yield brBiz.cancelBorrowing( args.borrowrecordid, args.userid  );
        } 
        res.json( { errCode: result,  result: '0k', value: null } );
    } );
  }  );


function * queryBorrowDetails(  args ) {
    // userId, fromDat, ticketStatus,  pageNum, pageSize
    var rows = yield brBiz.queryBorrowRecords( args.userid, args.fromdate, args.ticketstatus,  args.pagenum, args.pagesize ); 
    return rows; 
}

function * queryLendDetails(  args ) {
    // userId, fromDat, ticketStatus,  pageNum, pageSize
    var rows = yield brBiz.queryLendRecords( args.userid, args.fromdate, args.ticketstatus,  args.pagenum, args.pagesize ); 
    return rows; 
}

module.exports = router;
