var dbconn = require('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var MySqlOperator = require('../database/MySqlOperator');
var dboper = new MySqlOperator(dbconn);
var uuid = require('uuid');

var BorrowRequestDao = function () {
    this.tableName ='borrowrequests'; 

}
BorrowRequestDao.prototype.select = function *( args) {
    var rows = yield dboper.select ( this.tableName, args, null );
    if ( rows ==-1 )
        return null;
    else
        return rows;
};

BorrowRequestDao.prototype.insert = function *( args) {
    var now = new Date(); 
    args.createddttm = now;
    args.borrowrecordid = uuid.v4();
    args.updateddttm = now;
    args.ownerapproved = 0;
    
    var rs = yield dboper.insert( this.tableName, args);
    return args;
};

BorrowRequestDao.prototype.delete = function *( borrowRecordId) {
    var rs = yield dboper.delete( this.tableName, { borrowrecordid : borrowRecordId } );
    return rs;
};

BorrowRequestDao.prototype.update = function *( args ) {
    args.updateddttm = new Date();
    var rs = yield dboper.update( this.tableName, args );
    return rs;
};

BorrowRequestDao.prototype.findByBorrower = function *( userId, fromDate ) {
    var fd = ( fromDate ? fromDate : new Date( '2010-01-01' ) );
    var sql="SELECT a.*, b.startdate schooldate, b.schoolid, b.gradeno, b.classno "  
        +" FROM borrowrequests a INNER JOIN v_latest_userschool b ON a.userid=b.userid "  
        + " WHERE a.borrowerid=? AND a.createddttm>= ?";

    var qp = [ userId, fd ];
    var rs = yield dbhelper.execute( dbconn, sql, qp );
    if ( rs && rs.rows )
        return rs.rows;
    else
        return null;
};

BorrowRequestDao.prototype.findByOwner = function *( userId, fromDate ) {
    var fd = ( fromDate ? fromDate : new Date( '2010-01-01' ) );
    var sql="SELECT a.*, b.startdate schooldate, b.schoolid, b.gradeno, b.classno "
        +" FROM borrowrequests a INNER JOIN v_latest_userschool b ON a.userid=b.userid "
        + " WHERE a.ownerid=? AND a.createddttm>= ?";

    var qp = [ userId, fd ];
    var rs = yield dbhelper.execute( dbconn, sql, qp );
    if ( rs && rs.rows )
        return rs.rows;
    else
        return null;
};

module.exports = new BorrowRequestDao();