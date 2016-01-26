var dbconn = require('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var MySqlOperator = require('../database/MySqlOperator');
var dboper = new MySqlOperator(dbconn);

var BooksDao = function () {
    this.tableName ='books'; 
}

BooksDao.prototype.queryById = function *( bookId) {
    var rs = yield dboper.select ( this.tableName, { bookid: bookId } );
    return ( rs.length>0 ? rs[0] : null ); 
};

BooksDao.prototype.queryBook = function *( arg ) {
    var rs; 
    if ( arg.cip ) {
        rs = yield dboper.select ( this.tableName, { cip: arg.cip } );
    }
    else if ( arg.isbn ) {
        rs = yield dboper.select ( this.tableName, { isbn: arg.isbn } );
    }
    else {
    }
    return ( rs && rs.length>0 ? rs[0] : null ); 
};

BooksDao.prototype.insert = function * ( args) {
   // bookid, isbn, icp, coverurl, author, publisher, publisheddate,
   if ( !args.createddttm ) {
       args.createddttm = new Date(); 
   } 
   
   var ok = yield dboper.insert ( this.tableName, args );
   if ( ok == 0 ) {
        return args;
    } else {
        return null;
    }
    
};

BooksDao.prototype.update = function * ( bookId, args) {
    yield dboper.update ( this.tableName, args );
};


BooksDao.prototype.search = function *( byWhat, keywords, pagenum, pagesize ) {
    pagenum = ( pagenum ? pagenum : 1 ); 
    pagesize = ( pagesize ? pagesize : 20 );
    var sql='SELECT * FROM ' + this.tableName + ' WHERE '
    switch( byWhat) {
        case 'author':
            sql += ' author LIKE \'%' +keywords + '%\'' ;
            break;
        case 'booktitle':
            sql += ' booktitle LIKE \'%' +keywords + '%\'' ;
            break;
        case 'cip':
            sql += ' cip=\'' +keywords + '\'' ;
            break;
        default:
            sql += '1=1';
    }
    
    var sidx = ( pagenum -1) * pagesize, eidx = sidx + pagesize;
    sql += " LIMIT " + sidx + ', ' + eidx; 
    console.log( sql );
    var rs = yield dbhelper.execute (dbconn, sql, null );
    return { rows: rs.rows, pagenum: pagenum, pagesize: pagesize } ;
}

// 只查找学校内的书籍
BooksDao.prototype.searchBySchool = function *( schoolId, byWhat, keywords, pagenum, pagesize ) {
    pagenum = ( pagenum ? pagenum : 1 ); 
    pagesize = ( pagesize ? pagesize : 20 );
    var sql='SELECT * FROM v_latest_schoolbooks WHERE schoolid=? AND '
    switch( byWhat) {
        case 'author':
            sql += " author LIKE concat('%', ?, '%')" ;
            break;
        case 'booktitle':
            sql += " booktitle LIKE concat('%', ?, '%')" ;
            break;
        case 'cip':
            sql += ' cip=?' ;
            break;
        default:
            sql += ' 1=1';
    }
    
    var sidx = ( pagenum -1) * pagesize, eidx = sidx + pagesize;
    sql += " LIMIT " + sidx + ', ' + eidx; 
    console.log( sql );
    var rs = yield dbhelper.execute (dbconn, sql, [ schoolId, keywords ] );
    return { rows: rs.rows, pagenum: pagenum, pagesize: pagesize } ;
}

BooksDao.prototype.findAvailableBooksInSchool = function *( bookId, schoolId ) {
    var qp = { bookid: bookId, schoolid: schoolId };
    var rows = yield dboper.select ( 'v_latest_schoolbooks', qp ); 
    return rows;
}

module.exports = new BooksDao();
