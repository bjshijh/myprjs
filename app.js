var express = require('express');
var path = require('path');
var ftcomm = require('ftcommon');

var xmlParser = require('express-xml-bodyparser');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');

var useMockData = !!process.env.NODE_MOCK;
var routerPath = useMockData?'./mock':'./routes';

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false, type:function(req){
		var contentType = req.headers['content-type'];
		return contentType && contentType.indexOf('urlencoded') >= 0;
	}
}));
app.use(xmlParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin','*');
	//req.isMock = useMockData;
	var q = req.body.q || req.query.q;
	var z = req.body.z || req.query.z;
	if ( q )
	{
            try
            {
                var x = des.decrypt(q);
                var o = JSON.parse(x);
                req.jsonData = o;
            }
            catch(e)
            {
                console.error({err: e}, 'Error decrypt request data');
                res.json(result.error(codes.ERROR_DECRYPT));
                //next(e);
                return;
            }
            if ( req.body.q ) req.body.q=x;
            else req.query.q = x;
	}
	if(z){
	   try {
                var o = JSON.parse(z);
                req.jsonData = o;
            }
            catch(e)
            {
                console.error({err: e}, 'Error parseing json object');
                res.json(result.error(codes.ERROR_DECRYPT));
                return;
            }
	}
	next();
});

var routes = require('./routes/index');
var user = require(routerPath+'/user');
var book = require(routerPath+'/book');

app.use ('/', routes );
app.use('/user', user );
app.use('/book', book );

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
	console.log( {err:err, req:req}, 'HTTP 500: '+req.originalUrl);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
