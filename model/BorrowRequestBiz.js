var bizConst = require('../common/bizConstants');
var uuid = require('uuid');
var bizdao = require('../dao/BorrowRequestDao');
var bizlogdao = require('../dao/BorrowRequestLogsDao');
var BorrowRequestBiz = function () {
}

BorrowRequestBiz.prototype.queryBorrowRecords = function *( userId, fromDate, ticketStatus,  pageNum, pageSize ) {
    var rows = yield bizdao.findByBorrower( userId, fromDate, ticketStatus, pageNum, pageSize ); 
    return rows;
}

BorrowRequestBiz.prototype.queryLendRecords = function *( userId, fromDate, ticketStatus,  pageNum, pageSize ) {
    var rows = yield bizdao.findByLender( userId, fromDate, ticketStatus, pageNum, pageSize ); 
    return rows;
}

BorrowRequestBiz.prototype.getBorrowRecord = function *( recId ) {
    var rows = yield bizdao.select( { borrowrecordid: recId }); 
    return ( rows ? rows[0] : null);
}

BorrowRequestBiz.prototype.cancelBorrowing = function *( recId, userId ) {
    var res= yield bizdao.update( { requestconfirmed: bizConst.BizTicketStatus_BORROW_CANCELED }, { borrowrecordid: recId } ); 
    yield bizlogdao.log( recId,  userId, bizConst.BizTicket_ACTION_BORROWER_CANCEL ); // borrowrecordId, userId, actionId
    return res;
}
module.exports = new BorrowRequestBiz();

