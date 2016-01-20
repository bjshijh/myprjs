var express = require('express');
var router = express.Router();
var fs = require('fs');
var ftcomm = require('ftcommon');
var co = require('co');

var usersession = require( '../model/UserSession');

var AppUser = require( '../model/AppUser'); 
var Book = require('../model/Book'); 
var userbooksdao = require('../dao/UserBooksDao'); 
var bookcmtdao = require( '../dao/BookCommentDao');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('This is default page for /book.');
  } );

router.all('/addBook',  function ( req, res ) {
    var args = req.jsonData ;
    co(function*(){
        try{
            var vq = yield usersession.validate( args.userid, args.sessionid ); 
            var isopen = ( args.isopen ? args.isopen : 1 );
            if ( vq.errCode != 0 ) {
                res.json ( vq ); 
            } else {
                var book = new Book( { bookid: args.bookid } );
                if ( !args.bookid ) {
                    yield book.insert ( args ); 
                    if ( !book.bookid ) {
                        return { errCode: -100, result: 'create book failed' };
                    }
                } 
                
                var rec = yield userbooksdao.addUserBook( args.userid, book.bookid, isopen );
                if ( rec==0 ) {
                    res.json ( { errCode: 0, result: 'ok' } );
                } else {
                    res.json ( { errCode: -200, result: 'failed' } );
                }
            }
        }catch(e){
            console.log(e);
        }
    } );
} );

router.all('/getBook', function(req, res) {
    var args = req.jsonData ;
    var bookid = args.bookid; 
    co(function*(){
        var book = new Book();
        yield book.getBook( bookid ); 
        var pn=1, ps= 20;
        var cmts = yield bookcmtdao.getComments( bookid, pn, ps ); 
        book.comments = { pagenum: pn, pagesize: ps, comments: cmts  }; 
        res.json( { errCode: 0, result: 'ok', value: book } );
    } );
});

router.all('/getBookComments', function(req, res) {
    var args = req.jsonData ;
    var bookid = args.bookid; 
    co(function*(){
        var cmts = yield bookcmtdao.getComments( bookid, args.pagenum, args.pagesize ); 
        var retval = { pagenum: args.pagenum, pagesize: args.pagesize, comments: cmts  }; 
        res.json( { errCode: 0, result: 'ok', value: retval } );
    } );
});

router.all('/searchBook', function(req, res) {
    var args = req.jsonData ;
    co(function*(){
        var books = yield Book.searchBook( args.bywhat, args.keyword, args.pagenum, args.pagesize ); 
        res.json( { errCode: 0, result: 'ok', value: books } );
    } );
});

router.all('/getBookOwners', function(req, res) {
    var args = req.jsonData;
    var bookid = args.bookid; 
     co(function*(){
        var owners = yield Book.getBookOwners ( bookid ); 
        for ( var i=0; i<owners.length; i++ ) {
            var user = new AppUser();
            yield user.getUser( owners[i].userid ); 
            lang.mixin( owners[i], user );
        }
        res.json( owners );
    } );
});



module.exports = router;
