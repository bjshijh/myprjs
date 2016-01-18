var dbconn = requrie('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var dboper = require('../database/DbOper')(dbconn);

var BooksDao = function () {
    this.tableName ='books'; 
}

BooksDao.prototype.queryById = function *( bookId) {
    var rs = yield dboper.select ( this.tableName, { bookid: bookId } );
    return ( rs.rows.length>0 ? rs.rows[0] : null ); 
};

BooksDao.prototype.insert = function * ( args) {
   // bookid, isbn, icp, coverurl, author, publisher, publisheddate,
   if ( !args.createddttm ) {
       args.createddttm = new Date(); 
   } 
   
   yield dboper.insert ( this.tableName, args );
};

BooksDao.prototype.update = function * ( bookId, args) {
    yield dboper.update ( this.tableName, args );
};

BooksDao.prototype.search = function *( byWhat, keywords, pagenum, pagesize ) {
    pagesize = ( pagesize ? pagesize : 20 );
    var sql='SELECT * FROM ' + this.tableName + ' WHERE '
    switch( byWhat) {
        case 'author':
            sql += ' author LIKE \'%' +keywords + '%\'' ;
            break;
        case 'title':
            sql += ' booktitle LIKE \'%' +keywords + '%\'' ;
            break;
    }
    
    var sidx = ( pagenum -1) * pagesize, eidx = sidx + pagesize;
    sql += " LIMIT " + sidx + ', ' + eidx; 
    
    var rs = yield dbhelper.execute( dbconn, sql, null );
    return rs;
}

module.exports = new BooksDao();




