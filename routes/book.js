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

router.get('/addBook.ejs', function(req, res, next) {
    res.render( 'book/addBook.ejs');
  } );

router.get('/queryBook.ejs', function(req, res, next) {
    res.render( 'book/queryBook.ejs');
  } );

router.all('/addBook',  function ( req, res ) {
    var rpjson = req.jsonData ;
    var userdata = rpjson.userinfo; 
    var args = rpjson.bizdata;  ;
    
    if ( !args.cip ) {
        return { errCode: -101, result: 'no CIP' };
    }
    co(function*(){
        try{
            var vq = yield usersession.validate( userdata.userid, userdata.sessionid ); 
            var isopen = ( args.isopen ? args.isopen : 1 );
            if ( vq.errCode != 0 ) {
                res.json ( vq ); 
            } else {
                var book = new Book( { bookid: args.bookid } );
                if ( !args.bookid ) {
                    yield book.addBook ( args ); 
                    console.log( 'new book', book );
                    if ( !book.bookid ) {
                        return { errCode: -100, result: 'create book failed' };
                    }
                } 
                
                var rec = yield userbooksdao.addUserBook( userdata.userid, book.bookid, isopen );
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
    var bookid = args.bookid, pagenum=(args.pagenum ? args.pagenum : 1) , pagesize=( args.pagesize ? args.pagesize :20 ); 
     co(function*(){
        var book = new Book();
        yield book.getBook( bookid ); 
        var cmts = yield bookcmtdao.getComments( bookid, pagenum, pagesize );
        var comments = { pagenum : pagenum,  pagesize : pagesize, rows: cmts };
        book.comments = comments;
        
        res.json( { errCode: 0, result: 'ok', value: book } );
    } );
});

router.all('/searchBook', function(req, res) {
    var args = req.jsonData ;
    console.log( 'search book arg:', args );
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

router.all('/viewComments.ejs', function(req, res) {
    var args = req.jsonData;
    /*
    var bookid = args.bookid, pagenum=(args.pagenum ? args.pagenum : 1) , pagesize=( args.pagesize ? args.pagesize :20 ); 
     co(function*(){
        var book = new Book();
        yield book.getBook( bookid ); 
        var cmts = yield bookcmtdao.getComments( bookid, pagenum, pagesize );
        cmts.pagenum = pagenum;
        cmts.pagesize = pagesize;
        book.comments = cmts;
        res.render( 'book/viewComments.ejs', { book: book } )
    } );
    */
   res.render( 'book/viewComments.ejs');
});

router.all('/addBookComment',  function ( req, res ) {
    var rpjson = req.jsonData ;
    var userdata = rpjson.userinfo; 
    var bizdata = rpjson.bizdata;  ;
    
    co(function*(){
        try{
            var vq = yield usersession.validate( userdata.userid, userdata.sessionid ); 
            if ( vq.errCode != 0 ) {
                res.json ( vq ); 
            } else {
                var book = new Book( );
                yield book.getBook( bizdata.bookid );
                if ( !book.bookid ) {
                    return { errCode: -200, result: 'Book does not exist' };
                } 
                var rec = yield book.addComment( userdata.userid, bizdata.commentcontent );  
                if ( rec.commentid ) {
                    res.json ( { errCode: 0, result: 'ok', value: rec } );
                } else {
                    res.json ( { errCode: -220, result: 'failed' } );
                }
            }
        }catch(e){
            console.log(e);
        }
    } );
} );


module.exports = router;
