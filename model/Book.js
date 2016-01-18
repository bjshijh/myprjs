var lang = require('../common/lang');
var dao = require('../dao/BooksDao');
var cmtdao = require('../dao/BookCommentDao');

var Book = function (  ) {
    
};

Book.prototype.getBook = function *( bookId ) {
    var book = yield dao.queryById( booId );
    lang.mixin ( this, book );
};


Book.prototype.addComment = function * ( userId, content ) {
    return cmtdao.addComment( userId, this.bookid, content ); 
};

Book.searchBook = function *( byWhat, keyword, pagenum, pagesize) {
    var rs = yield dao.search( byWhat, keyword, pagenum, pagesize );
    return rs;
};

module.exports = Book;
