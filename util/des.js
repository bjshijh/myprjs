var assert = require('assert');
var crypto = require('crypto');

var secret = '94fccf96613b3afdecadcc87ce23db4f';
//var iv = crypto.createHash('md5').update(secret).digest('hex').substring(0, 8)
var iv = '';
var key = secret.substring(0, 24);
//var key = crypto.createHash('md5').update(secret).digest('hex').substring(0, 24);
var autoPad = true;
var inenc = 'utf8';
var outenc = 'hex';
var algorithm = 'des-ede3';
exports.encrypt = function(text) {  
	var cipher = crypto.createCipheriv(algorithm, key, iv);  
	cipher.setAutoPadding(autoPad)  //default true  
	var out = cipher.update(text, inenc, outenc);
	out += cipher.final(outenc);  
	return out;
} 

exports.decrypt = function(data) {
	var decipher = crypto.createDecipheriv(algorithm, key, iv);  
	decipher.setAutoPadding(autoPad);
	var txt = decipher.update(data, outenc, inenc);
	txt += decipher.final(inenc);      
	return txt;
}  

