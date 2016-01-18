var session = require( '../model/UserSession');
var bookdao = require( '../dao/BookDao');

exports.bookList= function * ( args) {
    var svalid; 
    if ( args.userid && args.sessionid ) {
        valid = yield session.validate ( args.userid, args.sessionid ); 
        if ( svalid.errCode != 0 ) {
            return svalid;
        }
        
        
    } else {
        return { errCode : -1, result :'user not logged in' };
    }
    
}