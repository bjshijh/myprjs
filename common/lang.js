var lang = require('ftcommon').lang;

lang.isGeneratorFunc = function ( fn ) {
    return fn.constructor.name === 'GeneratorFunction';
}

// 可以统一使用yield/co调用所有对象的方法. tgtobj是对象, funName是方法名, paramArray必须是个数组
lang.callFunc =function *( tgtobj, funName, paramArray ) {
	if ( !tgtobj || !funName )
		throw "parameter object and funName can Not be null";

	if ( !tgtobj[funName] || typeof(tgtobj[funName]) != "function"  )
		throw "object with function name (" + funName + ") must be defined";

	if ( tgtobj[funName].constructor.name =='GeneratorFunction' )
		return yield tgtobj[funName].apply( tgtobj, paramArray);
	else
		return tgtobj[funName].apply( tgtobj, paramArray );
};

exports = module.exports=lang;
