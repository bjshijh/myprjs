var mysql = require( '../database/mysql');
var conn = mysql.connection;
var dbhelper= require('../database/mysql_helper');
var co = require('co');
var MySqlOperator = require( '../database/MySqlOperator');
var db = new MySqlOperator ( conn );

var rs, rsupd; 
co ( function *() {
    try {
    var tabname ='books', where={ icp: '2013258737' }, ob= 'publisher DESC', pagesize=10, pagenum=1;
    rs = yield db.select( tabname, where );
    console.log( rs );
    rsupd = yield db.update( tabname, { createddttm: new Date() }, { bookid: '38606088-bd88-11e5-914e-68f728b4a9b2'} );
    console.log( rsupd  );
} catch(ex) {
    console.log( ex );
}
})
