var dao = require( '../dao/AppUserDao');
var lang = require('../common/lang');

var AppUser = function (arg) {  
    if ( arg )
        lang.mixin(this, arg); 
};

AppUser.prototype.getUser = function *( userkey ) {
    var user = null;
    if ( userkey.indexOf('@') )  {  // email
        user = yield dao.getUser( { email: userkey} );
    } else {
        user = yield dao.getUser( { userid: userkey} );
    }
    if ( user ) {
        lang.minxin ( this, user );
    }
};



