var lang = require('../common/lang');
var config = require('../config');
var util = require('util');
var cassandra = require('cassandra-driver');
var authProvider = new cassandra.auth.PlainTextAuthProvider(config.cassandra.user, config.cassandra.password);
var client = new cassandra.Client({
	contactPoints: config.cassandra.contactPoints,
	keyspace: config.cassandra.keyspace,
	authProvider: authProvider
});

function generateColumns(columns)
{
	if ( !columns ) {
		return null;
	}
	else if ( util.isArray(columns) ) {
		return columns.join();
	}
	else if ( util.isObject(columns) ) {
		var first = true;
		var query = '';
		for ( var name in columns )
		{
			var alias = columns[name];
			if ( first ) {
				first = false;
			}
			else {
				query +=','
			}
			if ( alias ) query += name + ' as '+alias;
			else query += name;
		}
		return query;
	}
	else {
		return null;
	}
}

function generateWhere(where, sep)
{
	var query = '';
	var sep = sep?sep:' and ';
	if ( util.isString(where) ) {
		query += where;
	}
	else if ( !util.isArray(where) && util.isObject(where) ) {
		var first = true;
		for ( var name in where ) 
		{
			if ( first ) first = !first;
			else query += sep;
			query += name +'=:'+name;
		}
	}
	return query;
}

function generateInsertValues(values)
{
	var sep = ',';
	var query = '';
	var column = '';
	if ( util.isString(values) ) {
		query += values;
	}
	else if ( !util.isArray(values) && util.isObject(values) ) {
		var first = true;
		for ( var name in values) 
		{
			if ( first ) first = !first;
			else {
				query += sep;
				column += sep;
			}
			query += ':'+name;
			column += name;
		}
	}
	return {columns: column, values: query};
}

function generateSelect(args)
{
	//args.table
	//args.columns
	//args.where
	//args.limit
	var query = 'select ';
	var params = null;
	var columns = generateColumns(args.columns);
	if ( !columns ) columns = '*';
	query += columns + ' from '+ args.table;
	var where = generateWhere(args.where);
	if ( where ) query += ' where '+where;
	if ( args.params ) {
		params = args.params;
	}
	else if ( !util.isArray(args.where) && util.isObject(args.where) )
	{
		params = args.where;
	}
	if ( args.limit ) {
		query += ' limit '+ args.limit;
	}
	return {query: query, params: params};
}

function generateUpdate(args)
{
	var query = 'update ';
	var params = {};
	//var columns = generateColumns(args.columns);
	var values = generateWhere(args.values, ',');
	if ( args.params ) {
		params = args.params;
	}
	else if ( !util.isArray(args.values) && util.isObject(args.values) )
	{
		params = args.values;
	}
	//query += args.table + (columns ? '('+columns+')':'');
	query += args.table;
	if ( values ) query += ' set '+values;
	var where = generateWhere(args.where);
	if ( where ) {
		query += ' where '+where;
		if ( !util.isArray(args.where) && util.isObject(args.where) ) {
			lang.mixin(params, args.where);
		}
	}
	console.log(query, params);
	return {query: query, params: params};
}

function generateDelete(args)
{
	var query = 'delete from '+args.table;
	var params = null;
	var where = generateWhere(args.where);
	if ( where ) query += ' where '+where;
	if ( args.params ) {
		params = args.params;
	}
	else if ( !util.isArray(args.values) && util.isObject(args.values) ) {
		params = args.where;
	}
	return {query: query, params: params};
}

function generateInsert(args)
{
	var query = 'insert into '+args.table;
	var data = generateInsertValues(args.values);
	var columns = data.columns;
	var params = null;
	if ( args.params ) {
		params = args.params;
	}
	else if ( !util.isArray(args.values) && util.isObject(args.values) ) {
		params = args.values;
	}
	query += (columns ? ' ('+columns+')':' ');
	if ( data.values ) query += ' values ('+data.values +')';
	return {query: query, params: params};
}

function makeResult(result)
{
	if ( !result ) return null;
	return {
		result: result,
		index : -1,
		length: result.rowLength,
		currentRow: null,
		first: function(){
			return this.result.first();
		},
		next: function() {
			this.index++;
			if ( this.index < this.length ) {
				this.currentRow = this.result.rows[this.index];
				return true;
			}
			else {
				this.currentRow = null;
				return false;
			}
		},
		get: function(field) {
			if (field == null) return this.currentRow;
			else return this.currentRow?this.currentRow[field]: null;
		}
	};
}

module.exports = {
	connection: client,
	Long: cassandra.types.Long,
	uuid: function(){
		return cassandra.types.Uuid.random();
	},
	timeId: function(){
		return cassandra.types.TimeUuid.now();
	},
	longValue: function(val){
		if ( val == null ) val = 0;
		if ( util.isStirng(val) ){
			return cassandra.types.Long.fromString(val);
		}
		else {
			return cassandra.types.Long.fromNumber(val);
		}
	},
	select: function(args, fn) {
		var q = generateSelect(args);
		this.execute(q, function(err, result){
			fn (err, result);
		});
	},
	update: function(args, fn) {
		var q = generateUpdate(args);
		this.execute(q, function(err, result){
			fn (err, result);
		});
	},
	insert: function(args, fn) {
		var q = generateInsert(args);
		this.execute(q, function(err, result){
			fn (err, result);
		});
	},
	remove: function(args, fn) {
		var q = generateDelete(args);
		this.execute(q, function(err, result){
			fn (err, r);
		});
	},
	execute: function(args, fn) {
		client.execute(args.query, args.params, args.options?args.options:{prepare: true}, function(err, result){
			var r = makeResult(result);
			if (fn) fn (err, r);
		});
	},
	batch: function( queries, options, fn) {
		client.batch( queries, options?options:{prepare: true}, function(err){
			if (fn) fn (err, null);
		});
	},
	
	shutdown: function() {
		client.shutdown();
	},
	now: function(){
		return new Date();
	}
};
