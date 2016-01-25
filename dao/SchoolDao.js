var dbconn = require('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var MySqlOperator = require('../database/MySqlOperator');
var dboper = new MySqlOperator(dbconn);
var uuid = require( 'uuid');

var SchoolDao = function () {
    this.tableName = 'schools';
};

SchoolDao.prototype.addSchool = function *( schoolName ) {
    var schoolid = uuid.u4();
    var qp = { schoolid: schoolid, schoolname: schoolName, schoolstatus: 0 };
    var res = yield dboper.insert( this.tableName, qp  );
    return res;
}

SchoolDao.prototype.getSchool = function *( schoolId ) {
    var qp = { schoolid: schoolId };
    var rows = yield dboper.select( this.tableName, qp  );
    if ( rows && rows.length>0 )
        return rows[0];
    else
        return null;
}

SchoolDao.prototype.querySchoolByName = function *( schoolName, pagenum, pagesize ) {
    if ( !pagenum ) pagenum =1;
    if ( !pagesize) pagesize =20; 
    
    var sql='SELECT * FROM ' + this.tableName + " WHERE schoolstatus=1 AND schoolname LIKE CONCAT('%', ?, '%') ORDER BY schoolname";
    var sidx = ( pagenum -1) * pagesize, eidx = sidx + pagesize;
    sql += " LIMIT " + sidx + ', ' + eidx; 
    try {
        var rows = yield dbhelper.execute( dbconn, sql, [ schoolName ]  );
        return rows;
    } catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = new SchoolDao();