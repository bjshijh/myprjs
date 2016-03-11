
date2String =function ( dttm ,f) {
	var z = {M:dttm.getMonth()+1,d:dttm.getDate(),h:dttm.getHours(),m:dttm.getMinutes(),s:dttm.getSeconds()};
	f = f.replace(/(M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-2);});
	return f.replace(/(y+)/g,function(v) {return dttm.getFullYear().toString().slice(-v.length);});
};