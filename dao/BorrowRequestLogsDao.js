var dbconn = require('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var MySqlOperator = require('../database/MySqlOperator');
var dboper = new MySqlOperator(dbconn);
var uuid = require( 'uuid');
var bizConst = require('../common/bizConstants');

// borrowrecordid varchar(40) PK, userid varchar(40) PK , logdttm datetime PK , actionid int(11) , comments, logid varchar(40)
function BorrowRequestLogsDao() {
    this.tableName='borrowrequestlogs';
}

BorrowRequestLogsDao.prototype.log = function *( borrowrecordId, userId, actionId ) {
    console.log('xxxxxxxxxxxxxxxxxx');
    yield dboper.insert( this.tableName, { borrowrecordid: borrowrecordId, userid: userId, actionid: actionId, logdttm: new Date(), logid: uuid.v4() } );
}

BorrowRequestLogsDao.prototype.queryLog= function *(borrowrecordId) {
    var rows = dboper.select( this.tableName, {borrowrecordid: borrowrecordId} );
    return rows;
}

module.exports = new BorrowRequestLogsDao ();