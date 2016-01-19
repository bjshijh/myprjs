var ftcomm = require('ftcommon');
var mysqlHost = 'localhost';
var mysqlUser = 'student';
var mysqlPass = 'student';

var config = {
	debug: true,

	logLevel: 'debug',

	cassandra: {
		contactPoints: ['123.57.220.17'],
		keyspace : 'eagleeye'  //europecup
	},
	mysql: {
		connectionLimit: 30,
		database: 'schoollibrary',
		host: mysqlHost,
		user: mysqlUser,
		password: mysqlPass
	},
	qiniu: {
		accessKey : 'p7MfNM_IJ8Kq-qWasWQybnxYSIkZ3OsL8h43ZUlZ',
		scretKey: 'DjdLuBultG_8bjC8IOauFm-CRnJ3xAeo4i3JAZ_j',
		domain: '7xjjq3.com2.z0.glb.qiniucdn.com',
		bucket: 'fruitpub'
	},
        /*
	redis: {
		nodes:  [ { port: 30001, host: '101.200.2.187'}, { port: 30002, host: '101.200.2.187'}, { port: 30003, host: '101.200.2.187'} ]
	},*/
        redis: {
           host: '127.0.0.1', port: 6379, password: 'redis', database : 0 
        }, 
        
	statServer: {
		uri: 'http://127.0.0.1:4000' // must not use nginx proxy to connect because this is websocket
	},
	logger: {
		app: 'SchoolLibrary',
		name: 'SchoolLibrary',
		server: {
			host: 'localhost',
			port: 23456
		}
	},
	datasynch : {
		enabled: false,
		other_sites: [ 's2', 's3' ],
		mysite: 's1',
        synching_redis_nodes:  [ { port: 46379, host: '101.200.2.187'}, { port: 46380, host: '101.200.2.187'}, { port: 46381, host: '101.200.2.187'} ]
	}
};


if ( !ftcomm.isDebugEnv() ){
	config = require('./etc/production.js');
  console.log('Using production environment configuration');
}
else {
	ftcomm.useDebugConsole();
  console.log('Using debugging environment configuration');
}

module.exports = config;
