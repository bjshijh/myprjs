var lang = require('../common/lang');
var dao = require( '../dao/AppUserDao');
var booksdao = require('../dao/BooksDao');
var userbooksdao = require('../dao/UserBooksDao'); 
var uuid = require( 'uuid' );

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
    args.userid = null;
    var ex = yield this.getUser( args.email );
    if ( ex.userid ) {
        return { errCode: -1, result: '邮箱已经被使用' };
    }
    args.userid = uuid.v4();
    var user = yield dao.insertUser ( args );
    if ( user)
        lang.mixin ( this, user );
};

AppUser.prototype.getMyBooks = function *( pagenum, pagesize ) {
    var rows = yield userbooksdao.getUserBooks ( this.userid, pagenum, pagesize ); 
    return rows;
};

module.exports = AppUser;