var redisco = require( '../database/redisco');
var redis = redisco.redis;

var UserSessionDao = function () {}

UserSessionDao.prototype.getKey = function ( userId ) {
    return 'session~' + userId; 
}

UserSessionDao.prototype.getSession = function * ( userId ) {
    var key = this.getKey( userId );
    var kvs = yield redis.hgetall( key );
    return kvs;
};

UserSessionDao.prototype.setSession = function *( userId, args ) {
    var key = this.getKey( userId );
    var kvs = [ key ];
    for ( p in args ) {
        kvs.push ( p);
        kvs.push ( args[p] );
    }
    yield redisco.execute ( 'hmset', kvs );
};

module.exports = new UserSessionDao ();