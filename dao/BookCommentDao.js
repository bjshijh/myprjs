var dbconn = requrie('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var dboper = require('../database/DbOper')(dbconn);
var uuid = require( 'uuid');

var BookCommentDao = function () {
    this.tableName='BookComments'
};

BookCommentDao.prototype.addComment = function *( userid, bookId, commenttext ) {
    var param =  { appuserid: userid, commentcontent: commenttext, createddttm: new Date(), bookid: bookId };
    param.cmtlevel =99 ;
    param.commentid = uuid.v4(); 
    yield dboper.insert( this.tableName, param );
    return param;
};

BookCommentDao.prototype.getComments = function *( bookId, pagenum, pagesize ) {
    var param = { bookid: bookId }; 
    var ob = ' cmtlevel ASC, createddttm DESC'; 
    var rs = yield dboper.select( this.tableName, param, ob, pagenum, pagesize );  
    return rs.rows;
};

BookCommentDao.prototype.deleteComment = function * ( cmtId ) {
    var valparam = { cmtlevel: -1 };
    var whereparam = { commentid: cmtId };
    yield dboper.update( this.tableName, valparam, whereparam ); 
};

module.exports = new BookCommentDao();


