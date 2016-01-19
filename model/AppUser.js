var lang = require('../common/lang');
var dao = require( '../dao/AppUserDao');
var booksdao = require('../dao/BooksDao');

var AppUser = function (arg) {  
    if ( arg )
        lang.mixin(this, arg); 
};

AppUser.prototype.getUser = function *( userkey ) {
    var user = null;
    if ( userkey.indexOf('@')>=0 )  {  // email
        user = yield dao.getUser( { email: userkey} );
    } else {
        user = yield dao.getUser( { userid: userkey} );
    }
    if ( user ) {
        lang.mixin ( this, user );
    }
};

AppUser.prototype.addUser = function *( args ) {
    var user = yield dao.insertUser ( args );
    if ( user)
        lang.mixin ( this, user );
};

AppUser.prototype.getMyBooks = function *( pagenum, pagesize ) {
    var rows = yield booksdao.getUserBooks ( this.userid, pagenum, pagesize ); 
    return rows;
};

module.exports = AppUser;