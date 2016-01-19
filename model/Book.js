var lang = require('../common/lang');
var dao = require('../dao/BooksDao');
var cmtdao = require('../dao/BookCommentDao');
var userbooksdao = require( '../dao/UserBooksDao');
var uuid = require( 'uuid' );


var Book = function ( args ) {
    lang.mixin( this, args);
};

Book.prototype.getBook = function *( bookId ) {
    var book = yield dao.queryById( booId );
    lang.mixin ( this, book );
};

Book.prototype.addBook = function *( args ) {
    if ( !args.bookid ) {
        args.bookid = uuid.v4();
    }
    var res = yield dao.insert ( args  );
    if (res==0)
        lang.mixin ( this, book );
};

Book.prototype.addComment = function * ( userId, content ) {
    return cmtdao.addComment( userId, this.bookid, content ); 
};

Book.searchBook = function *( byWhat, keyword, pagenum, pagesize) {
    var rs = yield dao.search( byWhat, keyword, pagenum, pagesize );
    return rs;
};

Book.getBookOwners = function *( bookId ) {
    var rs = yield userbooksdao.getBookOwners( bookId );
    return rs;
};

module.exports = Book;
