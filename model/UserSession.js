var sessiondao = require( '../dao/UserSessionDao');
var lang = require( '../common/lang');
var uuid = require( 'uuid');

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

UserSession.prototype.refreshSession = function *( userId, otherArgs ) {
    var sessionId = uuid.v4();
    var args = { sessionid: sessionId, updateddttm : (new Date()).getTime() };
    args.deviceid= otherArgs.deviceid;
    args.devicetype= otherArgs.devicetype;
    
    args.userid = userId; 
    yield sessiondao.setSession( userId, args );
    return args;
}

UserSession.prototype.updateSession = function *( userId, otherArgs ) {
    var args = { updateddttm : new Date() };
    args.deviceid= otherArgs.deviceid;
    args.devicetype= otherArgs.devicetype;
        
    yield sessiondao.setSession( userId, args );
    return args;
}

module.exports = new UserSession ();
