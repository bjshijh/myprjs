var sessiondao = require( '../database/UserSessionDao');
var lang = require( '../common/lang');

var UserSession = function () {}

UserSession.prototype.getSession = function *( userId ) {
    var prev = yield sessiondao.getSession ( userId );
    return prev; 
};

UserSession.prototype.validate = function *( userId, sessionId ) {
    var prev = yield this.getSession ( userId );
    if ( prev && prev.sessionid === sessionId )
        return { errCode : 0, result :'ok' };
    else
        return { errCode : -1, result :'invalid session, please log in again' }; 
};

UserSession.prototype.updateSession = function *( userId, sessionId, otherArgs ) {
    var args = { sessionid: sessionId, updateddttm : new Date() };
    lang.mixin( args, otherArgs );
    yield sessiondao.setSession( userId, args );
}