var dbconn = require('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var MySqlOperator = require('../database/MySqlOperator');
var dboper = new MySqlOperator(dbconn);
var uuid = require( 'uuid');

var UserSchoolDao = function () {
    this.tableName = 'userschool';
};

UserSchoolDao.prototype.getUserSchoolRecs = function *( userId ) {
    var qp = { userid: userId };
    var rows = yield dboper.select( this.tableName, qp, 'start DESC' );
    return rows;
};

UserSchoolDao.prototype.addUserSchool = function *( userId, schoolId, startDate, gradeNo, classNo ) {
    var qp = { userid: userId, schoolid: schoolId, startdate: startDate, gradeno: gradeNo, classno: classNo };
    var res = yield dboper.insert( this.tableName, qp );
    return res;
};

module.exports = new UserSchoolDao();




