var dbconn = require('../database/mysql').connection;
var dbhelper = require( '../database/mysql_helper');
var MySqlOperator = require('../database/MySqlOperator');
var dboper = new MySqlOperator(dbconn);
var uuid = require( 'uuid');

var BookCommentDao = function () {
    this.tableName='bookcomments'
};

BookCommentDao.prototype.addComment = function *( userId, bookId, commenttext, otherArgs ) {
    var param =  { userid: userId, commentcontent: commenttext, createddttm: new Date(), bookid: bookId };
    param.cmtlevel =99 ;
    param.commentid = uuid.v4(); 
    param.praisecount=0;
    param.opposecount=0;
    if ( !otherArgs )
        otherArgs = {};
    
    if ( !otherArgs.nickname || !otherArgs.photourl ) {
        var userdao = require('./AppUserDao');
        var userinfo = yield userdao.getUser( { userid: userId } );
        otherArgs.nickname = userinfo.nickname;
        otherArgs.photourl = userinfo.photourl;
    }
    param.nickname = otherArgs.nickname;
    param.photourl = otherArgs.photourl; 
    
    var r = yield dboper.insert( this.tableName, param );
    if ( r==0 )
        return param;
    else
        return null;
};

BookCommentDao.prototype.getComments = function *( bookId, pagenum, pagesize ) {
    var param = { bookid: bookId }; 
    var ob = ' cmtlevel ASC, createddttm DESC'; 
    var rs = yield dboper.select( this.tableName, param, ob, pagenum, pagesize );  
    return rs;
};

BookCommentDao.prototype.deleteComment = function * ( cmtId ) {
    var valparam = { cmtlevel: -1 };
    var whereparam = { commentid: cmtId };
    yield dboper.update( this.tableName, valparam, whereparam ); 
};

BookCommentDao.prototype.updateCount = function *( cmtId, which, num ) {
    var sql="UPDATE bookcomments SET "; 
    if ( which == 'praise' )
        sql+= ' praisecount= praisecount+ ' + num;
    else if ( which == 'oppose' )
        sql+= ' opposecount= opposecount+ ' + num;
    else
        return -1; 
    
    sql += " WHERE commentid=? ";
    yield dbhelper.execute(dbconn, sql, [ cmtId ] );
    return 0;
    
}
        
module.exports = new BookCommentDao();


