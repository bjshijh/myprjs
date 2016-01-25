var express = require('express');
var router = express.Router();
var ftcomm = require('ftcommon');
var co = require('co');

var usersession = require( '../model/UserSession');
var schooldao = require('../dao/SchoolDao');
var userschooldao = require( '../dao/UserSchoolDao'); 

router.all('/querySchool',  function ( req, res ) {
    var qp = req.jsonData ;
    var sn =  qp.schoolname ;
    co(function*(){ 
        var rows = yield schooldao.querySchoolByName( sn, qp.pagenum, qp.pagesize );
        res.json( { errCode:0, result:'ok', value: rows } ); 
    } );
} );

router.all('/addSchool',  function ( req, res ) {
    var args = req.jsonData ;
    co(function*(){ 
        var rs = yield schooldao.addSchool( args.schoolname );
        if ( rs == 0)
            res.json( { errCode:0, result:'ok'});
        else
            res.json( { errCode:0, result:'add school failed'});
    } );
} );

router.all('/addStudent',  function ( req, res ) {
    var args = req.jsonData ;
    var userinfo = args.userinfo, bizdata = args.bizdata; 
    co(function*(){ 
        var vq = yield usersession.validate( userinfo.userid, userinfo.sessionid ); 
        if ( vq.errCode != 0 ) {
            res.json ( vq ); 
            return;
        }
        var uexp = yield userschooldao.getUserSchoolRecs( userinfo.userid ); 
        var rs = yield userschooldao.addUserSchool( userinfo.userid, bizdata.schoolid, bizdata:startdate, bizdata: gradeno, bizdata: classno );
        if ( rs == 0)
            res.json( { errCode:0, result:'ok'});
        else
            res.json( { errCode:0, result:'add school failed'});
    } );
} );

module.exports = router;