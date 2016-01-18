var mysql = require("mysql");
var mysqltransaction = require('node-mysql-transaction');

//export function
function mysql_insert_ret_id(sql_query, conn){
	if(check_parameters_valid(sql_query,conn,"insert"))
		return mysql_query(sql_query,conn, "insert_ret_id");
}
function mysql_insert(sql_query, conn){
	if(check_parameters_valid(sql_query,conn,"insert"))
		return mysql_query(sql_query,conn, "insert");
}
function mysql_select(sql_query, conn){
	if(check_parameters_valid(sql_query,conn,"select"))
		return mysql_query(sql_query,conn, "select");
}
function mysql_del_ret_affected_rows(sql_query,conn){
	if(check_parameters_valid(sql_query,conn,"delete"))
		return mysql_query(sql_query,conn,"del_affected_rows");
}
function mysql_update_ret_changed_rows(sql_query,conn){
	if(check_parameters_valid(sql_query,conn,"update"))
		return mysql_query(sql_query,conn, "update_changed_rows");
}
function mysql_update(sql_query,conn){
	if(check_parameters_valid(sql_query,conn,"update"))
		return mysql_query(sql_query,conn, "update");
}
function mysql_call(sql_query, conn){
		return mysql_query(sql_query,conn, "call");
}

function mysql_select_by_preparing_query(sql_template, template_data, conn){
	sql_query = mysql.format(sql_template, template_data);
	return mysql_select(sql_query, conn,"select");
}

function mysql_call_by_preparing_query(sql_template, template_data, conn){
	sql_query = mysql.format(sql_template, template_data);
	return mysql_call(sql_query, conn,"call");
}

function mysql_delete_by_preparing_query(sql_template, template_data, conn){
	sql_query = mysql.format(sql_template, template_data);
	return mysql_del_ret_affected_rows(sql_query, conn,"del_affected_rows");
}
function mysql_update_by_preparing_query(sql_template, template_data, conn){
	sql_query = mysql.format(sql_template, template_data);
	return mysql_update_ret_changed_rows(sql_query, conn,"update_changed_rows");
}

function check_parameters_valid(sql_query, conn, type){
	if(sql_query == undefined || sql_query == "" || conn == undefined)
		throw TypeError("sql_query or conn is not defined;");
	if(sql_valid(sql_query, type) === false) throw TypeError("no valid is sql query");
	return true;
}

// not export function
function sql_valid(sql, sql_type){

	var reg = undefined;
	switch(sql_type){
		case "select":
			reg = /(select|SELECT)([\s]+)(.+|[\*])([\s]+)(from|FROM)([\s]+)(.+)/g;
			break;
		case "update":
			reg = /(update|UPDATE)([\s]+)(.+)(set|SET)([\s]+)(.+)/g;
			break;
		case "delete":
			reg = /(delte|DELETE)([\s]+)(from|FROM)([\s]+)(where|WHERE)/g;
			break;
		case "insert":
			reg = /(insert|INSERT)([\s]+)(into|INTO)([\s]+)(.+)(value|VALUE)([\s])(.+)/g;
		default:
			break;
	}

	return reg.test(sql);
}
function mysql_query(sql_query, conn, type){
	switch(type){
		case "select":
			return function(callback){
				return conn.query(sql_query, function(err, rows){
					if(err) callback(err);
					else {
						callback(null, rows);
					}
				});
			}
		case "insert_ret_id":
			return function(callback){
				return conn.query(sql_query, function (err, result){
					if(err) callback(err);
					else callback(null, result.insertId);
				});
			}
		case "insert":
			return function(callback){
				return conn.query(sql_query, function (err, result){
					if(err) callback(err);
					else callback(null, result);
					/*
						result格式：
						{ fieldCount: 0,
  						  affectedRows: 1,
  						  insertId: 12,
  						  serverStatus: 2,
  						  warningCount: 0,
  						  message: '',
  						  protocol41: true,
  						  changedRows: 0 }
					*/
				});
			}
		case "del_affected_rows":
			return function(callback){
				return conn.query(sql_query, function(err,result){
					if(err) callback(err);
					else callback(null, result.affectedRows);
				})
			}
		case "update_changed_rows":
			return function(callback){
				return conn.query(sql_query, function(err,result){
					if(err) callback(err);
					else callback(null, result.changedRows);
				})
			}
		case "update":
			return function(callback){
				return conn.query(sql_query, function(err,result){
					if(err) callback(err);
					else callback(null, result);
				})
			}
		case "call":
			return function(callback){
				return conn.query(sql_query, function(err, rows){
					if(err) callback(err);
					else {
						callback(null, rows);
					}
				});
			} 
	}
}

function mysql_execute( conn, query, params, options ) {
	if ( !options )
		options = { prepare:true };
	else if ( !options.prepare )
		options.prepare =true ;
	
	return function(callback){
		return conn.execute( query, params, options, function(err, rs){
			if(err) callback(err);
			else {
				callback(null, rs);
			}
		});
	}
}

function mysql_transaction ( conn, queries, params, options ) {
	var concfg = conn.client.config.connectionConfig; 
	var trans = mysqltransaction( 
			{ connection: [ mysql.createConnection, { 
			                database: concfg.database,
			        		host: concfg.host,
			        		user: concfg.user,
			        		password: concfg.password }
                ] } ); 
	
	return function(callback){
		return trans.set(function(err, safeCon){
		  if (err) {
		    callback(err, null);
		  }
		  safeCon.on('commit', function(){
		    callback( null, null ); 
		  });
		  safeCon.on('rollback', function(err){
		    callback(null, err ); 
		  });
		  
		  var resultCount =0;
		  function resultOn (result) {
		    resultCount += 1;
		    if (resultCount === queries.length) {
		      safeCon.commit();
		    }
		  };

		  for (var i=0; i<queries.length; i++ ) {  
			  var q = safeCon.query( queries[i], params[i] );
			  q.on('result', resultOn).on('error',  safeCon.rollback.bind(safeCon) );  // 
		  }
	    }  );
	}
}

module.exports.mysql_select = mysql_select;//执行select语句，返回执行节目
module.exports.mysql_insert_ret_id = mysql_insert_ret_id;//执行insert操作，操作成功后会返回插入的id号
module.exports.mysql_insert = mysql_insert;
module.exports.mysql_del_ret_affected_rows = mysql_del_ret_affected_rows;//执行delete操作，操作成功后会返回删除的行数
module.exports.mysql_update_ret_changed_rows =mysql_update_ret_changed_rows;
module.exports.mysql_update = mysql_update;
module.exports.mysql_update_by_preparing_query = mysql_update_by_preparing_query;//执行update操作，参数通过format方式处理后，返回更新的行数
module.exports.mysql_select_by_preparing_query = mysql_select_by_preparing_query;
module.exports.mysql_delete_by_preparing_query = mysql_delete_by_preparing_query;
module.exports.mysql_call_by_preparing_query = mysql_call_by_preparing_query;

module.exports.mysql_execute = mysql_execute;

module.exports.execute = mysql_execute;
module.exports.mysql_transaction = mysql_transaction;