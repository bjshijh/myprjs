var bizdao = require('../dao/BorrowRequestDao');

var BorrowRequestBiz = function () {}

BorrowRequestBiz.prototype.findBorrowRecords = function *( userId, fromDate, ticketStatus,  pageNum, pageSize ) {
    var rows = yield bizdao.findByBorrower( userId, fromDate, ticketStatus, pageNum, pageSize ); 
    return rows;
}


module.exports = new BorrowRequestBiz();

