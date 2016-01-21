var dbhelper = require( './mysql_helper'); 

var MySqlOperator = function ( dbconn ) {
    this.connection = dbconn; 
}

function getWhere( whereArg) {
    var where=' ';
    if ( whereArg) {
        where = ' WHERE ' ;
        for ( p in whereArg) {
            where += p + '= :' + p + ' AND ';
        }
        where = where.substr( 0, where.length-4);
    };
    return where; 
} ;
function getWhere2( whereArg) {
    var where=' ';
    if ( whereArg) {
        where = ' WHERE ' ;
        for ( p in whereArg) {
            where += p + '= ? AND ';
        }
        where = where.substr( 0, where.length-4);
    };
    return where; 
} ;

MySqlOperator.prototype.select = function * ( tableName, whereArg, orderArg, pagenum, pagesize ) {
    var sql='SELECT * FROM ' + tableName, where, orderby ;
    where = getWhere( whereArg);
    sql += where; 
    var psize = ( pagesize ? pagesize : 20 ), pnum;
 
    if ( orderArg) {
        orderby = ' ORDER BY ' + orderArg; 
        sql += orderby;
    };

    pnum = ( pagenum ? pagenum : 1 );
    sidx = ( pnum -1 )* psize;
    sql += ' LIMIT ' + sidx + ', ' + psize; 
    try {
        console.log(sql, whereArg);
        var rs = yield dbhelper.execute( this.connection, sql, whereArg ); 
        return rs.rows;
    } catch(e) {
        console.log(e);
        return -1;
    }
};

MySqlOperator.prototype.insert = function * ( tableName, arg) {
    var sql='INSERT INTO ' + tableName, fld=' (', val=' VALUES (';
    try {
        for ( p in arg ) {
            fld += p + ',';
            val += ':' + p + ',';
        }
        fld= fld.substr( 0, fld.length -1 ) + ')';
        val= val.substr( 0, val.length -1 ) + ')';
        sql += fld + val; 
        console.log( sql, arg );
        var rs= yield dbhelper.execute( this.connection, sql, arg ); 
        return 0;
    } catch (e) {
        console.log(e);
        return -1;
    }
};

MySqlOperator.prototype.update = function * ( tableName, valArg, whereArg ) {
    var sql='UPDATE ' + tableName, fld=' SET ', params=[];
    for ( p in valArg ) {
        fld += p + '= ?,';
        params.push ( valArg[p] ); 
    }
    fld= fld.substr( 0, fld.length -1 );
    sql += fld; 
    
    var where =getWhere2( whereArg ); 
    sql += where; 
    for ( p in whereArg ) {
        params.push( whereArg[p]);
    }
    
    try {
        var rs= yield dbhelper.execute( this.connection, sql, params ); 
        return 0;
    } catch (e) {
        console.log(e);
        return -1;
    }
}

MySqlOperator.prototype.delete = function *( tableName, whereArg) {
    var sql='DELETE FROM ' + tableName;
    var where = getWhere( whereArg );
    sqk += where;
    try {
        yield dbhelper.execute( this.connection, sql, whereArg ); 
        return 0;
    } catch(e) {
        console.log(e);
        return -1;
    }
};

MySqlOperator.prototype.search = function * ( tableName, field, kw, orderArg, pagenum, pagesize ) {
    var sql='SELECT * FROM ' + tableName + ' WHERE ' + field + ' LIKE \'%' + kw + '%\''
    if ( orderArg) {
        orderby = ' ORDER BY ' + orderArg; 
        sql += orderby;
    };

    var psize = ( pagesize ? pagesize : 20 );
    pnum = ( pagenum ? pagenum : 1 );
    sidx = ( pnum -1 )* psize;
    sql += ' LIMIT ' + sidx + ', ' + psize; 
    var rs = yield dbhelper.execute( this.connection, sql, null ); 
    return rs.rows;
};

module.exports = MySqlOperator;
