var dbconn = require('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var MySqlOperator = require('../database/MySqlOperator');
var dboper = new MySqlOperator(dbconn);
var uuid = require( 'uuid');

var UserBooksDao = function () {
    this.tableName ='userbooks';
};

UserBooksDao.prototype.getUserBooks = function *( userId, pagenum, pagesize ) {
  var rows = yield dboper.select( this.tableName, { userid: userId }, 'createddttm DESC', pagenum, pagesize );
  return rows;
};

UserBooksDao.prototype.addUserBook= function *( userId, bookId, isOpen) {
    var rec = { userid: userId, bookid: bookId, isopen: isOpen, createddttm: new Date(), bookstatus: 1 };
    var res = yield dboper.insert ( this.tableName, rec ); 
   
    return res; 
};

UserBooksDao.prototype.updateUserBookStatus = function * ( userId, bookId, isOpen ) {
    var where = { userid: userId, bookid: bookId }, val = { isopen: isOpen, createddttm: new Date() };
    yield dboper.update ( this.tableName, val, rec ); 
    return val;
}

UserBooksDao.prototype.removeUserBook = function * ( userId, bookId ) {
    var where = { userid: userId, bookid: bookId }, val = { bookstatus: 0, createddttm: new Date() };
    yield dboper.update ( this.tableName, val, rec ); 
    return val;
};

UserBooksDao.prototype.getBookOwners= function *( bookId) {
    var where = { bookid: bookId }; 
    var rs = yield dboper.select( this.tableName, where );
    return rs;
}

module.exports = new UserBooksDao ();