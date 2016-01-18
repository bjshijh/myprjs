var ftcomm = require('ftcommon');
var lang = ftcomm.lang;
var client = require('./client');
var config = require('../config');
var MysqlWrapper = ftcomm.mysql;
var mysql = require('mysql');
var params = {};
lang.mixin(params, config.mysql);
params.queryFormat = function (query, values) {
	if (!values) return query;
	if ( lang.isArray (values ) ) {
		return mysql.format.apply(mysql, arguments);
	}
	return query.replace(/\:(\w+)/g, function (txt, key) {
		if (values.hasOwnProperty(key)) {
			return mysql.escape(values[key]);
		}
		return txt;
	});
};
var pool  = mysql.createPool(params);

var MysqlClient = function(args){
	lang.mixin(this, args);
	this.connection = new MysqlWrapper({
		client:pool
	});
};

MysqlClient.prototype = client;

exports = module.exports = new MysqlClient();
