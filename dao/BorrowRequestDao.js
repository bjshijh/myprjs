var dbconn = require('../database/mysql').connection;
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

BorrowRequestDao.prototype.findByBorrower = function *( userId, fromDate, ticketStatus, pageNum, pageSize ) {
    var fd = ( fromDate ? fromDate : new Date( '2010-01-01' ) );
    var sql="SELECT a.ownerid, b.nickname, b.email, b.photourl, a.bookid, b.booktitle, b.cip, b.author, b.publisher, a.createddttm, a.fromdate, a.forecastedreturndate,"
        + " a.ownerapproved, a.requestconfirmed, a.returnconfirmed, a.comments "
        +" FROM schoollibrary.borrowrequests a INNER JOIN schoollibrary.v_latest_schoolbooks b ON a.bookid=b.bookid "
        + " WHERE a.borrowerid=? AND a.createddttm>= ?";

    // ticketStatus: 1- ownerapproved=0 or ( ownerapproved=1 and requestconfirmed < 2 )
    // ticketStatus: 2- ownerapproved=1 and requestconfirmed=2 and returnconfirmed <2 
    // ticketStatus: 4- ownerapproved=1 and requestconfirmed=2 and returnconfirmed=2
    
    var statussql=""; 
    switch( ticketStatus) {
        case 1:
            statussql=" AND ( a.ownerapproved OR ( a.ownerapproved=1 and a.requestconfirmed < 2 ) )";
            break;
        case 2:
            statussql=" AND ( a.ownerapproved=1 and a.requestconfirmed=2 and a.returnconfirmed <2 )";
            break;
        case 4:
            statussql=" AND ( a.ownerapproved=1 and a.requestconfirmed=2 and a.returnconfirmed =2 )";
            break;
        default:
    }
    
    sql += statussql;
    var psize= (pageSize ? pageSize : 20 ), startIdx = ( pageNum ? pageNum-1 : 0)*psize;
    sql += " LIMIT " + startIdx + ", " + psize; 
    
    var qp = [ userId, fd ];
    var rs = yield dboper.executeSql( sql, qp );
    if ( rs && rs.rows )
        return rs.rows;
    else
        return null;
};

BorrowRequestDao.prototype.findByOwner = function *( userId, fromDate, ticketStatus ) {
    var fd = ( fromDate ? fromDate : new Date( '2010-01-01' ) );
    var sql="SELECT a.*, b.startdate schooldate, b.schoolid, b.gradeno, b.classno "
        +" FROM borrowrequests a INNER JOIN v_latest_userschool b ON a.ownerid=b.userid "
        + " WHERE a.ownerid=? AND a.createddttm>= ?";

    var qp = [ userId, fd ];
    var rs = yield dboper.executeSql( sql, qp );
    if ( rs && rs.rows )
        return rs.rows;
    else
        return null;
};

module.exports = new BorrowRequestDao();