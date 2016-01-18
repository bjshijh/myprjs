var express = require('express');
var path = require('path');
var ftcomm = require('ftcommon');

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
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	log.info({request: req});
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
//var user = require(routerPath+'/user');
//var book = require(routerPath+'/book');

app.use ('/', routes );
//app.user('/user', user );
//app.user('/book', book );

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
	log.error({err:err, req:req}, 'HTTP 500: '+req.originalUrl);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
