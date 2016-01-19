var AppUser = require( '../model/AppUser');
var co=require('co');
var http = require('http');

var u0 = { nickname: 'Lanlan', apppassword:'123456', email: '21411759.com' };
var u1 = { nickname: 'LegalAlien', apppassword:'123456', email: '103779176.com' };
var u2 = { nickname: 'Ariel', apppassword:'123456', email: '2539616812.com' };

co ( function *( callback ) {
    try{ 
        /*
        var user = new AppUser();
        yield user.addUser( u0 );
        console.log( user );
        */
        var post_data = JSON.stringify(u0);
        console.log( post_data );
	var options = {
		hostname: 'localhost',
		port: 9080,
		path: '/user/register?z='+post_data,
		method: 'POST'
	};
	var req = http.request(options, function(res){
	    res.setEncoding('utf8');
	    res.on('data', function(chunk){
                console.log( chunk );
	    	callback(null,chunk);
	    });
	});   
    } catch( e) {
        console.log(e);
    }
})