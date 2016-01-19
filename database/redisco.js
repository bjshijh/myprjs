var co = require('co');
var config = require('../config');

//  单实例的Redis
var redisClient = require('redis').createClient( config.redis.port, config.redis.host );
var redisWrapper = require('co-redis');
var redisCo = redisWrapper(redisClient);

co( function *() { 
	yield redisCo.auth( config.redis.password );
	yield redisCo.select( config.redis.database );
})


//  Redis Cluster 
/*
var Redis = require('ioredis');
var redisCluster = new Redis.Cluster( config.redis.nodes ); 
var redisWrapper = require('co-redis');
var redisCo = redisWrapper(redisCluster);
*/

var synchRedisCluster, synchRedisCo, synchSites ;
var dbtype = "redis"
var redisCommands = {
		DEL : 1,
		KEYS : 0,
		RANDOMKEY  : 0,
		TTL  : 0,
		EXISTS  : 0,
		MOVE  : 0,
		RENAME  : 1,
		TYPE  : 0,
		EXPIRE  : 1,
		OBJECT  : 0,
		RENAMENX  : 1,
		EXPIREAT  : 1,
		PERSIST  : 1,
		SORT  : 0,

		SET  : 1,
		SETNX  : 1,
		SETEX  : 1,
		SETRANGE  : 1,
		MSET  : 1,
		MSETNX  : 1,
		APPEND  : 1,
		GET  : 0,
		MGET  : 0,
		GETRANGE  : 0,
		GETSET  : 1,
		STRLEN  : 0,
		DECR  : 1,
		DECRBY  : 1,
		INCR  : 1,
		INCRBY  : 1,
		SETBIT  : 1,
		GETBIT  : 0,

		HSET  : 1,
		HSETNX  : 1,
		HMSET  : 0,
		HGET  : 0,
		HMGET  : 0,
		HGETALL  : 0,
		HDEL  : 1,
		HLEN  : 0,
		HEXISTS  : 0,
		HINCRBY  : 1,
		HKEYS  : 0,
		HVALS  : 0,

		LPUSH  : 1,
		LPUSHX  : 1,
		RPUSH  : 1,
		RPUSHX  : 1,
		LPOP  : 1,
		RPOP  : 1,
		BLPOP  : 1,
		BRPOP  : 1,
		LLEN  : 0,
		LRANGE  : 0,
		LREM  : 1,
		LSET  : 1,
		LTRIM  : 1,
		LINDEX  : 0,
		LINSERT  : 1,
		RPOPLPUSH  : 1,
		BRPOPLPUSH  : 1,

		SADD  : 1,
		SREM  : 1,
		SMEMBERS  : 0,
		SISMEMBER  : 0,
		SCARD  : 0,
		SMOVE  : 1,
		SPOP  : 1,
		SRANDMEMBER  : 0,
		SINTER  : 0,
		SINTERSTORE  : 1,
		SUNION  : 0,
		SUNIONSTORE  : 1,
		SDIFF  : 0,
		SDIFFSTORE  : 1,

		ZADD  : 1,
		ZREM  : 1,
		ZCARD  : 0,
		ZCOUNT  : 0,
		ZSCORE  : 0,
		ZINCRBY  : 1,
		ZRANGE  : 0,
		ZREVRANGE  : 0,
		ZRANGEBYSCORE  : 0,
		ZREVRANGEBYSCORE  : 0,
		ZRANK  : 0,
		ZREVRANK  : 0,
		ZREMRANGEBYRANK  : 1,
		ZREMRANGEBYSCORE  : 1,
		ZINTERSTORE  : 1,
		ZUNIONSTORE  : 1
}

module.exports = {
	redis : redisCo, 
	
	//asyncRedis: redisCluster,
	
	setObject: function * ( key, obj ) {
		var val = obj;
		if (  redisCo.exists( key )==1 )  // existed
			 redisCo.del( key );
			 
		if ( typeof(obj) == 'object') {
			val = JSON.stringify( obj );
		}
		yield redisCo.set( key, val);
	},
	
	getObject: function *( key) {
		var str = yield redisCo.get( key );
		if ( str ) { 
			var val = JSON.parse( str );
			return val;
		} else
			return null;
	},
	execute: function * ( commandName, args ) {
		var cmd = commandName.toUpperCase(); 
		if ( config.datasynch && config.datasynch.enabled && redisCommands[cmd] && redisCommands[cmd]==1) {
			if ( !synchRedisCluster ) { 
				synchRedisCluster = new Redis.Cluster( config.datasynch.synching_redis_nodes );  
				synchRedisCo = redisWrapper( synchRedisCluster );
				synchSites = config.datasynch.other_sites; 
			}
			
			try { 
				// rpush the command and arguments into the site's list
				var key, obj = { dbtype: 'redis', command: commandName, args: args };
				for ( var i=0; i<synchSites.length; i++ ) {
					key = synchSites[i];
					synchRedisCluster.rpush( key, JSON.stringify(obj), function(err, result) {
						//console.log ( err );
					} );
				}
			} catch (ex ){
				
			}
		}
		
		try {
			return yield redisCo[commandName].apply( this, args);
		} catch(ex){
			console.log( ex );
		}
	}
	
}
