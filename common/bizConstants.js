module.exports= {
    BizType_Borrow : 0,
    BizType_Lend : 1,
    BizType_Exchange : 2, 
    
    BizTicket_ACTION_BORROWER_CREATE: 1,
    BizTicket_ACTION_OWNER_APPROVE: 2,
    BizTicket_ACTION_OWNER_CONFIRM_DELIVERY: 3,
    BizTicket_ACTION_BRROWER_CONFIRME_DELIVERY: 4,
    BizTicket_ACTION_BORROWER_CANCEL: 5,
    BizTicket_ACTION_OWNER_DISAPPROVE: 6,
    
    BizTicket_ACTION_BORROWER_CONFIRME_RETURN: 1,
    BizTicket_ACTION_LENDER_CONFIRME_RETURN: 2,
    
    BizTicketStatus_BORROW_FAILED : 0,
    BizTicketStatus_BORROW_INPROCESS: 1,
    BizTicketStatus_BORROW_DELIVERIED : 2,
    BizTicketStatus_BORROW_RETURNED : 4,
    BizTicketStatus_BORROW_CANCELED : -1,
    
    BizTicketStatus_LEND_INPROCESS : 1,
    BizTicketStatus_LEND_DELIVED : 2,
    BizTicketStatus_LEND_RERURNED : 4
}