var dbconn = require('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var MySqlOperator = require('../database/MySqlOperator');
var dboper = new MySqlOperator(dbconn);
var uuid = require( 'uuid');

var AppUserDao = function () {
    this.tableName= 'appusers';
}

AppUserDao.prototype.getUser = function *( arg ) {
    var rs = null;
    if ( arg.userid ) {
        rs = yield dboper.select( this.tableName, {userid: arg.userid }, null ); 
    } else if ( arg.email) {
        rs = yield dboper.select( this.tableName, {email: arg.email }, null ); 
    }   
    return ( rs && rs.length>0 ? rs[0] : null );
};

AppUserDao.prototype.updateUser = function *( userId, arg ) { 
    yield dboper.update( this.tableName, arg, { userid: userId } ); 
};

AppUserDao.prototype.insertUser = function *( arg ) { 
    if ( !arg.appuserid ) {
        arg.userid = uuid.v4();
    };
    if ( !arg.isopen )
        arg.isopen =1;
    if ( !arg.gender )
        arg.gender = -1;
        
    arg.createddttm = new Date();
    var res = yield dboper.insert( this.tableName, arg ); 
    if ( res ==0 )
        return arg;
    else
        return null; 
};

AppUserDao.prototype.deleteUser = function *( userId ) { 
    yield dboper.delete( this.tableName, { userid : userId } ); 
};

module.exports = new AppUserDao();