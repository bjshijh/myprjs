var express = require('express');
var router = express.Router();
var fs = require('fs');
var ftcomm = require('ftcommon');
var co = require('co');

var AppUser = require( '../model/AppUser');
var Book = require( '../model/Book');
var userbooksdao = require('../dao/UserBooksDao'); 
var usersession = require( '../model/UserSession');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render( 'user/login.ejs');
  } );

router.all('/register',  function ( req, res ) {
    var args = req.jsonData ;
    console.log( 'register', args);
    co(function*(){
        try{
            if ( !args.email && !args.nickname ) {
                res.json( { errCode: -2, result: 'Nickname, email and password can be null' } );
            };
            
            var user = new AppUser();
            user = yield user.addUser( args );
            if ( user )
                res.json( { errCode: 0, result: 'ok', value: user } );
            else
                res.json( { errCode: -3, result: 'registration error', value: null } );
        }catch(e){
            console.log(e);
        }
    } );
} );

router.all('/login',  function ( req, res ) {
    var args = req.jsonData, retval ;
    console.log( 'login', args );
    co(function*(){
        try{
            var user = new AppUser();
            yield user.getUser( args.userid );
            console.log( user, args.apppassword );
            if ( user && user.apppassword=== args.apppassword) {
                var ss = yield usersession.refreshSession( user.userid, args );
                retval = { errCode: 0, value: 'ok', value: ss }; 
            } else {
                retval = { errCode: -1, value: 'login failed' } ;
            };
            res.json( retval);
        }catch(e){
            console.log(e);
        }
    } );
} );

router.all('/login2',  function ( req, res ) {
    var args = req.jsonData, retval ;
    co(function*(){
        try{
            var ss = yield usersession.getSession ( args.userid );
            if ( ss && ss.sessionid === args.sessionid ) {
                var ss = yield usersession.updateSession( args.userid, args );
                retval = { errCode: 0, value: 'ok', value: ss }; 
            } else {
                retval = { errCode: -1, value: 'session expired. please re-login' } ;
            };
            res.json( retval);
        }catch(e){
            console.log(e);
        }
    } );
});

router.all('/mybooks',  function ( req, res ) {
    var args = req.jsonData, retval=[] ;
    co(function*(){
        try{
            var vq = yield usersession.validate( args.userid, args.sessionid ); 
            if ( vq.errCode != 0 ) {
                res.json ( vq ); 
            } else {
                var user = new AppUser ( { userid: args.userid } );
                var books = yield user.getMyBooks( args.pagenum, args.pagesize );
                for ( var i=0; i<books.length; i++) {
                    var book = new Book();
                    yield book.getBook( books[i].bookid ); 
                    book.createddttm = books[i].createddttm; 
                    retval.push( book ); 
                }
                res.json( retval );
            }
        }catch(e){
            console.log(e);
        }
    } );
} );


module.exports = router;
