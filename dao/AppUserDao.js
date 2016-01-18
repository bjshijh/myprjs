var dbconn = requrie('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var dboper = require('../database/MySqlOperator')(dbconn);
var uuid = require( 'uuid');

var AppUserDao = function () {
    this.tableName= 'appusers';
}

AppUserDao.prototype.getUser = function *( arg ) {
    var rs = null;
    if ( arg.userid ) {
        rs = yield dboper.select( this.tableName, {userid: arg.userId }, null ); 
    } else if ( arg.email) {
        rs = yield dboper.select( this.tableName, {email: arg.email }, null ); 
    }   
    return ( rs && rs.rows.length>0 ? rs.rows[0] : null );
};

AppUserDao.prototype.updateUser = function *( userId, arg ) { 
    yield dboper.update( this.tableName, arg, { userid: userId } ); 
};

AppUserDao.prototype.insertUser = function *( arg ) { 
    if ( !arg.appuserid ) {
        arg.userid = uuid.v4();
    }
    yield dboper.insert( this.tableName, arg ); 
};

AppUserDao.prototype.deleteUser = function *( userId ) { 
    yield dboper.delete( this.tableName, { userid : userId } ); 
};

