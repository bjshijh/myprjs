var express = require('express');
var router = express.Router();
var fs = require('fs');
var ftcomm = require('ftcommon');
var co = require('co');

var AppUser = require( '../model/AppUser');
var usersession = require( '../model/UserSession');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('This is default page for /user.');
  } );

router.all('/login',  function ( req, res ) {
    var args = req.jsonData, retval ;
    co(function*(){
        try{
            var user = new AppUser();
            yield user.getUser( args.userid );
            if ( user && user.password=== user.apppassword) {
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
            var ss = yield session.getSession ( args.userid );
            if ( ss && ss.sessionid === args.sessionid ) {
                var ss = yield usersession.updateSession( user.userid, args );
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
    var args = req.jsonData, retval ;
    co(function*(){
        try{
            var vq = usersession.validate( args.userid, args.sessionis ); 
            if ( vq.errCode != 0 ) {
                res.json ( vq ); 
            } else {
                var user = new AppUser ( { userid: args.userid } );
                var books = user.getMyBooks( args.pagenum, args.pagesize );
                res.json( books );
            }
        }catch(e){
            console.log(e);
        }
    } );
} );

module.exports = router;
